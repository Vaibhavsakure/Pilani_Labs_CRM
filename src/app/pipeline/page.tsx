"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  DollarSign,
  Calendar,
  GripVertical,
} from "lucide-react";
import { pipelineDeals } from "@/lib/mock-data";

const stages = [
  { key: "new-lead", label: "New Lead", dotColor: "bg-muted-foreground" },
  { key: "contacted", label: "Contacted", dotColor: "bg-navy-light" },
  { key: "consultation-scheduled", label: "Consultation Scheduled", dotColor: "bg-info" },
  { key: "consultation-done", label: "Consultation Done", dotColor: "bg-warning" },
  { key: "proposal-sent", label: "Proposal Sent", dotColor: "bg-primary" },
  { key: "negotiation", label: "Negotiation", dotColor: "bg-navy" },
  { key: "won", label: "Closed Won", dotColor: "bg-success" },
  { key: "lost", label: "Closed Lost", dotColor: "bg-destructive" },
];

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function PipelinePage() {
  const totalValue = pipelineDeals
    .filter((d) => d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <AppShell title="Pipeline" subtitle="Manage opportunities and deal flow">
      {/* Kanban Board */}
      <div className="flex gap-5 overflow-x-auto pb-4 h-[calc(100vh-140px)] items-start">
        {stages.map((stage) => {
          const stageDeals = pipelineDeals.filter((d) => d.stage === stage.key);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.key}
              className="flex-shrink-0 w-[320px] flex flex-col max-h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${stage.dotColor}`} />
                  <h3 className="text-sm font-semibold text-navy">
                    {stage.label}
                  </h3>
                  <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-navy">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {formatCurrency(stageValue)}
                </span>
              </div>

              {/* Deal Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="group hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-border"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {deal.company}
                          </p>
                          <h4 className="text-sm font-semibold text-navy leading-snug">
                            {deal.title}
                          </h4>
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-navy font-medium">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{formatCurrency(deal.value)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Close by {deal.expectedClose}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-border">
                            <AvatarFallback className="text-[10px]">
                              {deal.owner
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-navy">
                            {deal.owner}
                          </span>
                        </div>
                        
                        {deal.nextFollowUp && (
                          <Badge variant="outline" className="text-[10px] py-0 font-medium">
                            Follow up: {deal.nextFollowUp.slice(5)}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Deal Button */}
                <button className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-dashed border-border bg-white p-3 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
