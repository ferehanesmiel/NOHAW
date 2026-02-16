
import * as React from 'react';

type ArtTheme = 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue';

interface TechNetworkArtProps {
  id?: string;
  className?: string;
  theme?: ArtTheme;
}

const TechNetworkArt: React.FC<TechNetworkArtProps> = ({ id = 'default', className = '', theme = 'indigo' }) => {
  // Simple seedable random function
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  // Define color palettes
  const palettes = {
    indigo: { primary: '#6366f1', secondary: '#8b5cf6', stop1: '#4f46e5', stop2: '#7c3aed', particle: '#a5b4fc' },
    emerald: { primary: '#10b981', secondary: '#34d399', stop1: '#059669', stop2: '#10b981', particle: '#6ee7b7' },
    rose: { primary: '#f43f5e', secondary: '#fb7185', stop1: '#e11d48', stop2: '#f43f5e', particle: '#fda4af' },
    amber: { primary: '#f59e0b', secondary: '#fbbf24', stop1: '#d97706', stop2: '#f59e0b', particle: '#fcd34d' },
    blue: { primary: '#3b82f6', secondary: '#60a5fa', stop1: '#2563eb', stop2: '#3b82f6', particle: '#93c5fd' },
  };

  const colors = palettes[theme];

  // Generate deterministic nodes
  const nodes = React.useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    x: 5 + random(i * 2) * 90, 
    y: 5 + random(i * 2 + 1) * 90,
    r: 1 + random(i) * 2
  })), [id]);

  // Generate connections
  const connections = React.useMemo(() => {
      const conns = [];
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((other, j) => {
          const dist = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2));
          if (dist < 35) { 
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

  const gradientId = `grad-${id.replace(/[^a-zA-Z0-9]/g, '')}-${theme}`;
  const gridId = `grid-${id.replace(/[^a-zA-Z0-9]/g, '')}-${theme}`;

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.stop1} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={colors.stop2} stopOpacity="0.6" />
                </linearGradient>
                <filter id={`glow-${theme}`}>
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* Background Grid */}
             <pattern id={gridId} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1"/>
            </pattern>
            <rect width="100" height="100" fill={`url(#${gridId})`} />

            {/* Connections */}
            {connections.map((line, i) => (
                <line 
                    key={`line-${line.id}`}
                    x1={line.x1} 
                    y1={line.y1} 
                    x2={line.x2} 
                    y2={line.y2} 
                    stroke={`url(#${gradientId})`} 
                    strokeWidth={0.15} 
                    opacity={1 - line.dist / 35}
                />
            ))}

             {/* Moving Data Packets */}
             {connections.filter((_, i) => i % 2 === 0).map((line, i) => (
                 <circle key={`packet-${i}`} r="0.6" fill={colors.particle} filter={`url(#glow-${theme})`}>
                    <animateMotion 
                        dur={`${4 + random(i) * 3}s`} 
                        repeatCount="indefinite"
                        path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`}
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                    />
                     <animate 
                        attributeName="opacity" 
                        values="0;1;0" 
                        dur={`${4 + random(i) * 3}s`} 
                        repeatCount="indefinite" 
                    />
                 </circle>
             ))}

            {/* Nodes */}
            {nodes.map((node, i) => (
                <g key={`node-${i}`}>
                    <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.r} 
                        fill={colors.primary} 
                        opacity="0.8"
                    />
                     <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.r * 2} 
                        fill="none" 
                        stroke={colors.secondary}
                        strokeWidth="0.1"
                        opacity="0.5"
                    >
                         <animate 
                            attributeName="r" 
                            values={`${node.r};${node.r * 3}`} 
                            dur={`${3 + random(i * 10)}s`} 
                            repeatCount="indefinite" 
                        />
                         <animate 
                            attributeName="opacity" 
                            values="0.5;0" 
                            dur={`${3 + random(i * 10)}s`} 
                            repeatCount="indefinite" 
                        />
                    </circle>
                </g>
            ))}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TechNetworkArt;
