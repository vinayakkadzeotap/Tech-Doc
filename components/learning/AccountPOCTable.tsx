'use client';

import { useState } from 'react';
import { ACCOUNT_POC_DATA, type AccountPOCEntry } from '@/lib/utils/account-poc';

export default function AccountPOCTable() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [groupBy, setGroupBy] = useState<'account' | 'tam' | 'csm'>('account');

  const filtered = search.trim()
    ? ACCOUNT_POC_DATA.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.account.toLowerCase().includes(q) ||
          e.tam.toLowerCase().includes(q) ||
          e.csm.toLowerCase().includes(q)
        );
      })
    : ACCOUNT_POC_DATA;

  // Group data based on selected grouping
  const grouped = groupData(filtered, groupBy);

  return (
    <div className="mt-8">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 mb-4 group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-emerald-500/10">
            📋
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold">Account POC Directory</h3>
            <p className="text-xs text-text-muted">Account-wise TAM &amp; CSM points of contact</p>
          </div>
        </div>
        <span
          className="text-text-muted text-lg transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <>
          {/* Search + Group by */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by account, TAM, or CSM..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <div className="flex items-center gap-1 bg-bg-surface border border-border rounded-xl p-1">
              {(['account', 'tam', 'csm'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setGroupBy(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    groupBy === key
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {key === 'account' ? 'By Account' : key === 'tam' ? 'By TAM' : 'By CSM'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-surface/80">
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border">
                    Account
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border">
                    TAM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border">
                    CSM
                  </th>
                </tr>
              </thead>
              <tbody>
                {grouped.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                      No results found for &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                )}
                {grouped.map((group) =>
                  group.entries.map((entry, idx) => (
                    <tr
                      key={`${entry.account}-${idx}`}
                      className={`border-b border-border/50 hover:bg-bg-surface/40 transition-colors ${
                        idx === 0 ? 'border-t border-border' : ''
                      }`}
                    >
                      {/* Grouped column */}
                      {idx === 0 && groupBy !== 'account' && (
                        <td
                          className="px-4 py-3 font-semibold text-text-primary align-top whitespace-nowrap"
                          rowSpan={group.entries.length}
                        >
                          {groupBy === 'tam' ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                              {group.label}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                              {group.label}
                            </div>
                          )}
                        </td>
                      )}

                      {/* Account */}
                      {groupBy === 'account' ? (
                        <td className="px-4 py-3 font-semibold text-text-primary">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            {entry.account}
                          </div>
                        </td>
                      ) : groupBy === 'tam' ? (
                        // When grouped by TAM, account is the second column
                        <td className="px-4 py-3 text-text-secondary">{entry.account}</td>
                      ) : null}

                      {/* TAM */}
                      {groupBy === 'tam' ? null : (
                        <td className="px-4 py-3 text-text-primary">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-xs font-medium text-emerald-300">
                            {entry.tam}
                          </span>
                        </td>
                      )}

                      {/* CSM */}
                      {groupBy === 'csm' ? null : (
                        <td className="px-4 py-3 text-text-primary">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-xs font-medium text-blue-300">
                            {entry.csm}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-text-muted mt-3 text-right">
            {ACCOUNT_POC_DATA.length} accounts
          </p>
        </>
      )}
    </div>
  );
}

interface GroupedData {
  label: string;
  entries: AccountPOCEntry[];
}

function groupData(data: AccountPOCEntry[], groupBy: 'account' | 'tam' | 'csm'): GroupedData[] {
  if (groupBy === 'account') {
    // No grouping — each account is its own row
    return data.map((entry) => ({ label: entry.account, entries: [entry] }));
  }

  const map = new Map<string, AccountPOCEntry[]>();
  for (const entry of data) {
    const key = groupBy === 'tam' ? entry.tam : entry.csm;
    const list = map.get(key) || [];
    list.push(entry);
    map.set(key, list);
  }

  return Array.from(map.entries()).map(([label, entries]) => ({ label, entries }));
}
