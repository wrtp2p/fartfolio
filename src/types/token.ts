export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  chartData: ChartData[];
}

export interface ChartData {
  timestamp: number;
  price: number;
}