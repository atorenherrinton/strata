import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata = {
  title: "Stratum — time-layered notes",
  description:
    "Stratum is a note-taking app that stacks your thoughts into strata by date, with tag-based core-sample views across topics.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
