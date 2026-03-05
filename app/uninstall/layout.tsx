import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Uninstall Feedback',
  description: 'Share uninstall feedback for Tab Monitor to help us improve extension performance and usability.',
  alternates: {
    canonical: '/uninstall',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function UninstallLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
