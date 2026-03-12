'use client';

import { useRef, useState } from 'react';
import { Download } from 'lucide-react';

interface CertificateGeneratorProps {
  userName: string;
  certTitle: string;
  level: string;
  issuedAt: string;
  certId: string;
}

export default function CertificateGenerator({
  userName,
  certTitle,
  level,
  issuedAt,
  certId,
}: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: '#0a0a12',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch {
      // Fallback: download as PNG
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#0a0a12' });
        const link = document.createElement('a');
        link.download = `${certTitle.replace(/\s+/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch {
        // silently fail
      }
    } finally {
      setGenerating(false);
    }
  };

  const formattedDate = new Date(issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const levelColor = level === 'expert' ? '#f59e0b' : level === 'professional' ? '#a855f7' : '#3b82f6';

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={generating}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-sm font-medium text-brand-blue hover:bg-brand-blue/20 transition-colors disabled:opacity-50"
      >
        {generating ? (
          <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {generating ? 'Generating...' : 'Download Certificate'}
      </button>

      {/* Hidden certificate template for rendering */}
      <div className="fixed -left-[9999px] top-0" aria-hidden>
        <div
          ref={certRef}
          style={{
            width: 1100,
            height: 780,
            background: 'linear-gradient(135deg, #0a0a12 0%, #111127 50%, #0a0a12 100%)',
            padding: 48,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Border decoration */}
          <div style={{
            position: 'absolute',
            inset: 16,
            border: '2px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 16,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            inset: 24,
            border: '1px solid rgba(59, 130, 246, 0.1)',
            borderRadius: 12,
            pointerEvents: 'none',
          }} />

          {/* Corner accents */}
          {[{ top: 20, left: 20 }, { top: 20, right: 20 }, { bottom: 20, left: 20 }, { bottom: 20, right: 20 }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...pos,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${levelColor}30, transparent)`,
            } as React.CSSProperties} />
          ))}

          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Logo */}
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 4,
              marginBottom: 8,
            }}>
              ZEOTAP
            </div>

            <div style={{ color: '#6b7280', fontSize: 13, letterSpacing: 6, textTransform: 'uppercase' as const, marginBottom: 40 }}>
              Certificate of Achievement
            </div>

            {/* Divider */}
            <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${levelColor}, transparent)`, marginBottom: 40 }} />

            <div style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>
              This certifies that
            </div>

            <div style={{ color: '#f3f4f6', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              {userName || 'Team Member'}
            </div>

            <div style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>
              has successfully earned the
            </div>

            <div style={{ color: '#f3f4f6', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {certTitle}
            </div>

            <div style={{
              display: 'inline-flex',
              padding: '4px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: 2,
              color: levelColor,
              border: `1px solid ${levelColor}40`,
              background: `${levelColor}15`,
              marginBottom: 40,
            }}>
              {level}
            </div>

            {/* Divider */}
            <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${levelColor}, transparent)`, marginBottom: 32 }} />

            <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>
              Issued on {formattedDate}
            </div>
            <div style={{ color: '#4b5563', fontSize: 10 }}>
              Certificate ID: {certId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
