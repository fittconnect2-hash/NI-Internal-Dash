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
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts"
import { 
  deliveryPerformance, 
  topRestaurants, 
  liveOrders 
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function DashboardOverview() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#f8f9fc] p-6 md:p-8 space-y-8">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total revenue", value: "AED 84.2k", change: "+12%", trend: "up", icon: DollarSign, color: "bg-[#1a73e8]/10 text-[#1a73e8]" },
          { label: "Orders today", value: "1,382", change: "+7%", trend: "up", icon: Receipt, color: "bg-[#22c55e]/10 text-[#22c55e]" },
          { label: "Active restaurants", value: "247", change: "-3", trend: "down", icon: Store, color: "bg-[#1a73e8]/10 text-[#1a73e8]" },
          { label: "Avg delivery", value: "28 min", change: "-3 min", trend: "up", icon: Clock, color: "bg-amber-100 text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-200 shadow-sm overflow-hidden group hover:border-[#1a73e8]/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.color)}>
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Performance Chart */}
      <Card className="border-slate-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Average Delivery Performance (min)</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">Real-time network latency check</p>
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
            <Button variant="link" className="text-[#e91e63] font-bold text-xs uppercase tracking-widest gap-1 p-0 h-auto">
              Full Analytics <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deliveryPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                tickFormatter={(v) => `${v}m`}
              />
              <Tooltip 
                cursor={{ fill: '#f8f9fc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="selected" fill="#e91e63" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="previous" fill="#f8bbd0" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* Top Restaurants */}
        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Store className="h-4 w-4 text-[#1a73e8]" />
              </div>
              <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Top Performing Restaurants</CardTitle>
            </div>
            <Button variant="link" className="text-[#e91e63] font-bold text-xs uppercase tracking-widest gap-1 p-0">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {topRestaurants.map((res, i) => (
              <div key={i} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                      {res.name[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[15px] text-slate-900 leading-none mb-1">{res.name}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{res.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 leading-none mb-1">{res.orders} orders</div>
                    <div className="text-[11px] font-bold text-slate-400 tabular-nums">{res.revenue}</div>
                  </div>
                </div>
                <Progress value={res.progress} className="h-1.5 bg-slate-100">
                  <div className="h-full bg-[#e91e63] rounded-full" style={{ width: `${res.progress}%` }} />
                </Progress>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Orders */}
        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-[#e91e63]" />
              </div>
              <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Real-time Order Stream</CardTitle>
            </div>
            <Button variant="link" className="text-[#e91e63] font-bold text-xs uppercase tracking-widest gap-1 p-0">
              Live Monitor <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
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
                    "rounded-full px-4 py-1 text-[10px] font-bold border shadow-none uppercase tracking-widest",
                    order.status === 'Delivered' ? "bg-[#e1f9ef] text-[#22c55e] border-none" :
                    order.status === 'On the way' ? "bg-blue-50 text-blue-500 border-none" :
                    order.status === 'Preparing' ? "bg-amber-50 text-amber-600 border-none" :
                    "bg-rose-50 text-rose-500 border-none"
                  )}>
                    {order.status}
                  </Badge>
                  <span className="font-black text-slate-900 tabular-nums min-w-[70px] text-right">{order.amount}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
