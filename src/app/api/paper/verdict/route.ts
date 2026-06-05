import { NextResponse } from "next/server";
import {
  getPaperVerdict,
  getVerdictsForTaskIds,
  setPaperVerdict,
} from "@/lib/paper-verdict-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskIdsRaw = searchParams.get("taskIds");
  const submissionId = searchParams.get("submissionId");

  if (submissionId) {
    const v = getPaperVerdict(submissionId);
    if (!v) return NextResponse.json({ verdict: null });
    return NextResponse.json({
      submissionId: v.submissionId,
      taskId: v.taskId,
      verdict: v.verdict,
      verdictComment: v.verdictComment,
      stars: v.stars,
      updatedAt: v.updatedAt,
    });
  }

  if (!taskIdsRaw) {
    return NextResponse.json({ error: "taskIds or submissionId required" }, { status: 400 });
  }

  const taskIds = taskIdsRaw.split(",").filter(Boolean);
  const verdicts = getVerdictsForTaskIds(taskIds);
  const out: Record<
    string,
    { submissionId: string; verdict: string; verdictComment?: string; stars?: number }
  > = {};

  for (const [taskId, v] of Object.entries(verdicts)) {
    out[taskId] = {
      submissionId: v.submissionId,
      verdict: v.verdict,
      verdictComment: v.verdictComment,
      stars: v.stars,
    };
  }

  return NextResponse.json({ verdicts: out });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      submissionId: string;
      verdict: "approved" | "redo";
      stars?: number;
      comment?: string;
    };

    if (!body.submissionId || !body.verdict) {
      return NextResponse.json({ error: "submissionId and verdict required" }, { status: 400 });
    }

    if (body.verdict !== "approved" && body.verdict !== "redo") {
      return NextResponse.json({ error: "invalid verdict" }, { status: 400 });
    }

    const entry = setPaperVerdict(body.submissionId, body.verdict, {
      stars: body.stars,
      comment: body.comment,
    });

    if (!entry) {
      return NextResponse.json({ error: "submission not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      taskId: entry.taskId,
      verdict: entry.verdict,
      verdictComment: entry.verdictComment,
      stars: entry.stars,
    });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
