import React from 'react';

interface DexToolsChartProps {
  pairAddress: string;
  className?: string;
}

const DexToolsChart: React.FC<DexToolsChartProps> = ({ pairAddress, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <iframe 
        id="dextools-widget"
        title="DEXTools Trading Chart"
        width="500" 
        height="400"
        src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${pairAddress}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=false`}
        className="w-full h-full border-0 rounded-lg"
      />
    </div>
  );
};

export default DexToolsChart;