"use client"

import * as React from "react"
import { 
  DollarSign, 
  Receipt, 
  Store, 
  Clock, 
  RefreshCw, 
  Share, 
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  Cell
} from "recharts"
import { 
  servingPerformance, 
  topRestaurants, 
  liveOrders 
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Analytical Data
const revenueTrend = [
  { day: 'Mon', revenue: 12400, orders: 180 },
  { day: 'Tue', revenue: 15600, orders: 210 },
  { day: 'Wed', revenue: 11200, orders: 165 },
  { day: 'Thu', revenue: 18900, orders: 245 },
  { day: 'Fri', revenue: 24500, orders: 310 },
  { day: 'Sat', revenue: 28200, orders: 380 },
  { day: 'Sun', revenue: 22100, orders: 290 },
];

const revenueBySource = [
  { name: 'Eating in Restaurant', value: 65, color: 'hsl(var(--primary))' },
  { name: 'Picking up Food', value: 25, color: '#e91e63' },
  { name: 'Home Delivery', value: 10, color: '#f59e0b' },
];

const orderVolumeData = [
  { hour: '11am', current: 120, previous: 95 },
  { hour: '12pm', current: 240, previous: 210 },
  { hour: '1pm', current: 190, previous: 180 },
  { hour: '2pm', current: 150, previous: 130 },
  { hour: '6pm', current: 280, previous: 250 },
  { hour: '7pm', current: 320, previous: 290 },
  { hour: '8pm', current: 290, previous: 310 },
];

const networkDistData = [
  { region: 'Dubai', outlets: 84, color: 'hsl(var(--primary))' },
  { region: 'Abu Dhabi', outlets: 52, color: '#3b82f6' },
  { region: 'New York', outlets: 41, color: '#e91e63' },
  { region: 'London', outlets: 38, color: '#f43f5e' },
  { region: 'California', outlets: 32, color: '#f59e0b' },
];

type DashboardTab = 'revenue' | 'orders' | 'growth' | 'efficiency';
type TimeRange = '7d' | 'Today' | 'MTD';

export function DashboardOverview() {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('revenue')
  const [timeRange, setTimeRange] = React.useState<TimeRange>('Today')
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  // Simplified stats for everyone to understand
  const getStats = (range: TimeRange) => {
    const baseStats = [
      { id: 'revenue', label: "Total Sales", value: "AED 84.2k", change: "+12%", trend: "up", icon: DollarSign, color: "text-primary", desc: "Money collected from all shops" },
      { id: 'orders', label: "Number of Orders", value: "1,382", change: "+7%", trend: "up", icon: Receipt, color: "text-[#22c55e]", desc: "How many customers bought food" },
      { id: 'growth', label: "Total Restaurants", value: "247", change: "-3", trend: "down", icon: Store, color: "text-primary", desc: "Number of shops currently open" },
      { id: 'efficiency', label: "Average Service Time", value: "28 min", change: "-3 min", trend: "up", icon: Clock, color: "text-amber-600", desc: "How fast we get food to tables" },
    ]

    if (range === '7d') {
      return baseStats.map(s => s.id === 'revenue' ? { ...s, value: 'AED 582.4k', change: '+18%' } : s)
    }
    if (range === 'MTD') {
      return baseStats.map(s => s.id === 'revenue' ? { ...s, value: 'AED 2.4M', change: '+24%' } : s)
    }
    return baseStats
  }

  const stats = getStats(timeRange)

  const renderContent = () => {
    switch (activeTab) {
      case 'revenue':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">How much money are we making?</h3>
                  <p className="text-sm text-slate-500 mt-1">This chart shows your daily sales compared to how many orders were placed.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-primary" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sales (AED)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-[#e91e63]" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order Count</span>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `AED ${v/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Line type="monotone" dataKey="orders" stroke="#e91e63" strokeWidth={2} dot={{ fill: '#e91e63', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="p-8 border-b border-slate-50 bg-white">
                  <CardTitle className="text-lg font-black text-slate-900 tracking-tight">How are customers buying food?</CardTitle>
                  <p className="text-sm text-slate-500">Are people eating at the restaurant or ordering for delivery?</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {revenueBySource.map((source, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />
                            <span className="text-sm font-extrabold text-slate-700">{source.name}</span>
                          </div>
                          <span className="text-sm font-black text-slate-900">{source.value}%</span>
                        </div>
                        <Progress value={source.value} className="h-2 bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="p-8 border-b border-slate-50 bg-white">
                  <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Which brands are doing best?</CardTitle>
                  <p className="text-sm text-slate-500">The most popular restaurant brands in your network.</p>
                </CardHeader>
                <CardContent className="p-0">
                  {topRestaurants.slice(0, 3).map((res, i) => (
                    <div key={i} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">{res.name[0]}</div>
                        <div>
                          <h4 className="font-extrabold text-[15px] text-slate-900 leading-none mb-1">{res.name}</h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{res.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-primary leading-none mb-1">{res.revenue}</div>
                        <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Doing Better +14%</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">When are we the busiest?</h3>
                  <p className="text-sm text-slate-500 mt-1">Check this to see which hours of the day have the most orders.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-[#22c55e]" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yesterday</span>
                  </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: '#f8f9fc' }} />
                    <Bar dataKey="current" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="previous" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-white">
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 tracking-tight">What's happening right now?</CardTitle>
                  <p className="text-sm text-slate-500">Live list of orders being prepared and served.</p>
                </div>
                <Button variant="link" className="text-[#e91e63] font-bold text-xs uppercase tracking-widest">See All Live Orders <ChevronRight className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="p-0">
                {liveOrders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] font-bold text-slate-400 tabular-nums">{order.id}</span>
                      <div>
                        <h4 className="font-extrabold text-[15px] text-slate-900 mb-0.5">{order.customer}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{order.restaurant}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <Badge className={cn(
                        "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-none",
                        order.status === 'Served' ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {order.status}
                      </Badge>
                      <span className="font-black text-slate-900 tabular-nums text-right">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )
      case 'growth':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-slate-200 shadow-sm p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Where are our restaurants?</h3>
                  <p className="text-sm text-slate-500 mt-2">See how many shops are open in each city.</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={networkDistData} margin={{ left: 20, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="region" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8f9fc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="outlets" radius={[0, 4, 4, 0]} barSize={24}>
                        {networkDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="border-slate-200 shadow-sm p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Setup progress for new places</h3>
                  <p className="text-sm text-slate-500 mt-2">Are new restaurant brands ready to start selling?</p>
                </div>
                <div className="space-y-6">
                  {[
                    { country: 'UAE', target: 100, current: 80 },
                    { country: 'USA', target: 80, current: 65 },
                    { country: 'UK', target: 70, current: 50 },
                    { country: 'Others', target: 50, current: 35 }
                  ].map((region, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-700">{region.country}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{region.current} Live</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Goal: {region.target}</span>
                        </div>
                      </div>
                      <Progress value={(region.current / region.target) * 100} className="h-2 bg-slate-100" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 bg-white">
                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Active Brand List</CardTitle>
                <p className="text-sm text-slate-500">Every restaurant company currently using our platform.</p>
              </CardHeader>
              <CardContent className="p-0">
                {topRestaurants.map((res, i) => (
                  <div key={i} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">{res.name[0]}</div>
                      <div>
                        <h4 className="font-extrabold text-[15px] text-slate-900 leading-none mb-1">{res.name}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{res.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Staff</p>
                        <p className="text-sm font-black text-slate-900">{(i + 2) * 4}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                        <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[10px]">Open</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )
      case 'efficiency':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">How fast are we serving customers?</h3>
                  <p className="text-sm text-slate-500 mt-1">This measures how many minutes it takes to get food to customers.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#e91e63]" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Wait Time Now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#f8bbd0]" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Wait Time Before</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servingPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `${v}m`} />
                    <Tooltip cursor={{ fill: '#f8f9fc' }} />
                    <Bar dataKey="selected" fill="#e91e63" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="previous" fill="#f8bbd0" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Peak Busy Time</h4>
                <p className="text-2xl font-black text-slate-900">1:30 PM</p>
                <p className="text-[10px] text-green-500 font-bold mt-1">Doing well</p>
              </Card>
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Kitchen Speed</h4>
                <p className="text-2xl font-black text-slate-900">92.4%</p>
                <p className="text-[10px] text-green-500 font-bold mt-1">Very Good</p>
              </Card>
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">System Status</h4>
                <p className="text-2xl font-black text-slate-900">Always On</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Everything is working</p>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#f8f9fc] p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span>DineNet Admin</span>
            <span className="opacity-50">/</span>
            <span className="text-slate-900">Home Screen</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">How is the platform doing?</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-[18px] p-1.5 flex items-center gap-1 shadow-sm">
            {(['7d', 'Today', 'MTD'] as TimeRange[]).map((range) => (
              <Button 
                key={range}
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 px-5 text-sm font-bold transition-all duration-300 rounded-[12px]",
                  timeRange === range 
                    ? "bg-[#0f172a] text-white hover:bg-[#0f172a] shadow-lg" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
                onClick={() => setTimeRange(range)}
              >
                {range === 'Today' ? 'Today' : range === '7d' ? 'Last 7 Days' : 'This Month'}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("h-10 border-slate-200 font-bold gap-2 text-slate-600", isRefreshing && "opacity-50 pointer-events-none")}
            onClick={handleRefresh}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /> Update Now
          </Button>
          <Button size="sm" className="h-10 bg-[#e91e63] hover:bg-[#d81b60] font-bold gap-2 shadow-lg shadow-[#e91e63]/20">
            <Share className="h-4 w-4" /> Save Report
          </Button>
        </div>
      </div>

      {/* Stats Grid - Acting as Tabs */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", isRefreshing && "opacity-70 grayscale transition-all")}>
        {stats.map((stat) => (
          <Card 
            key={stat.id} 
            className={cn(
              "border-slate-200 shadow-sm overflow-hidden group transition-all duration-300 cursor-pointer active:scale-[0.98]",
              activeTab === stat.id 
                ? "border-primary bg-white ring-2 ring-primary/10 shadow-md scale-[1.02]" 
                : "bg-white hover:border-slate-300 hover:shadow-md"
            )}
            onClick={() => setActiveTab(stat.id as DashboardTab)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                  activeTab === stat.id ? "bg-primary text-white" : "bg-slate-50 " + stat.color
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[11px] font-bold",
                  stat.trend === 'up' ? "text-green-500" : "text-rose-500"
                )}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors",
                activeTab === stat.id ? "text-primary" : "text-slate-400"
              )}>{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">{stat.desc}</p>
              
              {activeTab === stat.id && (
                <div className="mt-4 flex items-center text-[9px] font-black text-primary uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                  Click to see details <ChevronRight className="ml-1 h-3 w-3" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation for sections */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'revenue', label: 'Revenue' },
          { id: 'orders', label: 'Orders' },
          { id: 'growth', label: 'Growth' },
          { id: 'efficiency', label: 'Speed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={cn(
              "px-8 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Based on Selected Tab */}
      <div className={cn("pb-10", isRefreshing && "opacity-50 pointer-events-none")}>
        {renderContent()}
      </div>
    </div>
  )
}
