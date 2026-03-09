export interface AccountPOCEntry {
  account: string;
  tam: string;
  csm: string;
}

export const ACCOUNT_POC_DATA: AccountPOCEntry[] = [
  { account: 'Aktion Mensch', tam: 'Shravan', csm: 'Sarah' },
  { account: 'Baywa', tam: 'Raj', csm: 'Nils' },
  { account: 'Breuninger', tam: 'Stela', csm: 'Sarah' },
  { account: 'Carrefour ES', tam: 'Ilaria', csm: 'Andrea' },
  { account: 'Coopvoce', tam: 'Ilaria', csm: 'Andrea' },
  { account: 'Douglas / Digtl', tam: 'Stela', csm: 'Georgi' },
  { account: 'Edeka', tam: 'Shravan', csm: 'Nils' },
  { account: 'Edeka / Deloitte', tam: 'Shravan', csm: 'Nils' },
  { account: 'Entain', tam: 'Shravan', csm: 'Sarah' },
  { account: 'Eventim', tam: 'Shravan', csm: 'Sarah' },
];

/** Group accounts by TAM */
export function groupByTAM(data: AccountPOCEntry[]): { tam: string; accounts: AccountPOCEntry[] }[] {
  const map = new Map<string, AccountPOCEntry[]>();
  for (const entry of data) {
    const list = map.get(entry.tam) || [];
    list.push(entry);
    map.set(entry.tam, list);
  }
  return Array.from(map.entries()).map(([tam, accounts]) => ({ tam, accounts }));
}
