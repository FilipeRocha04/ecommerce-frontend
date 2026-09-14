import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";

export function SiteLayout({
  children,
  hideFooter,
}: {
  children: ReactNode;
  hideFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {!hideFooter && <Footer />}
      <BottomNav />
    </div>
  );
}
