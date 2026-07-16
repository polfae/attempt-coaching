import type { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { ScrollReveal } from "./ScrollReveal";
import { getSiteSettings } from "@/lib/firestore";

export async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const { updatedAt, ...footerSettings } = settings;

  return (
    <>
      <ScrollReveal />
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter settings={footerSettings} />
    </>
  );
}
