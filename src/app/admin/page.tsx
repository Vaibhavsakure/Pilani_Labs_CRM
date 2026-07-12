"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import type { Profile, UserRole } from "@/lib/database.types";
import {
  Users,
  Shield,
  Search,
  Filter,
  Loader2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

const roleColors: Record<UserRole, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  manager: "bg-info/10 text-info border-info/20",
  sales: "bg-success/10 text-success border-success/20",
  viewer: "bg-muted text-muted-foreground border-border",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  sales: "Sales",
  viewer: "Viewer",
};

export default function AdminPage() {
  const { profile: currentProfile, canAccessAdmin, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    userId: string;
    userName: string;
    newRole: UserRole;
    isSelf: boolean;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !canAccessAdmin()) {
      router.push("/");
    }
  }, [authLoading, canAccessAdmin, router]);

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setProfiles(data as Profile[]);
    }
    if (error) {
      console.error("Error fetching profiles:", error);
    }
    setLoading(false);
  }

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setChangingRole(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      console.error("Error updating role:", error);
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
      );
    }
    setChangingRole(null);
    setConfirmDialog(null);
  }

  // Filter and search
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const totalUsers = profiles.length;
  const roleCounts = profiles.reduce(
    (acc, p) => {
      acc[p.role] = (acc[p.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (authLoading || (!canAccessAdmin() && !authLoading)) {
    return (
      <AppShell title="Admin" subtitle="User Management">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Admin" subtitle="User Management & Roles">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-card shadow-[0_2px_12px_rgba(27,42,74,0.04)]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold-light text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-2xl font-display font-semibold text-navy">
                  {totalUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {(["admin", "manager", "sales", "viewer"] as UserRole[]).map((role) => (
          <Card
            key={role}
            className="bg-card shadow-[0_2px_12px_rgba(27,42,74,0.04)]"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-secondary text-navy">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {roleLabels[role]}
                  </p>
                  <p className="text-2xl font-display font-semibold text-navy">
                    {roleCounts[role] || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Management Table */}
      <Card className="shadow-[0_2px_12px_rgba(27,42,74,0.04)]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-border bg-secondary/30">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="h-9 w-full rounded-sm border border-border bg-white pl-9 pr-4 text-sm text-navy placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as UserRole | "all")
                }
                className="h-9 appearance-none rounded-sm border border-border bg-white pl-9 pr-8 text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="sales">Sales</option>
                <option value="viewer">Viewer</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">
                      User
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">
                      Email
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">
                      Role
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">
                      Joined
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((p) => {
                    const isSelf = currentProfile?.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                              <AvatarFallback className="text-xs">
                                {p.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-navy">
                                {p.full_name}
                                {isSelf && (
                                  <span className="ml-2 text-[10px] text-muted-foreground font-normal uppercase">
                                    (You)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-navy">{p.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${roleColors[p.role]}`}
                          >
                            {roleLabels[p.role]}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(p.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="relative inline-block">
                            <select
                              value={p.role}
                              onChange={(e) => {
                                const newRole = e.target.value as UserRole;
                                if (newRole === p.role) return;
                                setConfirmDialog({
                                  userId: p.id,
                                  userName: p.full_name,
                                  newRole,
                                  isSelf,
                                });
                              }}
                              disabled={changingRole === p.id}
                              className="h-8 appearance-none rounded-sm border border-border bg-white pl-3 pr-7 text-xs text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="sales">Sales</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProfiles.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-muted-foreground"
                      >
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-sm shadow-[0_8px_32px_rgba(27,42,74,0.15)] p-6 w-full max-w-md mx-4">
            {confirmDialog.isSelf && (
              <div className="flex items-start gap-3 rounded-sm border border-warning/30 bg-warning/5 px-4 py-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Warning: Changing Your Own Role
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You are about to change your own role. If you remove your
                    admin access, you will no longer be able to manage users.
                  </p>
                </div>
              </div>
            )}
            <h3 className="text-lg font-display font-semibold text-navy mb-2">
              Confirm Role Change
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Change{" "}
              <span className="font-semibold text-navy">
                {confirmDialog.userName}
              </span>
              &apos;s role to{" "}
              <span className="font-semibold text-navy">
                {roleLabels[confirmDialog.newRole]}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialog(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  handleRoleChange(
                    confirmDialog.userId,
                    confirmDialog.newRole
                  )
                }
                disabled={changingRole === confirmDialog.userId}
                className={
                  confirmDialog.isSelf &&
                  confirmDialog.newRole !== "admin"
                    ? "bg-destructive hover:bg-destructive/90"
                    : ""
                }
              >
                {changingRole === confirmDialog.userId ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {confirmDialog.isSelf && confirmDialog.newRole !== "admin"
                  ? "Yes, Remove My Admin"
                  : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
