import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Topbar } from "./Topbar";
import { PageTransition } from "../motion/PageTransition";
import { OfflineBanner } from "../ui/OfflineBanner";

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <OfflineBanner />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
