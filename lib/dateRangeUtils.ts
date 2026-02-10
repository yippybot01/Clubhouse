/**
 * Date Range Filtering Utilities
 * Filters demo data based on selected date range (7d, 14d, 30d, 90d)
 */

export function filterDataByDateRange(
  data: Array<{ date?: string; day?: string; month?: string }>,
  range: "7d" | "14d" | "30d" | "90d"
): Array<any> {
  if (!data || data.length === 0) return data;

  const daysMap = {
    "7d": 7,
    "14d": 14,
    "30d": 30,
    "90d": 90,
  };

  const daysToKeep = daysMap[range];
  
  // For demo data, just return the last N items
  // In production, this would filter by actual dates
  return data.slice(Math.max(0, data.length - daysToKeep));
}

export function calculateMetricsByDateRange(
  orders: Array<{ date: string; revenue: number }>,
  range: "7d" | "14d" | "30d" | "90d"
) {
  const filtered = filterDataByDateRange(orders, range);
  
  if (filtered.length === 0) {
    return {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalOrders: 0,
      growth: 0,
    };
  }

  const totalRevenue = filtered.reduce((sum, o) => sum + o.revenue, 0);
  const totalOrders = filtered.length;
  const averageOrderValue = totalRevenue / totalOrders;

  // Calculate growth (simple: compare first half vs second half)
  const midpoint = Math.floor(filtered.length / 2);
  const firstHalf = filtered.slice(0, midpoint);
  const secondHalf = filtered.slice(midpoint);

  const firstHalfAvg =
    firstHalf.reduce((sum, o) => sum + o.revenue, 0) / firstHalf.length || 0;
  const secondHalfAvg =
    secondHalf.reduce((sum, o) => sum + o.revenue, 0) / secondHalf.length || 0;

  const growth =
    firstHalfAvg > 0
      ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
      : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    totalOrders,
    growth: Math.round(growth * 10) / 10,
  };
}
