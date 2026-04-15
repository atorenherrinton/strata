import type { ReactNode } from "react";

export const metadata = {
  title: "Stratum",
  description: "Time-layered notes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
