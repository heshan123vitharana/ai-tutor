'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark', // the app has a dark theme style
  securityLevel: 'loose',
});

export default function MermaidChart({ chart }: { chart: string }) {
  const [svgStr, setSvgStr] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      try {
        // Create a unique ID for each chart instance
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvgStr(svg);
          setError(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          console.error("Mermaid parsing error:", err);
        }
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded bg-red-900/20 text-red-400 text-sm overflow-auto">
        <p className="font-bold mb-2">Error rendering chart</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  if (!svgStr) {
    return <div className="text-gray-400 text-sm animate-pulse">Generating chart...</div>;
  }

  return (
    <div 
      className="mermaid-wrapper my-4 flex justify-center bg-gray-900/50 p-4 rounded-lg overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svgStr }} 
    />
  );
}
