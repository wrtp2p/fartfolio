import React, { useEffect, useState } from 'react';
import TokenCard from './components/TokenCard';
import { TokenData } from './types/token';
import { fetchTokenData } from './utils/api';

export const TOKENS = [
  {
    address: '4eUVrv9Jj5x6YfisJgZHUKjvWCQvf4VkrFdyAkP5pump',
    name: 'Pump It',
    symbol: 'PUMP',
    logo: 'https://dd.dexscreener.com/ds-data/tokens/solana/4eUVrv9Jj5x6YfisJgZHUKjvWCQvf4VkrFdyAkP5pump.png?size=lg&key=0b53fa',
    buyUrl: 'https://jup.ag/swap/SOL-4eUVrv9Jj5x6YfisJgZHUKjvWCQvf4VkrFdyAkP5pump'
  },
  {
    address: 'eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump',
    name: 'Solana Pump',
    symbol: 'SPUMP',
    logo: '/website_logo.png',
    buyUrl: 'https://jup.ag/swap/SOL-eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump'
  },
  {
    address: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
    name: 'Pump Bag',
    symbol: 'PUMPBAG',
    logo: '',
    buyUrl: 'https://jup.ag/swap/SOL-Fartcoin'
  }
];

const App = () => {
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTokenData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tokenPromises = TOKENS.map(token => fetchTokenData(token.address));
      const results = await Promise.all(tokenPromises);
      const validResults = results.filter((result): result is TokenData => result !== null);
      setTokenData(validResults);
    } catch (err) {
      setError('Failed to fetch token data. Please try again later.');
      console.error('Error fetching token data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTokenData();
    const interval = setInterval(fetchAllTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 flex-shrink-0">
            <img 
              src="/website_logo.png" 
              alt="Fartfolio Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Fartfolio</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && tokenData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenData.map(token => {
              const tokenInfo = TOKENS.find(t => t.address === token.address);
              return (
                <TokenCard 
                  key={token.address}
                  token={token}
                  chartData={token.chartData}
                  buyUrl={tokenInfo?.buyUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;