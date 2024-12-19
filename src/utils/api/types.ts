export interface DexScreenerPair {
  baseToken: {
    name: string;
    symbol: string;
    address: string;
    logoURI?: string;
  };
  quoteToken: {
    name: string;
    symbol: string;
    address: string;
  };
  priceUsd: string;
  priceChange: {
    h1?: number;
    h6?: number;
    h24?: number;
  };
  volume: {
    h24: number;
  };
  marketCap: number;
  pairAddress: string;
  chainId: string;
  dexId: string;
}

export interface DexScreenerResponse {
  pairs: DexScreenerPair[];
}

export interface ChartCandle {
  time: number;
  close: string;
}