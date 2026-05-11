function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return base;
}

export async function fetchAnalyze(ticker) {
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

  return await res.json();
}

