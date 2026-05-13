"use client"

import * as React from "react"
import { 
  DollarSign, 
  Receipt, 
  Store, 
  Clock, 
  RefreshCw, 
  Share, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
  Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  LineChart,
  Line
} from "recharts"
import { 
  servingPerformance, 
  topRestaurants, 
  liveOrders 
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

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
  { name: 'Dine-in', value: 65, color: '#1a73e8' },
  { name: 'Takeaway', value: 25, color: '#e91e63' },
  { name: 'Delivery', value: 10, color: '#f59e0b' },
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

type DashboardTab = 'revenue' | 'orders' | 'restaurants' | 'serving';

export function DashboardOverview() {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('revenue')

  const stats = [
    { id: 'revenue', label: "Total revenue", value: "AED 84.2k", change: "+12%", trend: "up", icon: DollarSign, color: "text-[#1a73e8]" },
    { id: 'orders', label: "Orders today", value: "1,382", change: "+7%", trend: "up", icon: Receipt, color: "text-[#22c55e]" },
    { id: 'restaurants', label: "Active network", value: "247", change: "-3", trend: "down", icon: Store, color: "text-[#1a73e8]" },
    { id: 'serving', label: "Avg serving", value: "28 min", change: "-3 min", trend: "up", icon: Clock, color: "text-amber-600" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'revenue':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Performance</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">Daily revenue vs transaction volume</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-[#1a73e8]" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue (AED)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-[#e91e63]" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Orders</span>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `AED ${v/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#1a73e8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Line type="monotone" dataKey="orders" stroke="#e91e63" strokeWidth={2} dot={{ fill: '#e91e63', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="p-8 border-b border-slate-50 bg-white">
                  <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Revenue by Channel</CardTitle>
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
                  <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Top Revenue Contributors</CardTitle>
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
                        <div className="font-black text-[#1a73e8] leading-none mb-1">{res.revenue}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth: +14%</div>
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
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Order Velocity</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">Transaction flow by hour</p>
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
                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Live Order Stream</CardTitle>
                <Button variant="link" className="text-[#e91e63] font-bold text-xs uppercase tracking-widest">Monitor All <ChevronRight className="h-4 w-4" /></Button>
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
      case 'restaurants':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-slate-200 shadow-sm p-8">
                <CardTitle className="text-lg font-black text-slate-900 mb-6">Network Distribution</CardTitle>
                <div className="h-[300px] w-full bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                  <div className="text-center">
                    <Store className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-400">Map Visualization Placeholder</p>
                  </div>
                </div>
              </Card>
              <Card className="border-slate-200 shadow-sm p-8">
                <CardTitle className="text-lg font-black text-slate-900 mb-6">Outlet Growth</CardTitle>
                <div className="space-y-6">
                  {['UAE', 'USA', 'UK', 'Others'].map((region, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-700">{region}</span>
                        <span className="text-sm font-black text-slate-900">{80 - i * 15} Outlets</span>
                      </div>
                      <Progress value={80 - i * 15} className="h-2 bg-slate-100" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 bg-white">
                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Active Brand Portfolio</CardTitle>
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Users</p>
                        <p className="text-sm font-black text-slate-900">{(i + 2) * 4}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                        <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[10px]">Live</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )
      case 'serving':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Average Serving Performance (min)</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">Network latency benchmark</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#e91e63]" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Selected Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#f8bbd0]" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Previous Average</span>
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
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Peak Serving Time</h4>
                <p className="text-2xl font-black text-slate-900">1:30 PM</p>
                <p className="text-[10px] text-green-500 font-bold mt-1">+8% volume</p>
              </Card>
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Kitchen Efficiency</h4>
                <p className="text-2xl font-black text-slate-900">92.4%</p>
                <p className="text-[10px] text-green-500 font-bold mt-1">Optimal zone</p>
              </Card>
              <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Network Reliability</h4>
                <p className="text-2xl font-black text-slate-900">99.9%</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Last 24 hours</p>
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
            <span>NetworkDine</span>
            <span className="opacity-50">/</span>
            <span className="text-slate-900">Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-500">7d</Button>
            <Button variant="default" size="sm" className="h-8 text-xs font-bold bg-slate-900 hover:bg-slate-800 shadow-none">Today</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-500">MTD</Button>
          </div>
          <Button variant="outline" size="sm" className="h-10 border-slate-200 font-bold gap-2 text-slate-600">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" className="h-10 bg-[#e91e63] hover:bg-[#d81b60] font-bold gap-2 shadow-lg shadow-[#e91e63]/20">
            <Share className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* Stats Grid - Acting as Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.id} 
            className={cn(
              "border-slate-200 shadow-sm overflow-hidden group transition-all duration-300 cursor-pointer active:scale-[0.98]",
              activeTab === stat.id 
                ? "border-[#1a73e8] bg-white ring-2 ring-[#1a73e8]/10 shadow-md scale-[1.02]" 
                : "bg-white hover:border-slate-300 hover:shadow-md"
            )}
            onClick={() => setActiveTab(stat.id as DashboardTab)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                  activeTab === stat.id ? "bg-[#1a73e8] text-white" : "bg-slate-50 " + stat.color
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
                activeTab === stat.id ? "text-[#1a73e8]" : "text-slate-400"
              )}>{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              
              {activeTab === stat.id && (
                <div className="mt-4 flex items-center text-[9px] font-black text-[#1a73e8] uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                  Viewing Analysis <ChevronRight className="ml-1 h-3 w-3" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dynamic Content Based on Selected Tab */}
      <div className="pb-10">
        {renderContent()}
      </div>
    </div>
  )
}
