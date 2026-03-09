'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { trackEvent } from '@/lib/utils/analytics';

interface Props {
  certId: string;
  level: string;
}

export default function CertActions({ certId, level }: Props) {
  const [claiming, setClaiming] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  const claimCert = async () => {
    setClaiming(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('certifications').upsert({
      user_id: user.id,
      cert_id: certId,
      level,
      issued_at: new Date().toISOString(),
    }, { onConflict: 'user_id,cert_id,level' });

    if (!error) {
      show({ message: 'Certification earned! Congratulations!', icon: '🎓', color: '#f59e0b' });
      trackEvent('certification_earned', { certId, level });
      router.refresh();
    }
    setClaiming(false);
  };

  return (
    <Button onClick={claimCert} loading={claiming} size="sm">
      Claim Certification
    </Button>
  );
}
