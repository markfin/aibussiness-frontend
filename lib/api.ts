export type AnalyzeResponse = {
  status: string;
  ticker: string;
  generated_at?: string;
  data?: {
    stock_data?: {
      current_price?: number;
      price_change?: number;
      price_change_percent?: number;
      closing_prices?: number[];
      dates?: string[];
      average_price?: number;
      highest_price?: number;
      lowest_price?: number;
    };
    news_data?: {
      headlines?: string[];
    };
    sentiment?: {
      score?: number;
      label?: string;
      breakdown?: Record<string, any>;
      interpretation?: string;
    };
    recommendations?: Array<{
      title?: string;
      description?: string;
      priority?: string;
    }>;
  };
  error?: string;
};

function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return base;
}

export async function fetchAnalyze(ticker: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/bi?ticker=${encodeURIComponent(ticker)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error: ${res.status} ${text}`.trim());
  }

  return (await res.json()) as AnalyzeResponse;
}

