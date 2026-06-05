import Link from "next/link";

import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";

import { BranchIntroVideo } from "@/components/BranchIntroVideo";

import { BranchTaskList } from "@/components/BranchTaskList";
import { HeadsLegsMigrationBanner } from "@/components/HeadsLegsMigrationBanner";
import { PaperVerdictSync } from "@/components/PaperVerdictSync";

import { getThinkingTypeLabel } from "@/data/branch-meta";

import { getMethodology } from "@/data/methodologies";

import { getBranchBySlug } from "@/data/thinking-map";



interface Props {

  params: Promise<{ slug: string }>;

}



export default async function BranchPage({ params }: Props) {

  const { slug } = await params;

  const branch = getBranchBySlug(slug);

  if (!branch) notFound();



  const methodology = getMethodology(branch.id);



  return (

    <AppShell>

      <div className="mb-6">

        <Link href="/tasks" className="text-sm text-brand-purple hover:underline">

          ← Задачи

        </Link>

        <h1 className="mt-2 text-2xl font-bold">{branch.title}</h1>

        <p className="text-gray-500">

          {getThinkingTypeLabel(branch.thinkingType)} · ~{branch.taskCount} задач

        </p>

      </div>



      <BranchIntroVideo branchId={branch.id} branchTitle={branch.title} />



      {methodology ? (

        <div className="mb-6 rounded-card bg-lavender-50 p-5 shadow-card">

          <h2 className="mb-2 font-semibold">Как думать в этой теме</h2>

          <p className="text-sm text-gray-600">{methodology.mentalModel}</p>

        </div>

      ) : null}

      {slug === "heads-legs" ? <HeadsLegsMigrationBanner /> : null}
      {slug === "heads-legs" ? <PaperVerdictSync /> : null}

      <BranchTaskList branchId={branch.id} branchTaskCount={branch.taskCount} />

    </AppShell>

  );

}

