import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const shopifyStore = process.env.SHOPIFY_STORE || 'fvmga0-ka.myshopify.com';
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('SHOPIFY_ACCESS_TOKEN environment variable is required');
    }
    
    // Paginate through ALL orders
    let allOrders: any[] = [];
    let nextUrl: string | null = `https://${shopifyStore}/admin/api/${apiVersion}/orders.json?limit=250&status=any`;
    
    while (nextUrl) {
      const res: Response = await fetch(nextUrl, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Shopify API returned ${res.status}`);
      }
      
      const data = await res.json();
      allOrders = allOrders.concat(data.orders || []);
      
      // Check for next page via Link header
      const linkHeader = res.headers.get('Link');
      nextUrl = null;
      if (linkHeader) {
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        if (nextMatch) {
          nextUrl = nextMatch[1];
        }
      }
    }
    
    return NextResponse.json({ orders: allOrders });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch Shopify data', message: error.message },
      { status: 500 }
    );
  }
}
