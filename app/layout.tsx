import type { Metadata } from "next";
import icon32 from "../icon32.png";
import icon48 from "../icon48.png";
import icon128 from "../icon128.png";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tabmonitor",
  description: "Automatisera ditt arbetsflöde med Tabmonitor.",
  verification: {
    google: "a7ooX99wNHGQkLtrXE6yZp6A_dw1L1lpWOvVXN-DUgI",
  },
  icons: {
    icon: [
      { url: icon32.src, sizes: "32x32", type: "image/png" },
      { url: icon48.src, sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: icon128.src, sizes: "128x128", type: "image/png" }],
    shortcut: [icon32.src],
  },
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
