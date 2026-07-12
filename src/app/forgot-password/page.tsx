"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <div className="relative h-12 w-48">
              <Image
                src="/logo.png"
                alt="PilaniLabs"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="bg-card border border-border rounded-sm shadow-[0_4px_24px_rgba(27,42,74,0.06)] p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-gold-light">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-semibold text-navy mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              If an account exists for{" "}
              <span className="font-semibold text-navy">{email}</span>, we&apos;ve
              sent a password reset link.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative h-12 w-48">
            <Image
              src="/logo.png"
              alt="PilaniLabs"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-sm shadow-[0_4px_24px_rgba(27,42,74,0.06)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-semibold text-navy mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-10 w-full rounded-sm border border-border bg-white pl-10 pr-4 text-sm text-navy placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-150"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
