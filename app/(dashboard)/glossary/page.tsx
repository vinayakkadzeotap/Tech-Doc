import GlossaryClient from '@/components/learning/GlossaryClient';
import { GLOSSARY_TERMS } from '@/lib/utils/glossary-data';

export default function GlossaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Glossary</h1>
        <p className="text-text-secondary text-sm mt-1">
          {GLOSSARY_TERMS.length} key terms and concepts used across Zeotap
        </p>
      </div>

      <GlossaryClient />
    </div>
  );
}
