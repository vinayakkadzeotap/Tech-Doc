'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import ExecutiveReportBuilder from './ExecutiveReportBuilder';

export default function ReportButton() {
  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowReport(true)}
        className="text-sm text-brand-amber hover:underline font-medium flex items-center gap-1"
      >
        <FileText size={14} />
        Generate Report
      </button>
      {showReport && <ExecutiveReportBuilder onClose={() => setShowReport(false)} />}
    </>
  );
}
