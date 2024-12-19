import React from 'react';
import { Coins, ExternalLink } from 'lucide-react';
import { TokenData } from '../types/token';
import PriceChange from './PriceChange';
import PriceChart from './PriceChart';
import DexToolsChart from './DexToolsChart';
import { formatLargeNumber } from '../utils/formatters';

interface TokenCardProps {
  token: TokenData;
  chartData: { timestamp: number; price: number; }[];
  buyUrl?: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, chartData, buyUrl }) => {
  const isPositive = token.priceChange24h >= 0;
  const isSolanaPump = token.address === 'eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump';
  const isPumpIt = token.address === '4eUVrv9Jj5x6YfisJgZHUKjvWCQvf4VkrFdyAkP5pump';
  const isFartcoin = token.address === '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump';
  
  const getDexToolsPairAddress = () => {
    if (isSolanaPump) return '78sBWyimVhLumzZg1bdMD6ogGig8QpmgYZqCXNyMxx4z';
    if (isPumpIt) return 'BpxHxFRB3hRvLqdQg2f5MmuMSQn5KTMUVGswk4z6xgEL';
    if (isFartcoin) return 'Bzc9NZfMqkXR6fz1DBph7BDf9BroyEf6pnzESP7v5iiw';
    return null;
  };

  const dexToolsPairAddress = getDexToolsPairAddress();
  const shouldShowDexTools = dexToolsPairAddress !== null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {token.logo ? (
            <img 
              src={token.logo} 
              alt={token.name} 
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Coins className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{token.name}</h3>
            <p className="text-gray-500 text-sm">{token.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">${token.price.toFixed(4)}</p>
          <PriceChange value={token.priceChange24h} />
        </div>
      </div>
      
      <div className="h-[400px] w-full mb-4">
        {shouldShowDexTools ? (
          <DexToolsChart pairAddress={dexToolsPairAddress} className="h-full" />
        ) : (
          <PriceChart data={chartData} isPositive={isPositive} />
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <p className="text-gray-600 text-sm font-medium">24h Volume</p>
          <p className="text-indigo-700 font-bold text-lg">
            ${formatLargeNumber(Math.round(token.volume24h))}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-gray-600 text-sm font-medium">Market Cap</p>
          <p className="text-purple-700 font-bold text-lg">
            ${formatLargeNumber(token.marketCap)}
          </p>
        </div>
      </div>

      {buyUrl && (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Buy Now <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

export default TokenCard;