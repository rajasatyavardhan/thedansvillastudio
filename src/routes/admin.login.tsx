import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created! You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        nav({ to: "/admin" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-8 bg-card border-border mt-12">
      <h1 className="font-display text-4xl neon-text-pink mb-2">
        {mode === "signin" ? "ADMIN SIGN IN" : "CREATE ADMIN ACCOUNT"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {mode === "signin"
          ? "Only Master & approved admins."
          : "First account becomes admin automatically. Set this up once."}
      </p>
      <form onSubmit={submit} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit" disabled={busy} className="w-full bg-primary">
          {busy ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>
      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 text-sm text-[var(--neon-cyan)] hover:underline"
      >
        {mode === "signin" ? "First time? Create admin account →" : "Already have account? Sign in →"}
      </button>
    </Card>
  );
}
