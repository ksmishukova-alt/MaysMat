import { NextResponse } from "next/server";
import type { DailyDayLog } from "@/lib/daily-submission-log";
import type { DailySubject } from "@/lib/daily";
import { sendDailySubjectReport, type DailyReportFile } from "@/lib/telegram";
import { setSubjectVerdict } from "@/lib/daily-verdict-store";

const SUBJECTS: DailySubject[] = ["reading", "russian", "math"];

function parseMultipart(request: Request): Promise<{
  log: DailyDayLog;
  subject: DailySubject;
  withSubjectVerdict: boolean;
  files: DailyReportFile[];
}> {
  return request.formData().then((formData) => {
    const logRaw = formData.get("log");
    const subjectRaw = formData.get("subject");
    if (typeof logRaw !== "string" || typeof subjectRaw !== "string") {
      throw new Error("Некорректные данные");
    }
    if (!SUBJECTS.includes(subjectRaw as DailySubject)) {
      throw new Error("Неизвестный предмет");
    }
    const log = JSON.parse(logRaw) as DailyDayLog;
    const subject = subjectRaw as DailySubject;
    const withSubjectVerdict = formData.get("withSubjectVerdict") === "1";
    const files: DailyReportFile[] = [];

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("file:")) continue;
      if (!(value instanceof File)) continue;
      const parts = key.split(":");
      const fileSubject = parts[1];
      const exerciseId = parts.slice(2).join(":");
      if (!fileSubject || !exerciseId || fileSubject !== subject) continue;
      files.push({
        subject: fileSubject,
        exerciseId,
        file: value,
        fileName: value.name,
      });
    }

    return { log, subject, withSubjectVerdict, files };
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let log: DailyDayLog;
    let subject: DailySubject;
    let withSubjectVerdict = false;
    let files: DailyReportFile[] = [];

    if (contentType.includes("multipart/form-data")) {
      ({ log, subject, withSubjectVerdict, files } = await parseMultipart(request));
    } else {
      const body = (await request.json()) as {
        log: DailyDayLog;
        subject: DailySubject;
        withSubjectVerdict?: boolean;
      };
      log = body.log;
      subject = body.subject;
      withSubjectVerdict = Boolean(body.withSubjectVerdict);
    }

    if (!log?.submissionId || !log?.date || !log?.childName || !subject) {
      return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
    }

    if (!log.subjects?.[subject]) {
      return NextResponse.json({ ok: false, error: "Предмет не сдан" }, { status: 400 });
    }

    const alreadyVerdicted =
      log.subjects[subject]?.verdict === "approved" ||
      log.subjects[subject]?.verdict === "redo";

    const result = await sendDailySubjectReport(
      log,
      subject,
      files,
      withSubjectVerdict && !alreadyVerdicted,
    );
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    }

    if (withSubjectVerdict && !alreadyVerdicted) {
      try {
        setSubjectVerdict(log.submissionId, log.date, subject, "pending");
      } catch {
        /* не блокируем отправку */
      }
    }

    return NextResponse.json({
      ok: true,
      subject,
      subjectVerdictSent: withSubjectVerdict && !alreadyVerdicted,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка сервера";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
