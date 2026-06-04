import { NextResponse } from "next/server";
import type { DailyVerdict } from "@/lib/daily-submission-log";
import type { DailySubject } from "@/lib/daily";
import {
  clearVerdictsByDate,
  getVerdictsForDate,
  setSubjectVerdict,
} from "@/lib/daily-verdict-store";

const SUBJECTS: DailySubject[] = ["reading", "russian", "math"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const verdicts = getVerdictsForDate(date);
  const subjects: Partial<
    Record<DailySubject, { verdict: DailyVerdict; verdictComment?: string; updatedAt: string }>
  > = {};

  for (const subject of SUBJECTS) {
    const v = verdicts[subject];
    if (v) {
      subjects[subject] = {
        verdict: v.verdict,
        verdictComment: v.verdictComment,
        updatedAt: v.updatedAt,
      };
    }
  }

  return NextResponse.json({ date, subjects });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      date: string;
      submissionId: string;
      subject: DailySubject;
      verdict: DailyVerdict;
      comment?: string;
    };

    if (!body.date || !body.submissionId || !body.subject || !body.verdict) {
      return NextResponse.json(
        { error: "date, submissionId, subject, verdict required" },
        { status: 400 },
      );
    }

    if (!SUBJECTS.includes(body.subject)) {
      return NextResponse.json({ error: "invalid subject" }, { status: 400 });
    }

    if (body.verdict !== "approved" && body.verdict !== "redo" && body.verdict !== "pending") {
      return NextResponse.json({ error: "invalid verdict" }, { status: 400 });
    }

    const entry = setSubjectVerdict(
      body.submissionId,
      body.date,
      body.subject,
      body.verdict,
      body.verdict === "redo" ? body.comment : undefined,
    );

    return NextResponse.json({
      ok: true,
      subject: body.subject,
      verdict: entry.verdict,
      verdictComment: entry.verdictComment,
      updatedAt: entry.updatedAt,
    });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  clearVerdictsByDate(date);
  return NextResponse.json({ ok: true });
}
