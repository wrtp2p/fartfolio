import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriceChangeProps {
  value: number;
}

const PriceChange: React.FC<PriceChangeProps> = ({ value }) => {
  const isPositive = value >= 0;
  
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      <span className="font-medium">{Math.abs(value).toFixed(2)}%</span>
    </div>
  );
};

export default PriceChange;