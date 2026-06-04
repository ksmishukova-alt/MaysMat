import type { DailyDayLog, DailySubjectLog } from "@/lib/daily-submission-log";
import type { DailySubject } from "@/lib/daily";
import { PROGRAM_WEEK_LABELS, WEEKDAY_LABELS } from "@/data/daily-content";

const SUBJECT_EMOJI = { reading: "📖", russian: "✏️", math: "🔢" } as const;
const SUBJECT_TITLE = { reading: "Чтение", russian: "Русский", math: "Математика" } as const;
const CAPTION_LIMIT = 1024;

export interface DailyReportFile {
  subject: string;
  exerciseId: string;
  file: File | Blob;
  fileName?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function truncate(text: string, max = 400): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function formatSubjectLog(log: DailySubjectLog, hasAttachedFiles: boolean): string {
  const lines: string[] = [];
  for (const ex of log.exercises) {
    const mark = ex.correct ? "✅" : "❌";
    if (ex.passagePreview) {
      lines.push(`<i>Текст:</i> ${escapeHtml(truncate(ex.passagePreview, 350))}`);
    }
    lines.push(`${mark} ${escapeHtml(truncate(ex.question, 200))}`);
    if (ex.upload && hasAttachedFiles) {
      lines.push(`   → 📎 <b>ответ во вложении</b>`);
    } else if (ex.upload) {
      lines.push(`   → 📎 ${escapeHtml(ex.upload.fileName)}`);
    } else {
      lines.push(`   → <b>${escapeHtml(ex.userAnswer)}</b>`);
    }
  }
  return lines.join("\n");
}

/** Одно сообщение на предмет — без дублирования с отдельными файлами */
export function formatDailySubjectMessage(log: DailyDayLog, subject: DailySubject, hasFiles: boolean): string {
  const sub = log.subjects[subject];
  if (!sub) return "";

  const week = PROGRAM_WEEK_LABELS[log.programWeek] ?? `Неделя ${log.programWeek + 1}`;
  const day = WEEKDAY_LABELS[log.weekdayIndex] ?? "День";

  const parts = [
    `${SUBJECT_EMOJI[subject]} <b>${SUBJECT_TITLE[subject]}</b> · ${escapeHtml(log.childName)}`,
    `${week} · ${day} · задание № ${log.workbookDay} из 30`,
    `ID: <code>${escapeHtml(log.submissionId)}</code>`,
    "",
    formatSubjectLog(sub, hasFiles),
  ];

  return parts.join("\n");
}

function fitCaption(html: string, max = CAPTION_LIMIT): string {
  if (html.length <= max) return html;
  return `${html.slice(0, max - 1)}…`;
}

function dedupeFiles(files: DailyReportFile[]): DailyReportFile[] {
  const seen = new Set<string>();
  return files.filter((file) => {
    const key = `${file.subject}:${file.exerciseId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function verdictKeyboard(submissionId: string, subject: DailySubject) {
  return {
    inline_keyboard: [
      [
        { text: "✅ Зачёт", callback_data: `ok:${submissionId}:${subject}` },
        { text: "🔄 Переделать", callback_data: `no:${submissionId}:${subject}` },
      ],
    ],
  };
}

export async function telegramApi(
  method: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN не задан" };

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { ok: boolean; result?: unknown; description?: string };
  return data;
}

async function telegramMultipart(
  method: string,
  formData: FormData
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN не задан" };

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as { ok: boolean; result?: unknown; description?: string };
  return data;
}

async function sendTextMessage(
  chatId: string,
  text: string,
  withVerdictButtons: boolean,
  submissionId: string,
  subject?: DailySubject,
): Promise<{ ok: boolean; error?: string }> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: fitCaption(text, 3900),
    parse_mode: "HTML",
  };
  if (withVerdictButtons && subject) {
    body.reply_markup = verdictKeyboard(submissionId, subject);
  }
  const result = await telegramApi("sendMessage", body);
  if (!result.ok) {
    return { ok: false, error: result.description ?? "Telegram API error" };
  }
  return { ok: true };
}

async function sendMediaMessage(
  chatId: string,
  item: DailyReportFile,
  caption: string,
  withVerdictButtons: boolean,
  submissionId: string,
  subject?: DailySubject,
): Promise<{ ok: boolean; error?: string }> {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("caption", fitCaption(caption));
  formData.append("parse_mode", "HTML");

  if (withVerdictButtons && subject) {
    formData.append("reply_markup", JSON.stringify(verdictKeyboard(submissionId, subject)));
  }

  const name =
    item.fileName ??
    (item.file instanceof File ? item.file.name : undefined) ??
    `${item.exerciseId}.jpg`;

  const mime =
    item.file instanceof File ? item.file.type : (item.file as Blob).type || "application/octet-stream";

  formData.append(mime.startsWith("image/") ? "photo" : "document", item.file, name);

  const method = mime.startsWith("image/") ? "sendPhoto" : "sendDocument";
  const result = await telegramMultipart(method, formData);
  if (!result.ok) {
    return { ok: false, error: result.description ?? "Telegram file error" };
  }
  return { ok: true };
}

/** @deprecated отдельное сообщение на весь день больше не используется */
export async function sendDailyVerdictPrompt(_log: DailyDayLog): Promise<{ ok: boolean; error?: string }> {
  return { ok: true };
}

/** Отправляет один предмет с кнопками проверки */
export async function sendDailySubjectReport(
  log: DailyDayLog,
  subject: DailySubject,
  files: DailyReportFile[] = [],
  attachVerdictButtons = true,
): Promise<{ ok: boolean; error?: string }> {
  const chatId = process.env.TELEGRAM_PARENT_CHAT_ID;
  if (!chatId) return { ok: false, error: "TELEGRAM_PARENT_CHAT_ID не задан" };

  const sub = log.subjects[subject];
  if (!sub) return { ok: false, error: "Предмет не сдан" };

  const subjectFiles = dedupeFiles(files.filter((f) => f.subject === subject));
  const text = formatDailySubjectMessage(log, subject, subjectFiles.length > 0);
  const withButtons = attachVerdictButtons;

  if (subjectFiles.length === 0) {
    return sendTextMessage(chatId, text, withButtons, log.submissionId, subject);
  }

  const fileResult = await sendMediaMessage(
    chatId,
    subjectFiles[0],
    text,
    withButtons,
    log.submissionId,
    subject,
  );
  if (!fileResult.ok) return fileResult;

  const title = SUBJECT_TITLE[subject];
  for (let i = 1; i < subjectFiles.length; i++) {
    const shortCaption = `${SUBJECT_EMOJI[subject]} ${title} · файл ${i + 1}`;
    const extraResult = await sendMediaMessage(
      chatId,
      subjectFiles[i],
      shortCaption,
      false,
      log.submissionId,
      subject,
    );
    if (!extraResult.ok) return extraResult;
  }

  return { ok: true };
}

export async function answerCallback(callbackQueryId: string, text: string): Promise<void> {
  await telegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
}

export async function notifyVerdictOnMessage(
  chatId: number,
  messageId: number,
  verdictText: string
): Promise<void> {
  await telegramApi("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text: verdictText,
    reply_to_message_id: messageId,
  });
}

export async function sendSupportMessage(
  childName: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  const chatId = process.env.TELEGRAM_PARENT_CHAT_ID;
  if (!chatId) return { ok: false, error: "TELEGRAM_PARENT_CHAT_ID не задан" };

  const text = [
    "<b>🆘 Помощь · МышМат</b>",
    `От: <b>${escapeHtml(childName)}</b>`,
    "",
    escapeHtml(message.trim()),
  ].join("\n");

  const result = await telegramApi("sendMessage", {
    chat_id: chatId,
    text: text.slice(0, 3900),
    parse_mode: "HTML",
  });

  if (!result.ok) {
    return { ok: false, error: result.description ?? "Не удалось отправить" };
  }
  return { ok: true };
}
