import CDPAssistantChat from '@/components/interactive/CDPAssistantChat';
import DataSourceBanner from '@/components/ui/DataSourceBanner';

export const metadata = {
  title: 'CDP Assistant | Zeotap Learning',
  description: 'AI-powered assistant for Zeotap Customer Data Platform',
};

export default function CDPAssistantPage() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <DataSourceBanner />
      </div>
      <CDPAssistantChat />
    </div>
  );
}
