"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "@/lib/media";

export default function Gallery({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open === null ? null : items[open];

  return (
    <>
      <div className="gallery">
        {items.map((m, i) => (
          <button key={m.id} className="g-item" onClick={() => setOpen(i)} aria-label={`Open ${m.title}`}>
            {m.kind === "video" ? (
              <>
                <video src={`${m.url}#t=0.1`} preload="metadata" muted playsInline />
                <span className="g-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                </span>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.title} loading="lazy" />
            )}
            <span className="g-cap">
              <b>{m.title}</b>
              {m.location && <small>{m.location}</small>}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={(e) => e.target === e.currentTarget && close()}>
          <button className="lb-close" onClick={close} aria-label="Close">×</button>
          {items.length > 1 && (
            <>
              <button className="lb-nav prev" onClick={() => step(-1)} aria-label="Previous">‹</button>
              <button className="lb-nav next" onClick={() => step(1)} aria-label="Next">›</button>
            </>
          )}
          <figure>
            {current.kind === "video" ? (
              <video key={current.id} src={current.url} controls autoPlay playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={current.id} src={current.url} alt={current.title} />
            )}
            <figcaption>
              <b>{current.title}</b>
              {current.location && <span> · {current.location}</span>}
              {current.description && <p>{current.description}</p>}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
