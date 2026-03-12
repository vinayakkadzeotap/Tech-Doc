'use client';

import { useState } from 'react';
import { FileText, Download, X, Loader2, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ReportData {
  generatedAt: string;
  period: { days: number; since: string };
  summary: {
    totalUsers: number;
    activeUsers: number;
    adoptionRate: number;
    modulesCompletedInPeriod: number;
    badgesEarnedInPeriod: number;
    avgQuizScore: number;
    avgFeedbackRating: number;
  };
  teamBreakdown: Array<{ team: string; memberCount: number; completionRate: number; completedModules: number }>;
  roleBreakdown: Array<{ role: string; members: number; completionRate: number }>;
  trendingModules: Array<{ trackTitle: string; moduleTitle: string; completions: number }>;
  topPerformers: Array<{ name: string; role: string; team: string; completions: number }>;
}

const PERIOD_OPTIONS = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 365 days', value: 365 },
];

export default function ExecutiveReportBuilder({ onClose }: { onClose: () => void }) {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/executive-report?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch report data');
      const data = await res.json();
      setReport(data);
    } catch {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!report) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    const addText = (text: string, size: number, bold = false, color: [number, number, number] = [255, 255, 255]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, 170);
      if (y + lines.length * (size * 0.5) > 280) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.5) + 2;
    };

    // Dark background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    // Title
    addText('ZeoAI Executive Report', 22, true, [99, 102, 241]);
    y += 2;
    addText(`Period: Last ${report.period.days} days`, 10, false, [148, 163, 184]);
    addText(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`, 10, false, [148, 163, 184]);
    y += 6;

    // Summary
    addText('Executive Summary', 16, true, [99, 102, 241]);
    y += 2;
    addText(`Total Users: ${report.summary.totalUsers}`, 11, false, [226, 232, 240]);
    addText(`Active Learners: ${report.summary.activeUsers} (${report.summary.adoptionRate}% adoption)`, 11, false, [226, 232, 240]);
    addText(`Modules Completed: ${report.summary.modulesCompletedInPeriod}`, 11, false, [226, 232, 240]);
    addText(`Badges Earned: ${report.summary.badgesEarnedInPeriod}`, 11, false, [226, 232, 240]);
    addText(`Avg Quiz Score: ${report.summary.avgQuizScore}%`, 11, false, [226, 232, 240]);
    addText(`Avg Feedback Rating: ${report.summary.avgFeedbackRating}/5`, 11, false, [226, 232, 240]);
    y += 6;

    // Team Breakdown
    addText('Completion by Team', 16, true, [99, 102, 241]);
    y += 2;
    report.teamBreakdown.slice(0, 10).forEach((t) => {
      addText(`${t.team}: ${t.completionRate}% (${t.memberCount} members, ${t.completedModules} modules)`, 10, false, [226, 232, 240]);
    });
    y += 6;

    // Role Breakdown
    addText('Completion by Role', 16, true, [99, 102, 241]);
    y += 2;
    report.roleBreakdown.forEach((r) => {
      addText(`${r.role}: ${r.completionRate}% (${r.members} members)`, 10, false, [226, 232, 240]);
    });
    y += 6;

    // Trending
    addText('Trending Modules', 16, true, [99, 102, 241]);
    y += 2;
    report.trendingModules.slice(0, 5).forEach((m, i) => {
      addText(`${i + 1}. ${m.moduleTitle} (${m.trackTitle}) — ${m.completions} completions`, 10, false, [226, 232, 240]);
    });
    y += 6;

    // Top Performers
    addText('Top Performers', 16, true, [99, 102, 241]);
    y += 2;
    report.topPerformers.slice(0, 5).forEach((p, i) => {
      addText(`${i + 1}. ${p.name} (${p.role}, ${p.team}) — ${p.completions} modules`, 10, false, [226, 232, 240]);
    });

    doc.save(`ZeoAI-Report-${report.period.days}d-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="max-w-2xl w-full max-h-[85vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <FileText size={20} className="text-brand-blue" />
          <h2 className="text-lg font-bold">Executive Report Generator</h2>
        </div>

        {!report ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-muted block mb-2">
                <Calendar size={14} className="inline mr-1" />
                Report Period
              </label>
              <div className="flex flex-wrap gap-2">
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDays(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      days === opt.value
                        ? 'bg-brand-blue text-white'
                        : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><FileText size={16} /> Generate Report</>}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="p-4 rounded-xl bg-bg-primary/50 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-blue">Report Preview</h3>
                <span className="text-xs text-text-muted">Last {report.period.days} days</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Users', value: report.summary.totalUsers },
                  { label: 'Adoption', value: `${report.summary.adoptionRate}%` },
                  { label: 'Modules Done', value: report.summary.modulesCompletedInPeriod },
                  { label: 'Avg Score', value: `${report.summary.avgQuizScore}%` },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2 rounded-lg bg-bg-elevated/50">
                    <div className="text-lg font-bold text-brand-blue">{s.value}</div>
                    <div className="text-[10px] text-text-muted">{s.label}</div>
                  </div>
                ))}
              </div>

              {report.topPerformers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted mb-2">Top Performers</h4>
                  {report.topPerformers.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <span>{p.name} <span className="text-text-muted text-xs">({p.role})</span></span>
                      <span className="text-brand-blue font-semibold">{p.completions} modules</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadPDF}
                className="flex-1 py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download PDF
              </button>
              <button
                onClick={() => setReport(null)}
                className="px-6 py-3 bg-bg-elevated text-text-secondary font-medium rounded-xl hover:text-text-primary transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
