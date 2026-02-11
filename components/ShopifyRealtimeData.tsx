'use client';

import { useState, useEffect } from 'react';
import { fetchOrders, fetchProducts } from '@/lib/shopifyIntegration';

interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  avgOrderValue: number;
  lastUpdated: string;
}

interface ProductPerformance {
  name: string;
  units: number;
  revenue: number;
  price: number;
}

export function ShopifyRealtimeData() {
  const [orderData, setOrderData] = useState<OrderSummary | null>(null);
  const [products, setProducts] = useState<ProductPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShopifyData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch orders
        const orders = await fetchOrders(100, 'any');
        const productData = await fetchProducts(50);

        // Process order data
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || '0'), 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        // Process product performance
        const productMap = new Map<string, ProductPerformance>();
        productData.forEach((product) => {
          const title = product.title;
          if (!productMap.has(title)) {
            productMap.set(title, {
              name: title,
              units: 0,
              revenue: 0,
              price: parseFloat(product.variants[0]?.price || '0'),
            });
          }
        });

        // Count product sales from orders
        orders.forEach((order) => {
          order.line_items?.forEach((item: any) => {
            const existing = productMap.get(item.title);
            if (existing) {
              existing.units += item.quantity || 0;
              existing.revenue += parseFloat(item.price || '0') * (item.quantity || 0);
            }
          });
        });

        setOrderData({
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          recentOrders: orders.slice(0, 5),
          avgOrderValue: avgOrderValue,
          lastUpdated: new Date().toLocaleTimeString(),
        });

        setProducts(Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Shopify data');
        console.error('Shopify data error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadShopifyData();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadShopifyData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
        <p className="text-slate-400">Syncing Shopify data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-400">
        <p>⚠️ Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Orders (Live)</p>
          <p className="text-3xl font-bold text-amber-400">{orderData?.totalOrders || 0}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Revenue (Live)</p>
          <p className="text-3xl font-bold text-green-400">${orderData?.totalRevenue.toFixed(0) || '0'}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Average Order Value</p>
          <p className="text-3xl font-bold text-blue-400">${orderData?.avgOrderValue.toFixed(2) || '0'}</p>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h3 className="text-amber-400 font-semibold mb-3">📊 Product Performance (Top to Bottom)</h3>
        <div className="space-y-2">
          {products.length > 0 ? (
            products.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <div className="flex-1">
                  <p className="text-slate-300 font-medium">{product.name}</p>
                  <p className="text-slate-500 text-xs">{product.units} units • ${product.revenue.toFixed(2)} revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No product data available</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h3 className="text-amber-400 font-semibold mb-3">🛒 Recent Orders</h3>
        <div className="space-y-2">
          {orderData?.recentOrders && orderData.recentOrders.length > 0 ? (
            orderData.recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <div className="flex-1">
                  <p className="text-slate-300 font-medium">Order #{order.order_number}</p>
                  <p className="text-slate-500 text-xs">
                    {order.customer?.first_name} • {order.line_items?.length || 0} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">${order.total_price}</p>
                  <p className="text-slate-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No recent orders</p>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-xs text-right">
        Last updated: {orderData?.lastUpdated} • Refreshing every 30s
      </p>
    </div>
  );
}
