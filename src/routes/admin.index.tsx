import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useMedia } from "@/hooks/use-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, LogOut, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const { items, reload } = useMedia();
  const [section, setSection] = useState("gallery");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin/login" });
  }, [loading, user, nav]);

  if (loading) return <p className="mt-12 text-center text-muted-foreground">Loading…</p>;
  if (!user) return null;
  if (!isAdmin)
    return (
      <Card className="mt-12 p-8 bg-card border-border">
        <h2 className="text-2xl mb-2">Not authorized</h2>
        <p className="text-muted-foreground mb-4">Your account isn't an admin. Ask Master to grant access.</p>
        <Button onClick={() => supabase.auth.signOut()}><LogOut className="size-4" /> Sign out</Button>
      </Card>
    );

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Pick a file first");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const media_type = file.type.startsWith("video/") ? "video" : "image";
      const { error: insErr } = await supabase.from("media_items").insert({
        section,
        media_type,
        storage_path: path,
        caption: caption || null,
        uploaded_by: user.id,
      });
      if (insErr) throw insErr;
      toast.success("Uploaded!");
      setFile(null);
      setCaption("");
      (document.getElementById("file-input") as HTMLInputElement).value = "";
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string, path: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.storage.from("media").remove([path]);
    await supabase.from("media_items").delete().eq("id", id);
    reload();
  };

  return (
    <div className="space-y-8 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-display text-3xl neon-text-cyan mb-4">UPLOAD PHOTO OR VIDEO</h2>
        <form onSubmit={upload} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-2">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="gallery">Gallery</option>
              <option value="hero">Hero swipe (top of page)</option>
              <option value="events">Events (Sangeeth, performances)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Caption (optional)</label>
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Diwali Sangeeth 2025" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">File (image or video, max ~50MB)</label>
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
              required
            />
          </div>
          <Button type="submit" disabled={uploading} className="bg-primary">
            <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-display text-3xl neon-text-pink mb-4">UPLOADED MEDIA ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Nothing uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((m) => (
              <div key={m.id} className="relative rounded-lg overflow-hidden border border-border group">
                {m.media_type === "video" ? (
                  <video src={m.publicUrl} className="w-full aspect-square object-cover" controls />
                ) : (
                  <img src={m.publicUrl} alt={m.caption ?? ""} className="w-full aspect-square object-cover" />
                )}
                <div className="p-2 text-xs">
                  <p className="text-muted-foreground uppercase tracking-wider">{m.section}</p>
                  {m.caption && <p className="truncate">{m.caption}</p>}
                </div>
                <button
                  onClick={() => remove(m.id, m.storage_path)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition"
                  aria-label="Delete"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
