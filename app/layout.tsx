import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tabmonitor",
  description: "Automatisera ditt arbetsflöde med Tabmonitor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">{children}</body>
    </html>
  );
}
