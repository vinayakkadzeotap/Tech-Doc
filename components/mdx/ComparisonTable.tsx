interface ComparisonTableProps {
  headers?: string[];
  rows?: string[][];
  highlightColumn?: number;
  children?: React.ReactNode;
}

export default function ComparisonTable({ headers, rows, highlightColumn = 0 }: ComparisonTableProps) {
  // Defensive: bail out if props are missing or not arrays
  if (!headers || !Array.isArray(headers) || headers.length === 0) return null;
  if (!rows || !Array.isArray(rows) || rows.length === 0) return null;

  // Filter out any undefined/null rows and ensure each row is an array
  const safeRows = rows.filter(
    (row): row is string[] => Array.isArray(row) && row.length > 0
  );

  if (safeRows.length === 0) return null;

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={`text-left py-3 px-4 text-xs font-bold uppercase tracking-wider border-b border-border ${
                  i === highlightColumn ? 'text-brand-blue' : 'text-text-muted'
                }`}
              >
                {h ?? ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row, ri) => (
            <tr key={ri} className="border-b border-border-subtle hover:bg-bg-hover transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-3 px-4 ${
                    ci === highlightColumn ? 'font-semibold text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  {cell ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
