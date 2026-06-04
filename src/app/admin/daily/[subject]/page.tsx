import { AppShell } from "@/components/AppShell";
import { DailyEditor } from "@/components/admin/DailyEditor";
import type { DailySubject } from "@/lib/daily";
import { DAILY_SUBJECTS } from "@/data/daily-content";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ subject: string }>;
}

export default async function AdminDailySubjectPage({ params }: Props) {
  const { subject } = await params;
  if (!DAILY_SUBJECTS.includes(subject as DailySubject)) notFound();

  return (
    <AppShell>
      <DailyEditor subject={subject as DailySubject} />
    </AppShell>
  );
}
