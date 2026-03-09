import { NextResponse } from 'next/server';
import { TRACKS } from '@/lib/utils/roles';

const GLOSSARY_TERMS = [
  { term: 'Ada', definition: "Zeotap's official AI copilot" },
  { term: 'UCID', definition: 'Unified Customer Identity' },
  { term: 'ID+', definition: "Zeotap's universal identity solution" },
  { term: 'CDP', definition: 'Customer Data Platform' },
  { term: 'Integr8', definition: "Zeotap's connector builder" },
  { term: 'Delta Lake', definition: 'Storage layer with ACID transactions' },
  { term: 'Apache Kafka', definition: 'Distributed event streaming platform' },
  { term: 'Vertex AI', definition: "Google Cloud's ML platform" },
  { term: 'RAG', definition: 'Retrieval-Augmented Generation' },
  { term: 'GDPR', definition: 'General Data Protection Regulation' },
  { term: 'Journey Canvas', definition: 'Visual multi-step campaign builder' },
  { term: 'SmartPixel', definition: 'Real-time web personalization engine' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ modules: [], glossary: [] });
  }

  // Search modules
  const moduleResults: Array<{
    trackId: string;
    trackTitle: string;
    moduleId: string;
    title: string;
    description: string;
    icon: string;
    contentType: string;
  }> = [];

  for (const track of TRACKS) {
    for (const mod of track.modules) {
      if (
        mod.title.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q)
      ) {
        moduleResults.push({
          trackId: track.id,
          trackTitle: track.title,
          moduleId: mod.id,
          title: mod.title,
          description: mod.description,
          icon: mod.icon,
          contentType: mod.contentType,
        });
      }
    }
  }

  // Search glossary
  const glossaryResults = GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
  );

  return NextResponse.json({
    modules: moduleResults.slice(0, 10),
    glossary: glossaryResults.slice(0, 5),
  });
}
