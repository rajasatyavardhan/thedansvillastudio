import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex justify-between items-center">
        <Link to="/admin" className="font-display text-2xl neon-text-pink">DANSVILLA · ADMIN</Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  ),
});
