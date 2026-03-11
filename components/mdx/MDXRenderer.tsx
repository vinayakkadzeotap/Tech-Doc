'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import Callout from './Callout';
import TechStack from './TechStack';
import KeyConcepts from './KeyConcepts';
import ArchDiagram from './ArchDiagram';
import ComparisonTable from './ComparisonTable';
import StatCard from './StatCard';
import Expandable from './Expandable';
import MermaidDiagram from './MermaidDiagram';
import FlowDiagram from './FlowDiagram';

const components = {
  Callout,
  TechStack,
  KeyConcepts,
  ArchDiagram,
  ComparisonTable,
  StatCard,
  Expandable,
  MermaidDiagram,
  FlowDiagram,
  // Override default elements for better styling
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-extrabold mt-10 mb-4 text-text-primary" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-8 mb-3 text-text-primary flex items-center gap-2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-bold mt-6 mb-2 text-text-primary" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-text-secondary leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="text-sm text-text-secondary list-disc ml-5 mb-4 space-y-1.5 leading-relaxed" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="text-sm text-text-secondary list-decimal ml-5 mb-4 space-y-1.5 leading-relaxed" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-sm text-text-secondary leading-relaxed" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="text-xs font-mono bg-white/[0.06] px-1.5 py-0.5 rounded text-brand-cyan" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="text-xs font-mono bg-bg-surface border border-border rounded-xl p-4 mb-4 overflow-x-auto" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-3 border-brand-blue/40 pl-4 my-4 text-sm text-text-secondary italic" {...props} />
  ),
  hr: () => <hr className="border-border my-8" />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-brand-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="text-left py-2 px-3 text-xs font-bold text-text-muted border-b border-border" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="py-2 px-3 text-text-secondary border-b border-border-subtle" {...props} />
  ),
};

interface Props {
  source: MDXRemoteSerializeResult;
}

export default function MDXRenderer({ source }: Props) {
  return (
    <article className="max-w-none">
      <MDXRemote {...source} components={components} />
    </article>
  );
}
