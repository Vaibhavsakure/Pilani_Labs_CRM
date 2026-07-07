"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Video,
  Search,
  FileText,
  ChevronRight,
} from "lucide-react";
import { consultations } from "@/lib/mock-data";

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  discovery: { icon: Search, color: "text-navy", bg: "bg-navy-light/10" },
  demo: { icon: Video, color: "text-primary", bg: "bg-gold-light" },
  strategy: { icon: FileText, color: "text-warning", bg: "bg-amber-50" },
  review: { icon: Calendar, color: "text-success", bg: "bg-green-50" },
  training: { icon: Users, color: "text-navy", bg: "bg-secondary" },
};

const statusConfig: Record<string, { variant: "navy" | "success" | "destructive" | "warning" }> = {
  scheduled: { variant: "navy" },
  completed: { variant: "success" },
  cancelled: { variant: "destructive" },
  rescheduled: { variant: "warning" },
};

export default function ConsultationsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredConsultations =
    filter === "all"
      ? consultations
      : consultations.filter((c) => c.status === filter);

  const today = "2026-07-07";
  const todayConsultations = consultations.filter((c) => c.date === today);
  const upcomingConsultations = consultations.filter(
    (c) => c.date > today && c.status === "scheduled"
  );

  return (
    <AppShell title="Consultations" subtitle="Schedule and manage client strategy sessions">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "scheduled", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-150 cursor-pointer border ${
                filter === status
                  ? "bg-gold-light text-primary border-primary/20"
                  : "bg-white text-muted-foreground border-border hover:text-navy hover:bg-secondary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <Button className="gap-2 h-10 px-5">
          <Plus className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today</p>
            <p className="text-3xl font-display font-semibold mt-1 text-primary">{todayConsultations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upcoming</p>
            <p className="text-3xl font-display font-semibold mt-1 text-navy">{upcomingConsultations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</p>
            <p className="text-3xl font-display font-semibold mt-1 text-success">
              {consultations.filter((c) => c.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cancelled</p>
            <p className="text-3xl font-display font-semibold mt-1 text-destructive">
              {consultations.filter((c) => c.status === "cancelled").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consultation List */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => {
          const typeInfo = typeConfig[consultation.type] || typeConfig.discovery;
          const TypeIcon = typeInfo.icon;

          return (
            <Card
              key={consultation.id}
              className="group hover:border-primary/40 transition-colors duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-5">
                  {/* Type Icon */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-sm ${typeInfo.bg} ${typeInfo.color} shrink-0 border border-border/50`}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-navy">
                          {consultation.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                          {consultation.client}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={statusConfig[consultation.status]?.variant || "navy"}>
                          {consultation.status}
                        </Badge>
                        <Badge variant="outline">{consultation.type}</Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{consultation.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {consultation.time} <span className="mx-1 text-border">•</span> {consultation.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{consultation.attendees.length} attendees</span>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex -space-x-2">
                        {consultation.attendees.slice(0, 3).map((attendee, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-white">
                            <AvatarFallback className="text-[10px] bg-secondary text-navy">
                              {attendee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {consultation.attendees.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-secondary text-[10px] font-medium text-navy">
                            +{consultation.attendees.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {consultation.attendees.slice(0, 2).join(", ")}
                        {consultation.attendees.length > 2 &&
                          ` +${consultation.attendees.length - 2}`}
                      </span>
                    </div>

                    {/* Notes & Outcome */}
                    {(consultation.notes || consultation.outcome) && (
                      <div className="mt-4 flex gap-4">
                        {consultation.notes && (
                          <div className="flex-1 rounded-sm border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
                            <span className="font-semibold text-navy block mb-1">Notes</span>
                            {consultation.notes}
                          </div>
                        )}
                        {consultation.outcome && (
                          <div className="flex-1 rounded-sm border border-primary/20 bg-gold-light/50 p-3 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary block mb-1">Outcome</span>
                            {consultation.outcome}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <button className="p-2 rounded-sm hover:bg-secondary border border-transparent hover:border-border text-muted-foreground hover:text-navy transition-all shrink-0 cursor-pointer">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
