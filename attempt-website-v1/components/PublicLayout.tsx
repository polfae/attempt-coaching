import type { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { getSiteSettings } from "@/lib/firestore";

export async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const { updatedAt, ...footerSettings } = settings;

  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter settings={footerSettings} />
    </>
  );
}
