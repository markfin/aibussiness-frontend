import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    
    if (!ticker) {
      return NextResponse.json(
        { status: 'error', error: 'Ticker parameter required' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const backendUrl = `${API_URL}/api/bi?ticker=${encodeURIComponent(ticker.toUpperCase())}`;
    console.log(`[Proxy] Forwarding ${ticker} to backend: ${backendUrl}`);
    
    const backendResponse = await fetch(backendUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'BI-AI-Frontend/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { status: 'error', error: `Backend error: ${errorText || backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Ensure response matches expected format
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const response = NextResponse.json(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
      },
    });

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    return response;
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error.name === 'AbortError' 
          ? 'Request timeout (30s). Backend processing may take time for FinBERT.' 
          : error.message || 'Backend unavailable. Check if running on port 8000 (dev) or deployed (prod).'
      },
      { status: 500 }
    );
  }
}
