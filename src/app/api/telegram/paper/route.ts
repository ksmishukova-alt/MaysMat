import { NextResponse } from "next/server";
import { sendPaperTaskReport } from "@/lib/telegram";
import { registerPaperSubmission } from "@/lib/paper-verdict-store";

function dataUrlToBlob(dataUrl: string): Blob | undefined {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return undefined;
  const bytes = Buffer.from(m[2], "base64");
  return new Blob([bytes], { type: m[1] });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      submissionId: string;
      taskId: string;
      taskNumber: number;
      taskTitle: string;
      childName: string;
      condition: string;
      paperUpload?: { fileName: string; mimeType: string; dataUrl?: string };
    };

    if (!body.submissionId || !body.taskId || !body.taskTitle || !body.condition) {
      return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
    }

    registerPaperSubmission({
      submissionId: body.submissionId,
      taskId: body.taskId,
      taskTitle: body.taskTitle,
      taskNumber: body.taskNumber ?? 0,
      childName: body.childName?.trim() || "Ребёнок",
      submittedAt: new Date().toISOString(),
    });

    let photoBlob: Blob | undefined;
    if (body.paperUpload?.dataUrl) {
      photoBlob = dataUrlToBlob(body.paperUpload.dataUrl);
    }

    const result = await sendPaperTaskReport(
      {
        submissionId: body.submissionId,
        taskId: body.taskId,
        taskNumber: body.taskNumber,
        taskTitle: body.taskTitle,
        childName: body.childName?.trim() || "Ребёнок",
        condition: body.condition,
        hasPhoto: Boolean(photoBlob),
      },
      photoBlob,
      body.paperUpload?.fileName,
    );

    if (!result.ok) {
      return NextResponse.json({
        ok: true,
        submissionId: body.submissionId,
        telegramError: result.error,
      });
    }

    return NextResponse.json({ ok: true, submissionId: body.submissionId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка сервера";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
