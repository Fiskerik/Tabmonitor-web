import Image from 'next/image';
import tabmonitorIcon from '../icon48.png';

type BlogHeroVisualProps = {
  variant: 'memory' | 'comparison' | 'recovery';
};

const COPY = {
  memory: {
    eyebrow: 'Live tab memory',
    title: 'Heavy tabs found',
    primary: '1.8 GB',
    primaryLabel: 'reclaimable',
    secondary: '7 tabs',
    secondaryLabel: 'need attention',
  },
  comparison: {
    eyebrow: 'Workflow control',
    title: 'Monitor, clean, focus',
    primary: '5 tools',
    primaryLabel: 'compared',
    secondary: '1 panel',
    secondaryLabel: 'for action',
  },
  recovery: {
    eyebrow: 'Session safety',
    title: 'Restore with context',
    primary: 'Auto',
    primaryLabel: 'backups',
    secondary: 'Live',
    secondaryLabel: 'visibility',
  },
} as const;

export default function BlogHeroVisual({ variant }: BlogHeroVisualProps) {
  const copy = COPY[variant];

  return (
    <div
      aria-hidden="true"
      style={{
        margin: '0 0 24px',
        border: '1px solid rgba(148,163,184,0.18)',
        borderRadius: 22,
        padding: 18,
        maxWidth: 560,
        background:
          'linear-gradient(135deg, rgba(87,188,255,0.12), rgba(121,184,143,0.12)), rgba(255,255,255,0.9)',
        boxShadow: '0 18px 45px rgba(15,23,42,0.07)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Image src={tabmonitorIcon} alt="" width={38} height={38} style={{ borderRadius: 12 }} />
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#22c55e',
              marginBottom: 3,
            }}
          >
            {copy.eyebrow}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.035em', color: '#18212f' }}>{copy.title}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          [copy.primary, copy.primaryLabel, '#8a7cf3'],
          [copy.secondary, copy.secondaryLabel, '#57bcff'],
        ].map(([value, label, color]) => (
          <div
            key={label}
            style={{
              border: '1px solid rgba(148,163,184,0.16)',
              borderRadius: 16,
              padding: '14px 15px',
              background: 'rgba(255,255,255,0.78)',
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.05em', color }}>{value}</div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6f8196',
                marginTop: 4,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
