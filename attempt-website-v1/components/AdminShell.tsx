"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { adminLinks } from "@/lib/content";
import { auth, db, hasFirebaseConfig } from "@/lib/firebase";
import { Logo } from "./Logo";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(!hasFirebaseConfig);

  useEffect(() => {
    if (!hasFirebaseConfig || !auth || !db) return;

    const activeAuth = auth;
    const activeDb = db;

    return onAuthStateChanged(activeAuth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const adminDoc = await getDoc(doc(activeDb, "admins", user.uid));

      if (!adminDoc.exists() || adminDoc.data().active !== true) {
        await signOut(activeAuth);
        router.replace("/admin/login");
        return;
      }

      setReady(true);
    });
  }, [router]);

  async function logout() {
    if (auth) await signOut(auth);
    router.push("/admin/login");
  }

  if (!ready) {
    return <div className="adminMain">Checking admin access...</div>;
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <Logo href="/" />

        <nav aria-label="Admin navigation">
          {adminLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="adminMain">
        <div className="adminTop">
          <div className="adminTopTitle">
            <div className="kicker">Attempt Admin</div>
            <h1>{title}</h1>
          </div>

          <div className="adminTopActions">
            <Link className="btn adminActionButton" href="/" target="_blank">
              View site
            </Link>
            <button
              className="btn adminActionButton"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        {!hasFirebaseConfig && (
          <div className="adminCard" style={{ marginBottom: 18 }}>
            <strong>Firebase is not configured yet.</strong>
            <p>
              Add your Firebase values to .env.local to enable login, database,
              and storage.
            </p>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
