import { NextResponse } from "next/server";
import { telegramApi } from "@/lib/telegram";

/** Помогает узнать chat_id: напишите боту /start, затем откройте этот URL в браузере. */
export async function GET() {
  const result = await telegramApi("getUpdates", { limit: 10 });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.description }, { status: 502 });
  }

  const updates = (result.result as Array<{ message?: { chat: { id: number; first_name?: string; username?: string }; text?: string } }>) ?? [];

  const chats = updates
    .map((u) => u.message?.chat)
    .filter(Boolean)
    .map((chat) => ({
      chatId: chat!.id,
      name: chat!.first_name,
      username: chat!.username,
    }));

  const unique = [...new Map(chats.map((c) => [c.chatId, c])).values()];

  return NextResponse.json({
    ok: true,
    chats: unique,
    hint: "Скопируйте chatId в TELEGRAM_PARENT_CHAT_ID в .env.local",
  });
}
