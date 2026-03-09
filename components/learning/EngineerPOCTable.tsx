'use client';

import { useState } from 'react';
import { ENGINEER_POC_DATA, groupByModule, type POCEntry } from '@/lib/utils/engineer-poc';

export default function EngineerPOCTable() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(true);

  const filtered = search.trim()
    ? ENGINEER_POC_DATA.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.module.toLowerCase().includes(q) ||
          e.subModule.toLowerCase().includes(q) ||
          e.engPOC.toLowerCase().includes(q) ||
          e.engManager.toLowerCase().includes(q) ||
          e.productPOC.toLowerCase().includes(q)
        );
      })
    : ENGINEER_POC_DATA;

  const groups = groupByModule(filtered);

  return (
    <div className="mt-8">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 mb-4 group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-indigo-500/10">
            📋
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold">Internal POC Directory</h3>
            <p className="text-xs text-text-muted">Module-wise engineering &amp; product points of contact</p>
          </div>
        </div>
        <span className="text-text-muted text-lg transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>

      {expanded && (
        <>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by module, name, or team..."
              className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-surface/80">
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border">Module</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border">Sub Module</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border hidden md:table-cell">Eng Manager</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border">Eng POC</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border hidden lg:table-cell">Product POC</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      No results found for &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                )}
                {groups.map((group) =>
                  group.entries.map((entry, idx) => (
                    <tr
                      key={`${group.module}-${idx}`}
                      className={`border-b border-border/50 hover:bg-bg-surface/40 transition-colors ${
                        idx === 0 ? 'border-t border-border' : ''
                      }`}
                    >
                      {/* Module name — only on first row of group */}
                      {idx === 0 && (
                        <td
                          className="px-4 py-3 font-semibold text-text-primary align-top whitespace-nowrap"
                          rowSpan={group.entries.length}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                            {entry.module}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-text-secondary">{entry.subModule || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                        {idx === 0 && group.engManager ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {group.engManager}
                          </span>
                        ) : idx === 0 ? '—' : ''}
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        {entry.engPOC ? <PersonList names={entry.engPOC} /> : '—'}
                      </td>
                      <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                        {entry.productPOC || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-text-muted mt-3 text-right">
            {ENGINEER_POC_DATA.length} entries across {groupByModule(ENGINEER_POC_DATA).length} modules
          </p>
        </>
      )}
    </div>
  );
}

function PersonList({ names }: { names: string }) {
  const people = names.split('+').map((n) => n.trim()).filter(Boolean);
  if (people.length <= 1) return <span>{names}</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {people.map((name, i) => (
        <span
          key={i}
          className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 text-xs font-medium text-indigo-300"
        >
          {name}
        </span>
      ))}
    </div>
  );
}
