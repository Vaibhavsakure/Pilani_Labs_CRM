"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Award,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  revenueData,
  leadSourceData,
  lostReasons,
  leads,
  pipelineDeals,
  tasks,
  consultations,
} from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-card p-3">
        <p className="text-xs font-semibold text-navy mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs text-muted-foreground">
            <span style={{ color: entry.color, fontWeight: 500 }}>{entry.name}: </span>
            {typeof entry.value === "number" && entry.value > 1000
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Team performance data
const teamPerformance = [
  {
    name: "Arjun Mehta",
    deals: 4,
    revenue: 1260000,
    conversionRate: 38,
    tasksCompleted: 12,
    consultations: 8,
  },
  {
    name: "Neha Verma",
    deals: 3,
    revenue: 2030000,
    conversionRate: 42,
    tasksCompleted: 9,
    consultations: 6,
  },
  {
    name: "Sanya Kapoor",
    deals: 3,
    revenue: 710000,
    conversionRate: 28,
    tasksCompleted: 15,
    consultations: 5,
  },
];

// Monthly conversion data
const conversionData = [
  { month: "Jan", leads: 18, qualified: 8, won: 3 },
  { month: "Feb", leads: 22, qualified: 10, won: 4 },
  { month: "Mar", leads: 20, qualified: 12, won: 5 },
  { month: "Apr", leads: 25, qualified: 11, won: 4 },
  { month: "May", leads: 30, qualified: 15, won: 6 },
  { month: "Jun", leads: 28, qualified: 14, won: 8 },
  { month: "Jul", leads: 24, qualified: 10, won: 5 },
];

export default function ReportsPage() {
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalTarget = revenueData.reduce((sum, d) => sum + d.target, 0);

  return (
    <AppShell title="Reports" subtitle="Performance insights and analytics">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "YTD Revenue",
            value: formatCurrency(totalRevenue),
            change: "+23.5%",
            positive: true,
            icon: DollarSign,
          },
          {
            label: "Total Leads",
            value: leads.length.toString(),
            change: "+18%",
            positive: true,
            icon: Users,
          },
          {
            label: "Win Rate",
            value: "34.2%",
            change: "+5.8%",
            positive: true,
            icon: Target,
          },
          {
            label: "Avg Deal Cycle",
            value: "28 days",
            change: "-3 days",
            positive: true,
            icon: Calendar,
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="group hover:border-border transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-display font-semibold mt-1 text-navy">{kpi.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {kpi.positive ? (
                      <ArrowUpRight className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${kpi.positive ? "text-success" : "text-destructive"}`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last year</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold-light text-primary group-hover:bg-primary/20 transition-colors">
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue vs Target + Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display">Revenue vs Target</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Monthly performance</p>
              </div>
              <Badge variant={totalRevenue >= totalTarget ? "success" : "warning"}>
                {totalRevenue >= totalTarget ? "Ahead" : "Behind"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(v) => `₹${v / 100000}L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#C8962E"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="target"
                    name="Target"
                    fill="#1B2A4A"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display">Conversion Funnel</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Leads → Qualified → Won</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    name="Leads"
                    stroke="#D5D0C7"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#D5D0C7" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qualified"
                    name="Qualified"
                    stroke="#C8962E"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#C8962E" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="won"
                    name="Won"
                    stroke="#1B2A4A"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#1B2A4A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources & Lost Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display">Lead Sources</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Distribution by channel</p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="tooltip-card p-2">
                            <p className="text-xs font-semibold text-navy">
                              {payload[0].name}: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4 grid grid-cols-2 gap-x-4">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-muted-foreground">{source.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-navy">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display">Closed Lost Reasons</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Why deals are lost</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-4">
              {lostReasons.map((reason) => (
                <div key={reason.reason} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-navy">{reason.reason}</span>
                    <span className="text-sm font-semibold text-navy">{reason.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${reason.percentage}%`,
                        backgroundColor: reason.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display">Team Performance</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Consultant metrics</p>
            </div>
            <Badge variant="navy">Q3 2026</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Consultant
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Deals Won
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((member, i) => (
                  <tr
                    key={member.name}
                    className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-navy">{member.name}</p>
                          <p className="text-xs text-muted-foreground">Partner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-navy">
                      {member.deals}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-navy">
                      {formatCurrency(member.revenue)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${member.conversionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-navy">
                          {member.conversionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-navy">
                      {member.consultations}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          member.conversionRate >= 40
                            ? "success"
                            : member.conversionRate >= 30
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {member.conversionRate >= 40
                          ? "Excellent"
                          : member.conversionRate >= 30
                          ? "Good"
                          : "Average"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
