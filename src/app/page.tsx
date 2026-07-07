"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  CalendarCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import {
  dashboardStats,
  revenueData,
  leadSourceData,
  weeklyActivity,
  consultations,
  tasks,
  followUps,
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
} from "recharts";

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  suffix = "",
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="group hover:border-border transition-colors duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-display font-semibold text-navy mt-1">
              {prefix}
              {typeof value === "number" ? value.toLocaleString("en-IN") : value}
              {suffix}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-success" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-destructive" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold-light text-primary group-hover:bg-primary/20 transition-colors duration-200">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
            {entry.name === "Revenue" || entry.name === "Target"
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const upcomingConsultations = consultations.filter(
    (c) => c.status === "scheduled"
  );
  const urgentTasks = tasks.filter(
    (t) => t.status !== "done" && (t.priority === "high" || t.priority === "urgent")
  );

  return (
    <AppShell title="Dashboard" subtitle="Welcome back, Arjun 👋">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        <div className="xl:col-span-2">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats.totalRevenue)}
            change={dashboardStats.revenueGrowth}
            icon={DollarSign}
          />
        </div>
        <StatCard
          title="Total Leads"
          value={dashboardStats.totalLeads}
          change={dashboardStats.leadsGrowth}
          icon={Users}
        />
        <StatCard
          title="Proposals"
          value={dashboardStats.proposalsSent}
          change={12.5}
          icon={BarChart3}
        />
        <StatCard
          title="Deals Won"
          value={dashboardStats.dealsWon}
          change={dashboardStats.dealsGrowth}
          icon={Target}
        />
        <StatCard
          title="Conversion"
          value={dashboardStats.conversionRate}
          change={dashboardStats.conversionGrowth}
          icon={TrendingUp}
          suffix="%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="font-display">Revenue Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly revenue vs target
              </p>
            </div>
            <Badge variant="success">On Track</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8962E" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#C8962E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B2A4A" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#1B2A4A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#C8962E"
                    strokeWidth={3}
                    fill="url(#revenueGrad)"
                    activeDot={{ r: 6, fill: "#C8962E", stroke: "#FFF", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#1B2A4A"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#targetGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display">Lead Sources</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Where your leads come from
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
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
                              {payload[0].name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payload[0].value}%
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
            <div className="space-y-3 mt-4">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {source.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-navy">
                    {source.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline & Follow-ups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Pipeline Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display">Pipeline Value</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(dashboardStats.pipelineValue)} total
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { stage: "Consultation Scheduled", count: 4, value: 880000, color: "bg-navy-light" },
              { stage: "Proposal Sent", count: 3, value: 1230000, color: "bg-primary" },
              { stage: "Negotiation", count: 2, value: 1200000, color: "bg-navy" },
              { stage: "Closed Won", count: 1, value: 890000, color: "bg-success" },
            ].map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy">
                    {item.stage}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.count} deals · <span className="font-medium text-navy">{formatCurrency(item.value)}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{
                      width: `${(item.value / dashboardStats.pipelineValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Follow-ups */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display">Today's Follow-ups</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              You have {followUps.length} follow-ups today
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {followUps.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-4 rounded-sm p-3 bg-secondary/50 border border-transparent hover:border-border transition-colors duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shrink-0 shadow-sm border border-border">
                  {f.type === "Email" ? <Mail className="h-4 w-4" /> : f.type === "Call" ? <Phone className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {f.company}
                  </p>
                </div>
                <span className="text-xs font-medium text-navy bg-white px-2 py-1 rounded-sm border border-border shadow-sm">
                  {f.time.split(", ")[1]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Consultations */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display">Upcoming Consultations</CardTitle>
              <Badge variant="navy">{upcomingConsultations.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingConsultations.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-sm border border-border p-4 hover:border-primary/40 transition-colors duration-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold-light text-primary shrink-0">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">
                    {c.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {c.client} · {c.date} at {c.time}
                  </p>
                </div>
                <Badge
                  variant={
                    c.type === "discovery"
                      ? "default"
                      : c.type === "demo"
                      ? "secondary"
                      : c.type === "strategy"
                      ? "warning"
                      : "success"
                  }
                >
                  {c.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display">Priority Tasks</CardTitle>
              <Badge variant="destructive">{urgentTasks.length} due</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-sm border border-border p-4 hover:border-primary/40 transition-colors duration-200"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-sm shrink-0 ${
                    t.priority === "urgent"
                      ? "bg-red-50 text-destructive"
                      : "bg-amber-50 text-warning"
                  }`}
                >
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">
                    {t.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.assignee} · Due {t.dueDate}
                  </p>
                </div>
                <Badge
                  variant={t.priority === "urgent" ? "destructive" : "warning"}
                >
                  {t.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
