import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MediaItem = {
  id: string;
  section: string;
  media_type: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  publicUrl: string;
};

export function useMedia(section?: string) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("media_items").select("*").order("sort_order").order("created_at", { ascending: false });
    if (section) q = q.eq("section", section);
    const { data } = await q;
    const mapped: MediaItem[] = (data ?? []).map((r) => ({
      id: r.id,
      section: r.section,
      media_type: r.media_type,
      storage_path: r.storage_path,
      caption: r.caption,
      sort_order: r.sort_order,
      publicUrl: supabase.storage.from("media").getPublicUrl(r.storage_path).data.publicUrl,
    }));
    setItems(mapped);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [section]);

  return { items, loading, reload: load };
}
