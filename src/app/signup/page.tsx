"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is required, show success message
    if (authData.user && !authData.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // If auto-confirmed, create profile row
    if (authData.user && authData.session) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        role: "sales", // Safe default — admin must be set manually
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't block — user can still log in, profile can be created later
      }

      router.push("/");
      router.refresh();
    }

    setLoading(false);
  }

  // Success state — email verification required
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
              We&apos;ve sent a verification link to{" "}
              <span className="font-semibold text-navy">{email}</span>.
              <br />
              Please click the link to activate your account.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
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
              Create Your Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join PilaniLabs CRM to manage your pipeline
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="h-10 w-full rounded-sm border border-border bg-white pl-10 pr-4 text-sm text-navy placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-150"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2"
              >
                Work Email
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="h-10 w-full rounded-sm border border-border bg-white pl-10 pr-10 text-sm text-navy placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2026 PilaniLabs. Executive AI Strategy Training.
        </p>
      </div>
    </div>
  );
}
