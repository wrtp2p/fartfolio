import axios from 'axios';
import { TokenData, ChartData } from '../types/token';

const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

export async function fetchTokenData(address: string): Promise<TokenData | null> {
  try {
    const response = await axios.get(`${DEXSCREENER_API}/tokens/${address}`);
    const pair = response.data.pairs[0]; // Get the most liquid pair
    
    if (!pair) return null;

    const priceHistory = await fetchPriceHistory(pair.pairAddress);

    return {
      address,
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      logo: pair.baseToken.logoURI || '',
      price: parseFloat(pair.priceUsd),
      priceChange24h: pair.priceChange.h24 || 0,
      volume24h: pair.volume.h24,
      marketCap: pair.marketCap,
      chartData: priceHistory
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
}

async function fetchPriceHistory(pairAddress: string): Promise<ChartData[]> {
  try {
    const response = await axios.get(`${DEXSCREENER_API}/chart/${pairAddress}`, {
      params: {
        from: Math.floor(Date.now() / 1000) - 24 * 60 * 60, // Convert to seconds
        to: Math.floor(Date.now() / 1000),
        res: '1H'
      }
    });

    if (!response.data?.data?.candles) {
      return [];
    }

    return response.data.data.candles.map(candle => ({
      timestamp: candle.time * 1000, // Convert back to milliseconds
      price: parseFloat(candle.close)
    }));
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
}