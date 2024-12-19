import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PriceChartProps {
  data: { timestamp: number; price: number; }[];
  isPositive: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, isPositive }) => {
  const formatPrice = (value: number) => `$${value.toFixed(6)}`;
  const formatDate = (timestamp: number) => format(new Date(timestamp), 'HH:mm MMM dd');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`colorPrice${isPositive ? 'Up' : 'Down'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatDate}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="price"
          tickFormatter={formatPrice}
          orientation="right"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                  <p className="font-medium text-gray-900">
                    {formatPrice(payload[0].value)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(payload[0].payload.timestamp)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#colorPrice${isPositive ? 'Up' : 'Down'})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default PriceChart;