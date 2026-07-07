"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  Eye,
} from "lucide-react";
import { leads } from "@/lib/mock-data";
import Link from "next/link";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "navy" }> = {
  new: { label: "New Lead", variant: "default" },
  contacted: { label: "Contacted", variant: "navy" },
  qualified: { label: "Qualified", variant: "warning" },
  proposal: { label: "Proposal", variant: "secondary" },
  negotiation: { label: "Negotiation", variant: "warning" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
};

function formatCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell title="Leads" subtitle="Manage and track your executive leads">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-sm border border-border bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-sm border border-border bg-white pl-9 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="new">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
        <Button className="gap-2 h-10 px-5">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Executive
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Company
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Num
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Program / Value
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, i) => (
                <tr
                  key={lead.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="text-xs">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/leads/${lead.id}`} className="text-sm font-semibold text-navy hover:text-primary transition-colors">
                          {lead.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {lead.designation || lead.title}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="text-sm font-medium text-navy">{lead.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">{lead.source}</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2 text-sm text-navy">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[180px]">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2 text-sm text-navy whitespace-nowrap">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{lead.phone || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="text-sm font-medium text-navy">
                      {formatCurrency(lead.value)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.program || "TBD"}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge variant={statusConfig[lead.status]?.variant || "secondary"}>
                      {statusConfig[lead.status]?.label || lead.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="text-sm text-navy font-medium whitespace-nowrap">
                      {lead.lastContact}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/leads/${lead.id}`}>
                        <button className="p-2 rounded-sm hover:bg-white border border-transparent hover:border-border text-muted-foreground hover:text-navy transition-all cursor-pointer shadow-sm hover:shadow-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="p-2 rounded-sm hover:bg-white border border-transparent hover:border-border text-muted-foreground hover:text-navy transition-all cursor-pointer shadow-sm hover:shadow-sm">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-sm hover:bg-white border border-transparent hover:border-border text-muted-foreground hover:text-navy transition-all cursor-pointer shadow-sm hover:shadow-sm">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
