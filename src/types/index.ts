export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export interface Stats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  type: 'stock' | 'crypto' | 'etf' | 'mutual-fund';
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  gainPercentage: number;
  dailyChange: number;
}