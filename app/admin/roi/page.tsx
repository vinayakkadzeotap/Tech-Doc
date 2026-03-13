import ROICharts from '@/components/admin/ROICharts';
import AdoptionTargets from '@/components/admin/AdoptionTargets';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ROIPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'ROI & Adoption' },
      ]} />
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="p-2 rounded-lg hover:bg-bg-surface/50 transition-colors">
          <ArrowLeft size={20} className="text-text-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold">ROI & Adoption Metrics</h1>
          <p className="text-sm text-text-muted mt-1">
            Track learning impact across the organization
          </p>
        </div>
      </div>

      <AdoptionTargets />
      <ROICharts />
    </div>
  );
}
