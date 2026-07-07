"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Globe,
  MoreHorizontal,
  ChevronLeft,
  FileText,
  DollarSign,
  Activity,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { leads, pipelineDeals, tasks, consultations } from "@/lib/mock-data";
import Link from "next/link";
import { useParams } from "next/navigation";

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  // Find lead by ID, fallback to the first one for demonstration
  const lead = leads.find((l) => l.id === id) || leads[0];
  
  // Get related data
  const leadDeals = pipelineDeals.filter(d => d.company === lead.company);
  const leadTasks = tasks.filter(t => t.relatedTo === lead.company);
  const leadConsultations = consultations.filter(c => c.client === lead.company);

  return (
    <AppShell title="Lead Profile" subtitle={`Managing ${lead.name} at ${lead.company}`}>
      <div className="mb-6">
        <Link href="/leads" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-navy transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Profile & Details */}
        <div className="xl:col-span-1 space-y-8">
          {/* Main Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-border mb-4">
                  <AvatarFallback className="text-2xl bg-secondary text-navy">
                    {lead.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-display font-semibold text-navy">{lead.name}</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">{lead.designation || lead.title} at {lead.company}</p>
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="navy">{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</Badge>
                  <Badge variant="outline">{lead.source}</Badge>
                </div>
                
                <div className="flex items-center justify-center gap-3 w-full border-t border-border pt-6">
                  <Button className="flex-1 gap-2 bg-navy hover:bg-navy-light">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button variant="outline" className="px-3" aria-label="More">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-medium text-navy">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-navy">{lead.phone || "+91 (Not Provided)"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">LinkedIn</p>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">linkedin.com/in/{lead.name.toLowerCase().replace(" ", "")}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Company</p>
                  <p className="text-sm font-medium text-navy">{lead.company}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity, Deals, Notes */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-secondary/50 border-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-navy shadow-sm border border-border">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Est. Value</p>
                    <p className="text-lg font-display font-semibold text-navy">{formatCurrency(lead.value)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-navy shadow-sm border border-border">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Interest</p>
                    <p className="text-lg font-display font-semibold text-navy">{lead.program || "TBD"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-navy shadow-sm border border-border">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Contact</p>
                    <p className="text-lg font-display font-semibold text-navy">{lead.lastContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Deals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Active Deals
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                {leadDeals.length > 0 ? (
                  <div className="divide-y divide-border">
                    {leadDeals.map(deal => (
                      <div key={deal.id} className="p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-semibold text-navy">{deal.title}</h4>
                          <span className="text-sm font-semibold text-navy">{formatCurrency(deal.value)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[10px]">{deal.stage}</Badge>
                          <span className="text-xs font-medium text-muted-foreground">{deal.probability}% Win Prob.</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Close: {deal.expectedClose}</span>
                          <span className="flex items-center gap-1">Owned by: <span className="font-medium text-navy">{deal.owner}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-4">No active deals for this lead.</p>
                    <Button variant="outline" size="sm">Create Deal</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Consultations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Consultations
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Schedule</Button>
              </CardHeader>
              <CardContent className="p-0">
                {leadConsultations.length > 0 ? (
                  <div className="divide-y divide-border">
                    {leadConsultations.map(consultation => (
                      <div key={consultation.id} className="p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-semibold text-navy line-clamp-1 pr-4">{consultation.title}</h4>
                          <Badge variant={consultation.status === "completed" ? "success" : "navy"} className="shrink-0">{consultation.status}</Badge>
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" /> {consultation.date}
                            <span className="mx-1">•</span>
                            <Clock className="h-3.5 w-3.5 text-primary" /> {consultation.time} ({consultation.duration})
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-muted-foreground">With:</span>
                            <div className="flex -space-x-1.5">
                              {consultation.attendees.map((attendee, i) => (
                                <Avatar key={i} className="h-5 w-5 border border-white">
                                  <AvatarFallback className="text-[8px] bg-secondary text-navy">
                                    {attendee.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No upcoming consultations.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                
                {/* Timeline Item 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gold-light text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-sm border border-border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-navy">Proposal Sent</h4>
                      <time className="text-xs font-medium text-muted-foreground">Today, 2:30 PM</time>
                    </div>
                    <p className="text-sm text-muted-foreground">Sent the updated Executive Training proposal to {lead.name} outlining the 3-phase rollout.</p>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-secondary text-navy shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-sm border border-border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-navy">Consultation Completed</h4>
                      <time className="text-xs font-medium text-muted-foreground">Jul 5, 2026</time>
                    </div>
                    <p className="text-sm text-muted-foreground">Completed the 60-minute Strategy Discovery session. Client is highly interested in the GenAI modules.</p>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-secondary text-navy shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-sm border border-border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-navy">Initial Qualification Call</h4>
                      <time className="text-xs font-medium text-muted-foreground">Jul 1, 2026</time>
                    </div>
                    <p className="text-sm text-muted-foreground">Discussed timeline and budget. Qualified as a strong fit for the Enterprise Private Program.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
