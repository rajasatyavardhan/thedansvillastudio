import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptLoading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
  return scriptLoading;
}

export function InstagramEmbed({ url, caption }: { url: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadScript().then(() => {
      window.instgrm?.Embeds.process();
    });
  }, [url]);

  return (
    <div ref={ref} className="ig-embed-wrap">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#0a0a0a",
          border: 0,
          margin: 0,
          maxWidth: "100%",
          minWidth: "260px",
          padding: 0,
          width: "100%",
        }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#fff" }}>
          {caption ?? "View on Instagram"}
        </a>
      </blockquote>
    </div>
  );
}
