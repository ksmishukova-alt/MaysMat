"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function AdminTelegramPage() {
  const [chats, setChats] = useState<Array<{ chatId: number; name?: string; username?: string }>>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const discover = async () => {
    setError(null);
    const res = await fetch("/api/telegram/discover-chat");
    const data = (await res.json()) as {
      ok?: boolean;
      chats?: typeof chats;
      error?: string;
    };
    if (!data.ok) {
      setError(data.error ?? "Ошибка");
      return;
    }
    setChats(data.chats ?? []);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/daily" className="text-sm text-brand-purple hover:underline">
          ← Daily
        </Link>
        <h1 className="mt-2 mb-4 text-2xl font-bold">Telegram · MyshMat_bot</h1>

        <div className="space-y-4 rounded-card bg-white p-6 shadow-card text-sm text-gray-700">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Создайте <code className="rounded bg-gray-100 px-1">.env.local</code> по образцу{" "}
              <code className="rounded bg-gray-100 px-1">.env.example</code>
            </li>
            <li>
              Вставьте токен бота в <code>TELEGRAM_BOT_TOKEN</code> (не коммитьте в git!)
            </li>
            <li>
              Напишите боту{" "}
              <a href="https://t.me/MyshMat_bot" className="text-brand-purple hover:underline">
                @MyshMat_bot
              </a>{" "}
              команду <b>/start</b>
            </li>
            <li>Нажмите кнопку ниже и скопируйте chatId в <code>TELEGRAM_PARENT_CHAT_ID</code></li>
            <li>Перезапустите <code>npm run dev</code></li>
          </ol>

          <button
            type="button"
            onClick={() => void discover()}
            className="rounded-xl bg-brand-purple px-4 py-2 text-white"
          >
            Найти chat_id
          </button>

          {error ? <p className="text-red-600">{error}</p> : null}

          {chats.length > 0 ? (
            <ul className="space-y-2">
              {chats.map((c) => (
                <li key={c.chatId} className="rounded-lg bg-lavender-50 p-3 font-mono text-xs">
                  chatId: {c.chatId}
                  {c.name ? ` · ${c.name}` : ""}
                  {c.username ? ` (@${c.username})` : ""}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="text-xs text-gray-500">
            После каждого предмета в Telegram приходит сообщение с кнопками{" "}
            <b>✅ Зачёт</b> / <b>🔄 Переделать</b> для этого предмета. Комментарий
            при переделке относится только к выбранному предмету — остальные не
            сбрасываются. Webhook: <code>/api/telegram/webhook</code>.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
