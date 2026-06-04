import { MobileBottomNav, Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-lavender-100 p-3 pb-[calc(4.5rem+env(safe-area-inset-bottom)+0.75rem)] md:p-4 md:pb-4 lg:p-6 lg:pb-6">
      <div className="mx-auto flex max-w-[1400px] gap-4 lg:gap-6">
        {/* Tablet: компактный sidebar */}
        <div className="hidden shrink-0 md:block lg:hidden">
          <Sidebar compact />
        </div>
        {/* Desktop: полный sidebar */}
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
