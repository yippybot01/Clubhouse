/**
 * Shopify API Integration Utilities
 * 
 * This file provides interfaces and helper functions for integrating real Shopify data
 * Once the Shopify API is connected, replace demo data with actual API calls
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: "active" | "archived" | "draft";
  vendor: string;
  price: number;
  cost: number;
}

export interface ShopifyOrder {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  total_price: number;
  subtotal_price: number;
  total_tax: number;
  currency: string;
  financial_status: "authorized" | "pending" | "paid" | "refunded" | "voided";
  fulfillment_status?: "fulfilled" | "partial" | "unfulled" | "voided" | "on-demand";
  line_items: ShopifyLineItem[];
  customer: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    orders_count: number;
  };
  shipping_address?: {
    country: string;
    country_code: string;
    province?: string;
  };
  source_name: string;
}

export interface ShopifyLineItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  quantity: number;
  price: number;
  sku?: string;
  product_handle: string;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  orders_count: number;
  total_spent: number;
  last_order_id?: string;
  last_order_date?: string;
  addresses: ShopifyAddress[];
}

export interface ShopifyAddress {
  id: string;
  country: string;
  country_code: string;
  province?: string;
  city: string;
  postal_code: string;
  default?: boolean;
}

/**
 * API Client for Shopify
 * To be implemented with your actual Shopify API credentials
 */
export class ShopifyAPIClient {
  private accessToken: string;
  private shopDomain: string;

  constructor(accessToken: string, shopDomain: string) {
    this.accessToken = accessToken;
    this.shopDomain = shopDomain;
  }

  private async makeRequest(endpoint: string, options?: RequestInit) {
    const url = `https://${this.shopDomain}/admin/api/2024-01${endpoint}`;
    const headers = {
      "X-Shopify-Access-Token": this.accessToken,
      "Content-Type": "application/json",
      ...options?.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    }).then((res) => res.json());
  }

  async getOrders(
    status?: "any" | "refunded" | "paid" | "unshipped" | "shipped" | "partial",
    limit = 100
  ) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      status: status || "any",
    });
    return this.makeRequest(`/orders.json?${params}`);
  }

  async getOrdersInDateRange(startDate: Date, endDate: Date) {
    const params = new URLSearchParams({
      created_at_min: startDate.toISOString(),
      created_at_max: endDate.toISOString(),
      limit: "250",
    });
    return this.makeRequest(`/orders.json?${params}`);
  }

  async getCustomers(limit = 100) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    return this.makeRequest(`/customers.json?${params}`);
  }

  async getProducts(limit = 100) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    return this.makeRequest(`/products.json?${params}`);
  }

  async getProductVariants(productId: string) {
    return this.makeRequest(`/products/${productId}/variants.json`);
  }

  async getReports() {
    return this.makeRequest(`/reports.json`);
  }
}

/**
 * Data Transform Functions
 * Convert Shopify data to dashboard-ready format
 */

export function calculateMetrics(orders: ShopifyOrder[]) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const averageOrderValue = totalRevenue / totalOrders || 0;

  // Customer segmentation
  const customers = new Map<string, number>();
  const repeatCustomers = new Set<string>();

  orders.forEach((order) => {
    if (order.customer) {
      const customerId = order.customer.id;
      customers.set(customerId, (customers.get(customerId) || 0) + 1);
      if ((customers.get(customerId) || 0) > 1) {
        repeatCustomers.add(customerId);
      }
    }
  });

  const repeatCustomerRate = (repeatCustomers.size / customers.size) * 100;

  return {
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    uniqueCustomers: customers.size,
    repeatCustomerRate: Math.round(repeatCustomerRate * 10) / 10,
  };
}

export function calculateProductMetrics(orders: ShopifyOrder[]) {
  const productStats: Record<
    string,
    {
      name: string;
      revenue: number;
      units: number;
      orders: number;
    }
  > = {};

  orders.forEach((order) => {
    order.line_items.forEach((item) => {
      if (!productStats[item.product_id]) {
        productStats[item.product_id] = {
          name: item.title,
          revenue: 0,
          units: 0,
          orders: 0,
        };
      }
      productStats[item.product_id].revenue += item.price * item.quantity;
      productStats[item.product_id].units += item.quantity;
      productStats[item.product_id].orders += 1;
    });
  });

  return Object.entries(productStats)
    .map(([id, stats]) => ({
      id,
      ...stats,
      aov: stats.revenue / stats.orders,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function calculateGeographicMetrics(orders: ShopifyOrder[]) {
  const geoStats: Record<
    string,
    {
      country: string;
      countryCode: string;
      orders: number;
      revenue: number;
    }
  > = {};

  orders.forEach((order) => {
    const country = order.shipping_address?.country || "Unknown";
    const countryCode = order.shipping_address?.country_code || "UN";

    if (!geoStats[countryCode]) {
      geoStats[countryCode] = {
        country,
        countryCode,
        orders: 0,
        revenue: 0,
      };
    }

    geoStats[countryCode].orders += 1;
    geoStats[countryCode].revenue += order.total_price;
  });

  return Object.values(geoStats).sort((a, b) => b.revenue - a.revenue);
}

export function calculateCACAndROAS(
  orders: ShopifyOrder[],
  marketingSpend: number
) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customer?.id || o.email)).size;

  const cac = uniqueCustomers > 0 ? marketingSpend / uniqueCustomers : 0;
  const roas = marketingSpend > 0 ? totalRevenue / marketingSpend : 0;

  return {
    cac: Math.round(cac * 100) / 100,
    roas: Math.round(roas * 100) / 100,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCustomers: uniqueCustomers,
  };
}

/**
 * Cache utilities for demo data
 * When real API is integrated, cache will store Shopify data locally
 */
export const demoDataCache = {
  lastUpdated: null as Date | null,
  data: null as any,

  set(data: any) {
    this.data = data;
    this.lastUpdated = new Date();
    // In production, save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "yippy_dashboard_cache",
        JSON.stringify({
          data,
          timestamp: this.lastUpdated,
        })
      );
    }
  },

  get() {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("yippy_dashboard_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        this.data = parsed.data;
        this.lastUpdated = new Date(parsed.timestamp);
        return parsed.data;
      }
    }
    return this.data;
  },

  clear() {
    this.data = null;
    this.lastUpdated = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("yippy_dashboard_cache");
    }
  },
};

/**
 * Placeholder for environment configuration
 * Add these to your .env.local when setting up Shopify integration
 */
export const shopifyConfig = {
  // NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "",
  // NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN || "",
};
