/**
 * Demo data for Yippy Pouches analytics
 * Realistic metrics reflecting actual business performance
 * Ready for Shopify API integration
 */

export interface ChartDataPoint {
  date?: string;
  day?: string;
  week?: string;
  name?: string;
  value?: number;
  revenue?: number;
  orders?: number;
  units?: number;
  aov?: number;
  rate?: number;
  actual?: number;
  forecast?: number;
  [key: string]: any;
}

// ============================================
// CORE METRICS (Yippy Pouches Baseline)
// ============================================
export const coreMetrics = {
  totalRevenue: 4597,
  totalOrders: 106,
  totalUnits: 640,
  repeatCustomerRate: 3,
  repeatCustomerGoal: 10,
  bundleAttachRate: 25,
  bundleAttachGoal: 35,
  aov: 43.37,
  conversionRate: 2.8,
  conversionGoal: 4.5,
  cac: 12.5,
  cacGoal: 8,
  roas: 3.2,
  roasGoal: 4,
};

// ============================================
// REVENUE FORECAST (7-day, 30-day)
// ============================================
export const revenueForecastData: ChartDataPoint[] = [
  { day: "Mon", actual: 685, forecast: 650 },
  { day: "Tue", actual: 742, forecast: 720 },
  { day: "Wed", actual: 698, forecast: 710 },
  { day: "Thu", actual: 720, forecast: 745 },
  { day: "Fri", actual: 815, forecast: 800 },
  { day: "Sat", actual: 920, forecast: 900 },
  { day: "Sun", actual: 650, forecast: 680 },
];

export const revenue30DayForecast: ChartDataPoint[] = [
  { week: "Week 1", actual: 3200, forecast: 3100 },
  { week: "Week 2", actual: 3850, forecast: 3600 },
  { week: "Week 3", actual: 4100, forecast: 4200 },
  { week: "Week 4", actual: 4500, forecast: 4800 },
  { week: "Week 5+", actual: 0, forecast: 5200 },
];

// ============================================
// PRODUCT PERFORMANCE
// ============================================
export const productPerformance = [
  { name: "Golf (FTC)", revenue: 2954, units: 390, percentage: 64, color: "#1f7c2f" },
  { name: "Work (FTD)", revenue: 600, units: 90, percentage: 13, color: "#3b82f6" },
  { name: "Bundles", revenue: 1044, units: 160, percentage: 23, color: "#f59e0b" },
];

export const productPerformanceDetail: ChartDataPoint[] = [
  { name: "Golf", revenue: 2954, units: 390, aov: 50, conversionRate: 3.2 },
  { name: "Work", revenue: 600, units: 90, aov: 45, conversionRate: 2.1 },
  { name: "Bundles", revenue: 1044, units: 160, aov: 65, conversionRate: 1.8 },
];

// ============================================
// CUSTOMER SEGMENTATION
// ============================================
export const customerSegmentation = [
  { name: "First-time", value: 103, percentage: 97, color: "#60a5fa" },
  { name: "Repeat", value: 3, percentage: 3, color: "#10b981" },
];

// ============================================
// AOV TREND (7/14/30 day moving average)
// ============================================
export const aovTrendData: ChartDataPoint[] = [
  { day: "Day 1", ma7: 41.2, ma14: 40.8, ma30: 42.5 },
  { day: "Day 2", ma7: 41.5, ma14: 41.2, ma30: 42.3 },
  { day: "Day 3", ma7: 42.1, ma14: 41.5, ma30: 42.1 },
  { day: "Day 4", ma7: 42.8, ma14: 41.9, ma30: 41.9 },
  { day: "Day 5", ma7: 43.1, ma14: 42.3, ma30: 41.8 },
  { day: "Day 6", ma7: 43.5, ma14: 42.8, ma30: 41.9 },
  { day: "Day 7", ma7: 43.8, ma14: 43.2, ma30: 42.1 },
];

// ============================================
// REPEAT CUSTOMER RATE GAUGE
// ============================================
export const repeatCustomerTrend: ChartDataPoint[] = [
  { month: "Baseline", rate: 2.1 },
  { month: "Month 1", rate: 2.4 },
  { month: "Month 2", rate: 2.8 },
  { month: "Month 3", rate: 3.0 },
  { month: "Goal", rate: 10 },
];

// ============================================
// BUNDLE ATTACH RATE
// ============================================
export const bundleAttachTrend: ChartDataPoint[] = [
  { month: "Baseline", rate: 18 },
  { month: "Month 1", rate: 20 },
  { month: "Month 2", rate: 22 },
  { month: "Month 3", rate: 25 },
  { month: "Goal", rate: 35 },
];

// ============================================
// CUSTOMER LIFETIME VALUE (CLV)
// ============================================
export const clvEstimate = {
  baselineRepeatRate: 0.03,
  avgOrderValue: 43.37,
  avgOrdersPerYear: 4,
  grossMargin: 0.65,
  estimatedClv: 563, // 43.37 * 4 * 0.65 / 0.03
  highValueClv: 1200, // Repeat customers
};

// ============================================
// SALES BY CHANNEL
// ============================================
export const salesByChannel: ChartDataPoint[] = [
  { name: "Direct", value: 98, percentage: 92.5, color: "#10b981" },
  { name: "Shop", value: 7, percentage: 6.6, color: "#8b5cf6" },
  { name: "Other", value: 1, percentage: 0.9, color: "#ef4444" },
];

// ============================================
// TOP PRODUCTS MINI BAR CHART
// ============================================
export const topProductsData: ChartDataPoint[] = [
  { name: "Golf Pouch", value: 2954, revenue: 2954, units: 390 },
  { name: "Work Pouch", value: 600, revenue: 600, units: 90 },
  { name: "Bundle Pack", value: 1044, revenue: 1044, units: 160 },
];

// ============================================
// GEOGRAPHIC/SOURCE BREAKDOWN
// ============================================
export const geographicBreakdown: ChartDataPoint[] = [
  { region: "United States", value: 95, percentage: 89.6, revenue: 4100 },
  { region: "Canada", value: 8, percentage: 7.5, revenue: 350 },
  { region: "Europe", value: 2, percentage: 1.9, revenue: 120 },
  { region: "Other", value: 1, percentage: 0.9, revenue: 27 },
];

export const trafficSourceBreakdown: ChartDataPoint[] = [
  { source: "Organic", value: 45, percentage: 42.5, revenue: 1950 },
  { source: "Paid (Google)", value: 35, percentage: 33.0, revenue: 1520 },
  { source: "Social (TikTok)", value: 20, percentage: 18.9, revenue: 870 },
  { source: "Direct", value: 6, percentage: 5.7, revenue: 260 },
];

// ============================================
// INSIGHTS & OPPORTUNITIES
// ============================================
export const keyOpportunities = [
  {
    opportunity: "Increase Repeat Customer Rate",
    current: "3%",
    target: "10%",
    impact: "High ROI",
    lever: "Email nurture sequence, loyalty program",
    priority: 1,
    estRevenue: "+$1,840 (40% increase)",
  },
  {
    opportunity: "Boost Bundle Attach Rate",
    current: "25%",
    target: "35%+",
    impact: "Medium ROI",
    lever: "Cart upsells, product bundling",
    priority: 2,
    estRevenue: "+$420 (9% increase)",
  },
  {
    opportunity: "Lower CAC Below $8",
    current: "$12.50",
    target: "$8.00",
    impact: "Medium ROI",
    lever: "Organic channel focus, referral program",
    priority: 3,
    estRevenue: "+650 customers/month",
  },
  {
    opportunity: "Diversify Sales Channels",
    current: "92.5% Direct",
    target: "70% Direct max",
    impact: "Risk mitigation",
    lever: "Amazon, Shopify Partners, affiliates",
    priority: 4,
    estRevenue: "+$2,000/month",
  },
];

// ============================================
// ACTION ITEMS FOR THIS WEEK
// ============================================
export const actionItems = [
  {
    action: "Launch email nurture sequence",
    owner: "Marketing",
    dueDate: "Feb 12",
    impact: "High",
    status: "not_started",
    description: "5-email sequence targeting existing customers",
  },
  {
    action: "A/B test bundle upsell messaging",
    owner: "Product",
    dueDate: "Feb 10",
    impact: "High",
    status: "in_progress",
    description: "Test 3 variants on checkout page",
  },
  {
    action: "Analyze top traffic sources",
    owner: "Analytics",
    dueDate: "Feb 13",
    impact: "Medium",
    status: "not_started",
    description: "Identify which sources have best CAC",
  },
  {
    action: "Create loyalty program framework",
    owner: "Product",
    dueDate: "Feb 20",
    impact: "High",
    status: "not_started",
    description: "Points-based reward system for repeats",
  },
];

// ============================================
// ALERTS (Metrics Trending Down, Anomalies)
// ============================================
export const alerts = [
  {
    type: "warning",
    metric: "Conversion Rate",
    current: 2.8,
    previous: 3.2,
    change: -12.5,
    status: "trending_down",
    description: "Conversion rate dropped 12.5% week-over-week. Investigate checkout flow.",
    actionRequired: true,
  },
  {
    type: "info",
    metric: "AOV Trend",
    current: 43.37,
    previous: 41.5,
    change: 4.4,
    status: "trending_up",
    description: "AOV up 4.4% this week. Bundle strategy is working!",
    actionRequired: false,
  },
  {
    type: "warning",
    metric: "Repeat Rate",
    current: 3.0,
    previous: 2.8,
    change: 7.1,
    status: "stagnant",
    description: "Repeat rate stuck at 3%. Need retention strategy.",
    actionRequired: true,
  },
];

// ============================================
// WEEKLY REVENUE TREND (Last 12 weeks)
// ============================================
export const weeklyRevenueTrend: ChartDataPoint[] = [
  { week: "Week 1", revenue: 350 },
  { week: "Week 2", revenue: 420 },
  { week: "Week 3", revenue: 510 },
  { week: "Week 4", revenue: 615 },
  { week: "Week 5", revenue: 745 },
  { week: "Week 6", revenue: 890 },
  { week: "Week 7", revenue: 1050 },
  { week: "Week 8", revenue: 920 },
  { week: "Week 9", revenue: 1100 },
  { week: "Week 10", revenue: 1050 },
  { week: "Week 11", revenue: 1150 },
  { week: "Week 12", revenue: 1200 },
];

// ============================================
// MONTHLY COMPARISON
// ============================================
export const monthlyComparison: ChartDataPoint[] = [
  { month: "January", revenue: 2450, units: 320, orders: 55, aov: 41.2 },
  { month: "February", revenue: 2147, units: 320, orders: 51, aov: 45.1 },
];

export function getDateRangeData(days: number = 7) {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.floor(Math.random() * 500 + 600),
      orders: Math.floor(Math.random() * 8 + 12),
      aov: Math.floor((Math.random() * 10 + 40) * 100) / 100,
    });
  }
  
  return data;
}
