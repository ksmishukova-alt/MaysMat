import { NextResponse } from "next/server";
import {
  clearAwaitingComment,
  getAwaitingComment,
  getVerdictBySubmissionId,
  parseVerdictCallback,
  setAwaitingComment,
  setSubjectVerdict,
} from "@/lib/daily-verdict-store";
import {
  clearAwaitingPaperComment,
  getAwaitingPaperComment,
  getPaperVerdict,
  parsePaperVerdictCallback,
  setAwaitingPaperComment,
  setPaperVerdict,
} from "@/lib/paper-verdict-store";
import { answerCallback, notifyVerdictOnMessage, telegramApi } from "@/lib/telegram";
import type { DailySubject } from "@/lib/daily";

const SUBJECT_TITLE: Record<DailySubject, string> = {
  reading: "Чтение",
  russian: "Русский",
  math: "Математика",
};

interface TelegramUpdate {
  callback_query?: {
    id: string;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
  };
  message?: {
    text?: string;
    chat: { id: number };
  };
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = request.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  const update = (await request.json()) as TelegramUpdate;

  const cq = update.callback_query;
  if (cq?.data && cq.message) {
    const paperParsed = parsePaperVerdictCallback(cq.data);
    if (paperParsed) {
      const { action, submissionId } = paperParsed;
      const existing = getPaperVerdict(submissionId);
      const chatId = cq.message.chat.id;

      if (!existing) {
        await answerCallback(cq.id, "Отправка не найдена");
        return NextResponse.json({ ok: true });
      }

      if (action === "ok") {
        setPaperVerdict(submissionId, "approved", { stars: 3 });
        clearAwaitingPaperComment(chatId);
        const label = `✅ Зачёт: задача ${existing.taskNumber}`;
        await answerCallback(cq.id, label);
        await notifyVerdictOnMessage(
          chatId,
          cq.message.message_id,
          `${label} «${existing.taskTitle}»\nРебёнок увидит это в приложении.`,
        );
        return NextResponse.json({ ok: true });
      }

      setPaperVerdict(submissionId, "redo");
      setAwaitingPaperComment(chatId, { submissionId, taskId: existing.taskId });
      await answerCallback(cq.id, "Напишите комментарий");
      await notifyVerdictOnMessage(
        chatId,
        cq.message.message_id,
        `🔄 Переделать: задача ${existing.taskNumber} «${existing.taskTitle}»\n\nНапишите комментарий для ребёнка (или «—» без комментария).`,
      );
      return NextResponse.json({ ok: true });
    }

    const parsed = parseVerdictCallback(cq.data);
    if (!parsed) {
      await answerCallback(cq.id, "Неизвестная команда");
      return NextResponse.json({ ok: true });
    }

    const { action, submissionId, subject } = parsed;
    const existing = getVerdictBySubmissionId(submissionId, subject);
    const date = existing?.date ?? new Date().toISOString().slice(0, 10);
    const chatId = cq.message.chat.id;
    const subjectLabel = SUBJECT_TITLE[subject];

    if (action === "ok") {
      setSubjectVerdict(submissionId, date, subject, "approved");
      clearAwaitingComment(chatId);
      const label = `✅ Зачёт: ${subjectLabel}`;
      await answerCallback(cq.id, label);
      await notifyVerdictOnMessage(
        chatId,
        cq.message.message_id,
        `${label}\nРебёнок увидит это в приложении.`,
      );
      return NextResponse.json({ ok: true });
    }

    setSubjectVerdict(submissionId, date, subject, "redo");
    setAwaitingComment(chatId, { submissionId, date, subject });
    await answerCallback(cq.id, "Напишите комментарий");
    await notifyVerdictOnMessage(
      chatId,
      cq.message.message_id,
      `🔄 Переделать: ${subjectLabel}\n\nНапишите комментарий для ребёнка одним сообщением (или «—» без комментария).`,
    );
    return NextResponse.json({ ok: true });
  }

  const msg = update.message;
  if (msg?.text) {
    const paperPending = getAwaitingPaperComment(msg.chat.id);
    if (paperPending) {
      const raw = msg.text.trim();
      const comment = raw === "—" || raw === "-" ? undefined : raw;
      setPaperVerdict(paperPending.submissionId, "redo", { comment });
      clearAwaitingPaperComment(msg.chat.id);

      const existing = getPaperVerdict(paperPending.submissionId);
      await telegramApi("sendMessage", {
        chat_id: msg.chat.id,
        text: comment
          ? `💬 Задача ${existing?.taskNumber ?? ""}: «${comment}»\n\nРебёнок увидит комментарий.`
          : `🔄 Переделать без комментария.`,
      });
      return NextResponse.json({ ok: true });
    }

    const pending = getAwaitingComment(msg.chat.id);
    if (pending) {
      const raw = msg.text.trim();
      const comment = raw === "—" || raw === "-" ? undefined : raw;
      setSubjectVerdict(
        pending.submissionId,
        pending.date,
        pending.subject,
        "redo",
        comment,
      );
      clearAwaitingComment(msg.chat.id);

      const subjectLabel = SUBJECT_TITLE[pending.subject];
      await telegramApi("sendMessage", {
        chat_id: msg.chat.id,
        text: comment
          ? `💬 ${subjectLabel}: «${comment}»\n\nРебёнок увидит комментарий на странице «Задачи».`
          : `🔄 ${subjectLabel}: переделать без комментария.`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
