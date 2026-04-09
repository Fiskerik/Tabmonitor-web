import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'User Feedback',
  description: 'Share feedback about Tab Monitor tab management, multiple tabs workflow, and overall task manager experience.',
  keywords: ['tab management', 'multiple tabs', 'task manager', 'tab monitor feedback'],
  alternates: { canonical: '/feedback' },
};

export default function FeedbackLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
