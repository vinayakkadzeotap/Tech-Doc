'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Repo } from '@/lib/utils/codebase/types';

const DEP_COLORS: Record<string, string> = {
  database: '#22c55e',
  queue: '#f59e0b',
  cloud: '#06b6d4',
  library: '#a855f7',
  service: '#ec4899',
};

const SVG_W = 520;
const SVG_H = 340;
const CX = SVG_W / 2;
const CY = SVG_H / 2;

interface Props {
  repo: Repo;
  domainColor: string;
}

export default function RepoRelationshipDiagram({ repo, domainColor }: Props) {
  const layout = useMemo(() => {
    const modules = repo.keyModules.slice(0, 6);
    const deps = repo.dependencies.slice(0, 7);
    const links = repo.interRepoLinks.slice(0, 6);

    // Modules: arc above center
    const modulePositions = modules.map((_, i) => {
      const count = modules.length;
      const startAngle = Math.PI + (Math.PI * 0.2);
      const endAngle = 2 * Math.PI - (Math.PI * 0.2);
      const angle = count === 1 ? (startAngle + endAngle) / 2 : startAngle + (i / (count - 1)) * (endAngle - startAngle);
      return {
        x: CX + Math.cos(angle) * 120,
        y: CY + Math.sin(angle) * 80,
      };
    });

    // Dependencies: arc below center
    const depPositions = deps.map((_, i) => {
      const count = deps.length;
      const startAngle = Math.PI * 0.2;
      const endAngle = Math.PI - (Math.PI * 0.2);
      const angle = count === 1 ? (startAngle + endAngle) / 2 : startAngle + (i / (count - 1)) * (endAngle - startAngle);
      return {
        x: CX + Math.cos(angle) * 130,
        y: CY + Math.sin(angle) * 90,
      };
    });

    // Inter-repo links: split left and right
    const leftLinks = links.slice(0, Math.ceil(links.length / 2));
    const rightLinks = links.slice(Math.ceil(links.length / 2));

    const leftPositions = leftLinks.map((_, i) => ({
      x: 55,
      y: CY - 40 + (i * 36) - ((leftLinks.length - 1) * 18),
    }));

    const rightPositions = rightLinks.map((_, i) => ({
      x: SVG_W - 55,
      y: CY - 40 + (i * 36) - ((rightLinks.length - 1) * 18),
    }));

    return { modules, deps, links, modulePositions, depPositions, leftLinks, rightLinks, leftPositions, rightPositions };
  }, [repo]);

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full max-w-[520px] mx-auto"
      style={{ height: 'auto' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edge lines: modules → center */}
      {layout.modulePositions.map((pos, i) => (
        <line
          key={`me-${i}`}
          x1={pos.x} y1={pos.y} x2={CX} y2={CY}
          stroke={domainColor} strokeOpacity={0.2} strokeWidth={1}
        />
      ))}

      {/* Edge lines: center → deps */}
      {layout.depPositions.map((pos, i) => (
        <line
          key={`de-${i}`}
          x1={CX} y1={CY} x2={pos.x} y2={pos.y}
          stroke={DEP_COLORS[layout.deps[i].type] || '#666'} strokeOpacity={0.3} strokeWidth={1}
          strokeDasharray="4 3"
        />
      ))}

      {/* Edge lines: center → left links */}
      {layout.leftPositions.map((pos, i) => (
        <line
          key={`ll-${i}`}
          x1={CX - 60} y1={CY} x2={pos.x + 40} y2={pos.y}
          stroke="#3b82f6" strokeOpacity={0.25} strokeWidth={1}
        />
      ))}

      {/* Edge lines: center → right links */}
      {layout.rightPositions.map((pos, i) => (
        <line
          key={`rl-${i}`}
          x1={CX + 60} y1={CY} x2={pos.x - 40} y2={pos.y}
          stroke="#3b82f6" strokeOpacity={0.25} strokeWidth={1}
        />
      ))}

      {/* Center: repo node */}
      <rect
        x={CX - 60} y={CY - 18} width={120} height={36} rx={8}
        fill={domainColor} fillOpacity={0.15}
        stroke={domainColor} strokeWidth={1.5}
      />
      <text
        x={CX} y={CY - 2}
        textAnchor="middle" fontSize={11} fontWeight={600}
        fill="white"
      >
        {repo.displayName.length > 16 ? repo.displayName.slice(0, 15) + '\u2026' : repo.displayName}
      </text>
      <text
        x={CX} y={CY + 12}
        textAnchor="middle" fontSize={8} fill={domainColor}
      >
        {repo.language} {repo.size && `\u00b7 ${repo.size}`}
      </text>

      {/* Module nodes */}
      {layout.modules.map((mod, i) => {
        const pos = layout.modulePositions[i];
        return (
          <g key={`m-${i}`}>
            <circle cx={pos.x} cy={pos.y} r={6} fill={domainColor} fillOpacity={0.3} stroke={domainColor} strokeWidth={0.8} />
            <text
              x={pos.x} y={pos.y - 10}
              textAnchor="middle" fontSize={7.5} fill="#94a3b8"
            >
              {mod.name.length > 18 ? mod.name.slice(0, 17) + '\u2026' : mod.name}
            </text>
            <title>{mod.name}: {mod.description}</title>
          </g>
        );
      })}

      {/* Labels */}
      {layout.modules.length > 0 && (
        <text x={CX} y={CY - 110} textAnchor="middle" fontSize={8} fill="#475569" fontWeight={600}>
          MODULES
        </text>
      )}

      {/* Dependency nodes */}
      {layout.deps.map((dep, i) => {
        const pos = layout.depPositions[i];
        const color = DEP_COLORS[dep.type] || '#666';
        return (
          <g key={`d-${i}`} className="cursor-pointer">
            <a href={`/codebase/explore?q=${encodeURIComponent(dep.name)}`}>
              <rect
                x={pos.x - 5} y={pos.y - 5} width={10} height={10} rx={2}
                fill={color} fillOpacity={0.3} stroke={color} strokeWidth={0.8}
                transform={`rotate(45 ${pos.x} ${pos.y})`}
              />
              <text
                x={pos.x} y={pos.y + 16}
                textAnchor="middle" fontSize={7.5} fill="#94a3b8"
              >
                {dep.name.length > 14 ? dep.name.slice(0, 13) + '\u2026' : dep.name}
              </text>
              <title>{dep.name} ({dep.type}): {dep.description}</title>
            </a>
          </g>
        );
      })}

      {layout.deps.length > 0 && (
        <text x={CX} y={CY + 120} textAnchor="middle" fontSize={8} fill="#475569" fontWeight={600}>
          DEPENDENCIES
        </text>
      )}

      {/* Left inter-repo links */}
      {layout.leftLinks.map((link, i) => {
        const pos = layout.leftPositions[i];
        return (
          <g key={`lnk-l-${i}`}>
            <rect
              x={pos.x - 40} y={pos.y - 10} width={80} height={20} rx={4}
              fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeOpacity={0.3} strokeWidth={0.8}
            />
            <text
              x={pos.x} y={pos.y + 3}
              textAnchor="middle" fontSize={7.5} fill="#60a5fa"
            >
              {link.length > 12 ? link.slice(0, 11) + '\u2026' : link}
            </text>
            <title>Connected repo: {link}</title>
          </g>
        );
      })}

      {/* Right inter-repo links */}
      {layout.rightLinks.map((link, i) => {
        const pos = layout.rightPositions[i];
        return (
          <g key={`lnk-r-${i}`}>
            <rect
              x={pos.x - 40} y={pos.y - 10} width={80} height={20} rx={4}
              fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeOpacity={0.3} strokeWidth={0.8}
            />
            <text
              x={pos.x} y={pos.y + 3}
              textAnchor="middle" fontSize={7.5} fill="#60a5fa"
            >
              {link.length > 12 ? link.slice(0, 11) + '\u2026' : link}
            </text>
            <title>Connected repo: {link}</title>
          </g>
        );
      })}

      {(layout.leftLinks.length > 0 || layout.rightLinks.length > 0) && (
        <text x={CX} y={20} textAnchor="middle" fontSize={8} fill="#475569" fontWeight={600}>
          CONNECTED REPOS
        </text>
      )}
    </svg>
  );
}
