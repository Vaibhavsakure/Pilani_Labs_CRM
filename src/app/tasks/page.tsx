"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Search,
  CalendarDays,
} from "lucide-react";
import { tasks } from "@/lib/mock-data";

const priorityConfig: Record<string, { color: string; bg: string; variant: "destructive" | "warning" | "default" | "secondary" | "navy" }> = {
  urgent: { color: "text-destructive", bg: "bg-red-50", variant: "destructive" },
  high: { color: "text-warning", bg: "bg-amber-50", variant: "warning" },
  medium: { color: "text-primary", bg: "bg-gold-light", variant: "default" },
  low: { color: "text-navy", bg: "bg-secondary", variant: "navy" },
};

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  todo: { icon: Circle, label: "To Do", color: "text-muted-foreground" },
  "in-progress": { icon: Clock, label: "In Progress", color: "text-primary" },
  review: { icon: AlertTriangle, label: "In Review", color: "text-warning" },
  done: { icon: CheckCircle2, label: "Done", color: "text-success" },
};

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <AppShell title="Tasks" subtitle="Follow-ups, proposals, and team activities">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-sm border border-border bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-sm border border-border bg-white px-4 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <Button className="gap-2 h-10 px-5">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          return (
            <Card
              key={status}
              className={`hover:border-primary/30 transition-colors cursor-pointer ${
                statusFilter === status ? "border-primary bg-gold-light/20" : ""
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === status ? "all" : status)
              }
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {config.label}
                    </p>
                    <p className="text-3xl font-display font-semibold mt-1 text-navy">
                      {statusTasks.length}
                    </p>
                  </div>
                  <div className={`p-2 rounded-sm bg-secondary ${config.color}`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const priority = priorityConfig[task.priority];
          const status = statusConfig[task.status];
          const StatusIcon = status.icon;

          return (
            <Card
              key={task.id}
              className="group hover:border-primary/40 transition-colors duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <button className="mt-0.5 shrink-0 cursor-pointer border border-transparent rounded-sm p-1 hover:border-border hover:bg-secondary transition-all">
                    <StatusIcon
                      className={`h-5 w-5 ${status.color}`}
                    />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className={`text-base font-semibold transition-colors ${
                            task.status === "done"
                              ? "text-muted-foreground line-through"
                              : "text-navy group-hover:text-primary"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      </div>
                      <Badge variant={priority.variant} className="shrink-0">{task.priority}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 mt-4">
                      {/* Assignee */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="text-[10px] bg-gold-light text-primary">
                            {task.assignee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-navy">
                          {task.assignee}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>Due {task.dueDate}</span>
                      </div>

                      {/* Related */}
                      {task.relatedTo && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <span className="text-border">|</span>
                          <span className="text-primary hover:underline cursor-pointer">{task.relatedTo}</span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex items-center gap-2 ml-auto">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-sm border border-border bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
