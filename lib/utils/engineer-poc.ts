export interface POCEntry {
  module: string;
  subModule: string;
  engManager: string;
  engPOC: string;
  productPOC: string;
}

export const ENGINEER_POC_DATA: POCEntry[] = [
  // Sources/Collect
  { module: 'Sources/Collect', subModule: 'Sources - Files (Book Keeper)', engManager: 'Shubham + Aniket Awati', engPOC: 'Amlan + Harshit + Rishabh', productPOC: 'Pritika + Yash' },
  { module: 'Sources/Collect', subModule: 'Source Analytics', engManager: '', engPOC: 'Amlan', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Mapping', engManager: '', engPOC: 'Pranav Raj + Harshit', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Preview', engManager: '', engPOC: 'Pranav Raj + Harshit', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Ingestions', engManager: '', engPOC: 'Ojasv/Raja + Harshit + Utsav', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'ETL', engManager: '', engPOC: 'Ojasv/Raja + Harshit', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'ID Resolution + Customer 360', engManager: '', engPOC: 'Utsav', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Profile API', engManager: '', engPOC: 'Utsav + Rohan + Aniket Patel', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Cardinality', engManager: '', engPOC: 'Rishabh Rola', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Asset Provisioning', engManager: '', engPOC: 'Utsav', productPOC: '' },
  { module: 'Sources/Collect', subModule: 'Dataflow/Cloud run/Pubsub issues', engManager: '', engPOC: 'Utsav + Amlan', productPOC: '' },

  // Admin
  { module: 'Admin', subModule: 'RBAC', engManager: 'Shubham', engPOC: 'Utsav + Madhav', productPOC: 'Garvita/Harsha/Pritika' },

  // Orchestrate
  { module: 'Orchestrate', subModule: 'Journeys', engManager: 'Shubham + Aniket Awati', engPOC: 'Rohan Saxena + Aniket Patel', productPOC: 'Garvita + Harsha' },

  // Destinations
  { module: 'Destinations', subModule: 'Destination', engManager: 'Sudarshan + Ananth Suryanarayan', engPOC: 'Shiva + Sanjay + Aswin + Srinivas', productPOC: 'Mayur + Akanksh + Harsha' },
  { module: 'Destinations', subModule: 'Uploader', engManager: '', engPOC: '', productPOC: '' },

  // Audience
  { module: 'Audience', subModule: 'Audience BE', engManager: 'Sudarshan', engPOC: 'Hemant + Shailesh + Rachit', productPOC: 'Simran + Pritika' },
  { module: 'Audience', subModule: 'Audience DE', engManager: '', engPOC: 'Hemant + Surya', productPOC: '' },

  // Unify
  { module: 'Unify', subModule: 'Calculated Attribute', engManager: 'Shubham', engPOC: 'Amlan', productPOC: 'Pritika + Garvita' },
  { module: 'Unify', subModule: 'RTCA', engManager: '', engPOC: 'Aniket Patel + Rohan Saxena', productPOC: '' },
  { module: 'Unify', subModule: 'Catalogue', engManager: '', engPOC: 'Pravan Raj + Harshit', productPOC: 'Pritika + Yash' },

  // UI
  { module: 'UI', subModule: 'Unity UI', engManager: 'Aniket Awati', engPOC: 'Shikhar + Aman + Saiteja + Krishna + Divye', productPOC: 'Based on the Product/Module' },

  // SDK
  { module: 'SDK', subModule: '', engManager: '', engPOC: 'Shikhar + Rishabh + Divye', productPOC: '' },

  // Integrations
  { module: 'Integrations', subModule: 'Sources', engManager: 'Sudarshan + Ananth Suryanarayan', engPOC: 'Amlan + (Pull Sources - Sanjay + Aswin)', productPOC: 'Akanksh' },
  { module: 'Integrations', subModule: 'Destinations', engManager: '', engPOC: 'Shailesh + Rachit (Audience Side) Shiva + Sanjay + Aswin (Uploader Side)', productPOC: 'Mayur + Akanksh' },
];

/** Group POC entries by module for rendering with rowSpan */
export function groupByModule(data: POCEntry[]): { module: string; entries: POCEntry[]; engManager: string }[] {
  const groups: { module: string; entries: POCEntry[]; engManager: string }[] = [];
  let current: typeof groups[0] | null = null;

  for (const entry of data) {
    if (!current || current.module !== entry.module) {
      current = { module: entry.module, entries: [entry], engManager: entry.engManager };
      groups.push(current);
    } else {
      current.entries.push(entry);
      // Use first non-empty engManager in the group
      if (!current.engManager && entry.engManager) {
        current.engManager = entry.engManager;
      }
    }
  }

  return groups;
}
