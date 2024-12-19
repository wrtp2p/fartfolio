import axios from 'axios';
import { ChartData } from '../../types/token';
import { ChartCandle } from './types';
import { DEXSCREENER_API } from './constants';
import { APIError } from './error';

export async function fetchPriceHistory(pairAddress: string): Promise<ChartData[]> {
  try {
    const response = await axios.get<{ data: { candles: ChartCandle[] } }>(
      `${DEXSCREENER_API}/chart/${pairAddress}`,
      {
        params: {
          from: Math.floor(Date.now() / 1000) - 24 * 60 * 60,
          to: Math.floor(Date.now() / 1000),
          res: '1H'
        }
      }
    );

    if (!response.data?.data?.candles) {
      return [];
    }

    return response.data.data.candles.map(candle => ({
      timestamp: candle.time * 1000,
      price: parseFloat(candle.close)
    }));
  } catch (error) {
    console.error('Price history fetch error:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}