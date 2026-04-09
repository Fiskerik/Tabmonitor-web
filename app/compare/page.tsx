import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tab Monitor Comparison',
  description: 'Compare Tab Monitor with OneTab, The Great Suspender, and Workona for tab management, tab hoarding control, multiple tabs, and focus workflows.',
  keywords: [
    'tab management',
    'tab hoarding',
    'multiple tabs',
    'task manager',
    'alt tab',
    'OneTab alternative',
    'Workona alternative',
  ],
  alternates: { canonical: '/compare' },
};

export default function ComparePage() {
  return (
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Tab Monitor</th>
          <th>OneTab</th>
          <th>The Great Suspender</th>
          <th>Workona</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Focus Mode Lock</td>
          <td>✅</td>
          <td>❌</td>
          <td>❌</td>
          <td>❌</td>
        </tr>
        <tr>
          <td>Real-time RAM monitoring</td>
          <td>✅</td>
          <td>❌</td>
          <td>⚠️ Estimates</td>
          <td>❌</td>
        </tr>
        <tr>
          <td>Advanced usage analytics</td>
          <td>✅</td>
          <td>❌</td>
          <td>❌</td>
          <td>❌</td>
        </tr>
        <tr>
          <td>Multi launguage support</td>
          <td>✅</td>
          <td>❌</td>
          <td>❌</td>
          <td>❌</td>
        </tr>
        <tr>
          <td>Backed-up sessions</td>
          <td>✅</td>
          <td>❌</td>
          <td>❌</td>
          <td>✅</td>
        </tr>
                <tr>
          <td>Sorting / Quick-actions</td>
          <td>✅</td>
          <td>✅</td>
          <td>❌ </td>
          <td>✅</td>
        </tr>
        <tr>
          <td>Suspending of tabs</td>
          <td>✅</td>
          <td>✅</td>
          <td>✅ </td>
          <td>❌</td>
        </tr>
                                <tr>
          <td>Tab groups</td>
          <td>✅</td>
          <td>✅</td>
          <td>✅</td>
          <td>✅</td>
        </tr>
      </tbody>
    </table>
  )
}
