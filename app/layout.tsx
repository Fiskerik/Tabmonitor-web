import type { Metadata } from "next";
import icon32 from "../icon32.png";
import icon48 from "../icon48.png";
import icon128 from "../icon128.png";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tabmonitor.se"),
  title: {
    default: "TabMonitor Side Panel | Focus, Productivity, Tab Monitoring & Pomodoro",
    template: "%s | Tab Monitor",
  },
  description:
    "TabMonitor is a Chrome side panel extension for focus and productivity. Monitor RAM/CPU usage, manage tasks, run a pomodoro flow, and use a smart tab manager to reduce tab overload.",
  keywords: [
    "tab monitor extension",
    "side panel extension",
    "focus",
    "productivity",
    "monitoring",
    "task manager",
    "tab manager",
    "pomodoro",
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
    title: "TabMonitor Side Panel | Focus, Productivity, Tab Monitoring & Pomodoro",
    description:
      "Use TabMonitor to stay focused, monitor heavy tabs, manage tasks, and keep Chrome fast from a single side panel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TabMonitor Side Panel | Focus, Productivity, Tab Monitoring & Pomodoro",
    description:
      "A productivity-focused tab manager and monitoring side panel with focus tools and pomodoro-ready workflows.",
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
