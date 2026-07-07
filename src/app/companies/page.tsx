"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Users,
  BarChart3,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { companies } from "@/lib/mock-data";

const statusConfig: Record<string, { variant: "success" | "default" | "destructive" }> = {
  active: { variant: "success" },
  prospect: { variant: "default" },
  churned: { variant: "destructive" },
};

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell title="Companies" subtitle="Manage your company accounts">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-sm border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-sm border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              List
            </button>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Companies", value: companies.length },
          {
            label: "Active",
            value: companies.filter((c) => c.status === "active").length,
          },
          {
            label: "Prospects",
            value: companies.filter((c) => c.status === "prospect").length,
          },
          {
            label: "Total Contacts",
            value: companies.reduce((sum, c) => sum + c.contacts, 0),
          },
        ].map((stat) => (
          <Card key={stat.label} className="hover:border-primary/20 transition-colors">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Badge variant={statusConfig[company.status]?.variant || "secondary"}>
                    {company.status}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {company.industry}
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>{company.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>{company.revenue} revenue</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex gap-4 text-xs">
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {company.contacts}
                      </span>{" "}
                      contacts
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {company.deals}
                      </span>{" "}
                      deals
                    </span>
                  </div>
                  <button className="p-1 rounded-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contacts
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/10 text-primary">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {company.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {company.industry}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig[company.status]?.variant || "secondary"}>
                        {company.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {company.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {company.employees}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {company.revenue}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {company.contacts}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
