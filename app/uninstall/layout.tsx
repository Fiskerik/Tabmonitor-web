import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Uninstall Feedback',
  description: 'Share uninstall feedback for Tab Monitor and tell us about tab management, tab hoarding, or multiple tabs challenges.',
  keywords: ['tab management', 'tab hoarding', 'multiple tabs', 'task manager', 'alt tab'],
  alternates: {
    canonical: '/uninstall',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UninstallLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
