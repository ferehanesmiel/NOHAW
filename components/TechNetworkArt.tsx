
import * as React from 'react';

type ArtTheme = 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue' | 'neon-lemon' | 'neon-orange' | 'retro-mix';

interface TechNetworkArtProps {
  id?: string;
  className?: string;
  theme?: ArtTheme;
}

const TechNetworkArt: React.FC<TechNetworkArtProps> = ({ id = 'default', className = '', theme = 'retro-mix' }) => {
  // Safeguard id to ensure it's a string before operations
  const safeId = typeof id === 'string' ? id : String(id || 'default');
  
  // Simple seedable random function with memoized seed
  const seed = React.useMemo(() => {
      try {
          return safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      } catch (e) {
          return 12345; // Fallback seed
      }
  }, [safeId]);

  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  // Neon Retro Color Palettes
  const palettes: Record<string, { primary: string, secondary: string, stop1: string, stop2: string, particle: string }> = {
    // Original mappings updated to neon versions
    indigo: { primary: '#a78bfa', secondary: '#c4b5fd', stop1: '#8b5cf6', stop2: '#6366f1', particle: '#ddd6fe' }, 
    emerald: { primary: '#34d399', secondary: '#6ee7b7', stop1: '#10b981', stop2: '#059669', particle: '#a7f3d0' },
    rose: { primary: '#fb7185', secondary: '#fda4af', stop1: '#f43f5e', stop2: '#e11d48', particle: '#fecdd3' },
    amber: { primary: '#fbbf24', secondary: '#fcd34d', stop1: '#f59e0b', stop2: '#d97706', particle: '#fde68a' },
    blue: { primary: '#60a5fa', secondary: '#93c5fd', stop1: '#3b82f6', stop2: '#2563eb', particle: '#bfdbfe' },
    
    // New Explicit Neon Themes
    'neon-lemon': { primary: '#ccff00', secondary: '#ffff00', stop1: '#ccff00', stop2: '#99cc00', particle: '#ffffcc' },
    'neon-orange': { primary: '#ff9900', secondary: '#ffcc00', stop1: '#ff6600', stop2: '#ff9900', particle: '#ffeebb' },
    'retro-mix': { primary: '#00ffff', secondary: '#ff00ff', stop1: '#00ffff', stop2: '#ff00ff', particle: '#ffffff' }, // Cyan & Magenta
  };

  const colors = palettes[theme] || palettes['retro-mix'];

  // STATIC LINE ART: Increased node count to 45 for a denser look
  const nodeCount = 45;
  const nodes = React.useMemo(() => Array.from({ length: nodeCount }).map((_, i) => ({
    x: 2 + random(i * 2) * 96, // Keep within bounds (2-98%)
    y: 2 + random(i * 2 + 1) * 96,
    r: 0.5 + random(i) * 1.5 // Smaller nodes to accommodate density
  })), [seed]);

  // Generate connections
  const connections = React.useMemo(() => {
      const conns = [];
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((other, j) => {
          const dist = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2));
          // Distance threshold adjusted for density
          if (dist < 20) { 
            conns.push({
                x1: node.x,
                y1: node.y,
                x2: other.x,
                y2: other.y,
                dist,
                id: `${i}-${j}`
            });
          }
        });
      });
      return conns;
  }, [nodes]);

  // Sanitize ID for DOM IDs
  const sanitizedId = safeId.replace(/[^a-zA-Z0-9]/g, '');
  const gradientId = `grad-${sanitizedId}-${theme}`;
  const gridId = `grid-${sanitizedId}-${theme}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.stop1} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={colors.stop2} stopOpacity="0.8" />
                </linearGradient>
                <filter id={`glow-${theme}`}>
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* Background Grid - Static */}
             <pattern id={gridId} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={colors.primary} strokeWidth="0.05" opacity="0.2"/>
            </pattern>
            <rect width="100" height="100" fill={`url(#${gridId})`} />

            {/* Connections - Static Line Art */}
            {connections.map((line, i) => (
                <line 
                    key={`line-${line.id}`}
                    x1={line.x1} 
                    y1={line.y1} 
                    x2={line.x2} 
                    y2={line.y2} 
                    stroke={`url(#${gradientId})`} 
                    strokeWidth={0.15} 
                    opacity={0.6 - (line.dist / 20) * 0.5} 
                />
            ))}

            {/* Nodes - Static */}
            {nodes.map((node, i) => (
                <g key={`node-${i}`}>
                    <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.r} 
                        fill={colors.primary} 
                        opacity="0.8"
                    />
                     {/* Static outer ring */}
                     <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.r * 1.8} 
                        fill="none" 
                        stroke={colors.secondary}
                        strokeWidth="0.1"
                        opacity="0.3"
                    />
                </g>
            ))}
        </svg>
    </div>
  );
};

export default TechNetworkArt;