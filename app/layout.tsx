import type { Metadata } from "next";
import icon32 from "../icon32.png";
import icon48 from "../icon48.png";
import icon128 from "../icon128.png";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tabmonitor.se"),
  title: {
    default: "Tab Monitor Extension | Monitor and Reduce Chrome Tab RAM Usage",
    template: "%s | Tab Monitor",
  },
  description:
    "Tab Monitor is a Chrome extension that tracks RAM and CPU usage per tab in real time, helps you suspend tabs, and reclaim browser performance instantly.",
  keywords: [
    "tab monitor extension",
    "Chrome tab memory usage",
    "browser RAM monitor",
    "CPU usage per tab",
    "tab suspension extension",
    "Chrome performance extension",
    "reduce Chrome memory",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tabmonitor.se",
    siteName: "Tab Monitor",
    title: "Tab Monitor Extension | Monitor and Reduce Chrome Tab RAM Usage",
    description:
      "Track RAM and CPU usage for every Chrome tab, suspend heavy tabs, and speed up your browser with Tab Monitor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tab Monitor Extension | Monitor and Reduce Chrome Tab RAM Usage",
    description:
      "Track RAM and CPU usage per tab, suspend heavy tabs, and keep Chrome fast with Tab Monitor.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
