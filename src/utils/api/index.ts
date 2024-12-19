import axios from 'axios';
import { TokenData } from '../../types/token';
import { DexScreenerResponse } from './types';
import { DEXSCREENER_API } from './constants';
import { APIError } from './error';
import { fetchPriceHistory } from './chart';
import { executeWithRateLimit } from './rateLimit';
import { TOKENS } from '../../App';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function fetchTokenDataWithRetry(
  address: string, 
  retries = MAX_RETRIES
): Promise<TokenData | null> {
  try {
    const response = await executeWithRateLimit(() => 
      axios.get<DexScreenerResponse>(
        `${DEXSCREENER_API}/tokens/${address}`
      )
    );

    const pair = response.data?.pairs?.[0];
    if (!pair) {
      return null;
    }

    const priceHistory = await fetchPriceHistory(pair.pairAddress);
    const tokenInfo = TOKENS.find(t => t.address === address);

    return {
      address,
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      logo: tokenInfo?.logo || '',
      price: parseFloat(pair.priceUsd),
      priceChange24h: pair.priceChange.h24 || 0,
      volume24h: pair.volume.h24,
      marketCap: pair.marketCap,
      chartData: priceHistory
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchTokenDataWithRetry(address, retries - 1);
    }
    console.error('Token data fetch error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function fetchTokenData(address: string): Promise<TokenData | null> {
  try {
    return await fetchTokenDataWithRetry(address);
  } catch (error) {
    console.error('Token data fetch error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}