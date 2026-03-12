import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PARTNERS } from '@/lib/utils/partners';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PartnerSearch from './PartnerSearch';

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Partner Ecosystem</h1>
        <p className="text-sm text-text-muted mt-1">
          Integration partners, co-sell resources, and partnership capabilities
        </p>
      </div>

      <PartnerSearch partners={PARTNERS} />
    </div>
  );
}
