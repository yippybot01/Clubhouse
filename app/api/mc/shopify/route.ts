import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const shopifyStore = process.env.SHOPIFY_STORE || 'fvmga0-ka.myshopify.com';
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('SHOPIFY_ACCESS_TOKEN environment variable is required');
    }
    
    const url = `https://${shopifyStore}/admin/api/${apiVersion}/orders.json?limit=250&status=any`;
    
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Shopify API returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch Shopify data', message: error.message },
      { status: 500 }
    );
  }
}
