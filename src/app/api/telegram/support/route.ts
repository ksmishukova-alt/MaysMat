import { NextResponse } from "next/server";
import { sendSupportMessage } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { childName?: string; message?: string };
    const childName = body.childName?.trim() || "Ребёнок";
    const message = body.message?.trim();

    if (!message || message.length < 3) {
      return NextResponse.json({ ok: false, error: "Напиши чуть подробнее" }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ ok: false, error: "Слишком длинное сообщение" }, { status: 400 });
    }

    const result = await sendSupportMessage(childName, message);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
