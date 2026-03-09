import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'tracks');

export interface ModuleFrontmatter {
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  contentType: string;
  trackId: string;
  order: number;
}

export function getModuleContent(trackId: string, moduleId: string): { frontmatter: ModuleFrontmatter; content: string } | null {
  // Try different path patterns
  const patterns = [
    path.join(CONTENT_DIR, trackId, `${moduleId}.mdx`),
    // Engineering has sub-directories
    ...['data-layer', 'intelligence-layer', 'activation-layer', 'platform-layer'].map(
      (sub) => path.join(CONTENT_DIR, trackId, sub, `${moduleId}.mdx`)
    ),
  ];

  for (const filePath of patterns) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        frontmatter: data as ModuleFrontmatter,
        content,
      };
    }
  }

  return null;
}

export function getAllModulesForTrack(trackId: string): string[] {
  const trackDir = path.join(CONTENT_DIR, trackId);
  if (!fs.existsSync(trackDir)) return [];

  const files: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.mdx')) {
        files.push(entry.name.replace('.mdx', ''));
      }
    }
  }

  walk(trackDir);
  return files;
}
