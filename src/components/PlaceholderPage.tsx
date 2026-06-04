import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";

export function PlaceholderPage({
  title,
  emoji,
}: {
  title: string;
  emoji: string;
}) {
  return (
    <AppShell>
      <Header />
      <div className="flex flex-col items-center justify-center rounded-card bg-white py-20 shadow-card">
        <span className="mb-4 text-6xl">{emoji}</span>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-2 text-gray-500">Раздел в разработке — фаза B/C</p>
      </div>
    </AppShell>
  );
}
