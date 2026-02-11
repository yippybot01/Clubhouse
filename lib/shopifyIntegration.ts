/**
 * Shopify Admin API Integration
 * Read-only access to orders, products, customers, inventory
 */

const SHOPIFY_API_TOKEN = process.env.SHOPIFY_API_TOKEN;
const SHOPIFY_STORE_NAME = process.env.SHOPIFY_STORE_NAME || 'fvmga0-ka';
const SHOPIFY_API_VERSION = '2024-01';
const SHOPIFY_STORE_URL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}`;

export interface ShopifyOrder {
  id: string;
  order_number: number;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: string;
  }>;
  total_price: string;
  currency: string;
  fulfillment_status: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  status: string;
  published_at: string;
  tags: string;
  variants: Array<{
    id: string;
    title: string;
    sku: string;
    price: string;
    inventory_quantity: number;
  }>;
}

/**
 * Fetch recent orders from Shopify
 */
export async function fetchOrders(limit = 50, status = 'any'): Promise<ShopifyOrder[]> {
  if (!SHOPIFY_API_TOKEN) {
    console.error('❌ SHOPIFY_API_TOKEN not configured');
    return [];
  }

  try {
    const query = new URLSearchParams({
      limit: limit.toString(),
      status: status,
      fields: 'id,order_number,created_at,customer,line_items,total_price,currency,fulfillment_status',
    });

    const response = await fetch(`${SHOPIFY_STORE_URL}/orders.json?${query}`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Shopify API error: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.error('Response:', error);
      return [];
    }

    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('❌ Error fetching Shopify orders:', error);
    return [];
  }
}

/**
 * Fetch all products
 */
export async function fetchProducts(limit = 250): Promise<ShopifyProduct[]> {
  if (!SHOPIFY_API_TOKEN) {
    console.error('❌ SHOPIFY_API_TOKEN not configured');
    return [];
  }

  try {
    const query = new URLSearchParams({
      limit: limit.toString(),
      fields: 'id,title,handle,vendor,product_type,created_at,status,published_at,tags,variants',
    });

    const response = await fetch(`${SHOPIFY_STORE_URL}/products.json?${query}`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Shopify API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('❌ Error fetching Shopify products:', error);
    return [];
  }
}

/**
 * Fetch customer data
 */
export async function fetchCustomers(limit = 250): Promise<any[]> {
  if (!SHOPIFY_API_TOKEN) {
    console.error('❌ SHOPIFY_API_TOKEN not configured');
    return [];
  }

  try {
    const query = new URLSearchParams({
      limit: limit.toString(),
      fields: 'id,email,first_name,last_name,created_at,updated_at,total_spent,orders_count',
    });

    const response = await fetch(`${SHOPIFY_STORE_URL}/customers.json?${query}`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Shopify API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.customers || [];
  } catch (error) {
    console.error('❌ Error fetching Shopify customers:', error);
    return [];
  }
}

/**
 * Test connection
 */
export async function testConnection(): Promise<boolean> {
  if (!SHOPIFY_API_TOKEN) {
    console.error('❌ SHOPIFY_API_TOKEN not set');
    return false;
  }

  try {
    const response = await fetch(`${SHOPIFY_STORE_URL}/shop.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Connection test failed: ${response.status} ${response.statusText}`);
      console.error(`Store URL: ${SHOPIFY_STORE_URL}`);
      return false;
    }

    const data = await response.json();
    console.log('✅ Shopify connection successful. Store:', data.shop?.name);
    return true;
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return false;
  }
}
