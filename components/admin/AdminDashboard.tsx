"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import Logo from "@/components/Logo";

type Section = "tours" | "gallery";
type Kind = "image" | "video";
type Item = { id: string; section: Section; kind: Kind; url: string; title: string; location: string; description: string; createdAt: string };
type Job = { key: string; name: string; progress: number; status: "uploading" | "saving" | "done" | "error"; error?: string };

const sectionLabels: Record<Section, string> = { tours: "Our tours", gallery: "Gallery" };
const accept = "image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime";
const limits: Record<Kind, number> = { image: 20, video: 300 };

function titleFromFile(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
    .slice(0, 120);
}

function uploadLocal(file: File, onProgress: (p: number) => void) {
  return new Promise<{ url: string; kind: Kind }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error. Check your connection and try again."));
    xhr.send(file);
  });
}

function Preview({ item, controls = false }: { item: Pick<Item, "kind" | "url" | "title">; controls?: boolean }) {
  return item.kind === "video" ? (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video src={`${item.url}#t=0.1`} preload="metadata" muted playsInline controls={controls} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.url} alt={item.title} loading="lazy" />
  );
}

export default function AdminDashboard({ initialItems, storage }: { initialItems: Item[]; storage: "blob" | "local" }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [section, setSection] = useState<Section>("gallery");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formError, setFormError] = useState("");
  const [filter, setFilter] = useState<"all" | Section>("all");
  const [editing, setEditing] = useState<Item | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = jobs.some((j) => j.status === "uploading" || j.status === "saving");
  const shown = items.filter((i) => filter === "all" || i.section === filter);
  const counts = { all: items.length, tours: items.filter((i) => i.section === "tours").length, gallery: items.filter((i) => i.section === "gallery").length };

  function pick(list: FileList | null) {
    if (!list) return;
    const ok: File[] = [];
    const problems: string[] = [];
    for (const f of Array.from(list)) {
      const kind: Kind | null = f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : null;
      if (!kind || !accept.split(",").includes(f.type)) problems.push(`${f.name}: use JPG, PNG, WebP, AVIF, GIF, MP4, WebM or MOV`);
      else if (f.size > limits[kind] * 1024 * 1024) problems.push(`${f.name}: larger than ${limits[kind]} MB`);
      else ok.push(f);
    }
    setFiles((prev) => [...prev, ...ok]);
    setFormError(problems.join(". "));
  }

  const patchJob = (key: string, patch: Partial<Job>) => setJobs((js) => js.map((j) => (j.key === key ? { ...j, ...patch } : j)));

  async function startUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length) return setFormError("Choose at least one photo or video.");
    if (files.length === 1 && !title.trim()) return setFormError("Add a title.");
    setFormError("");
    const batch = files.map((f, i) => ({ file: f, key: `${Date.now()}-${i}` }));
    setJobs(batch.map(({ file, key }) => ({ key, name: file.name, progress: 0, status: "uploading" })));
    setFiles([]);

    for (const { file, key } of batch) {
      try {
        const onProgress = (p: number) => patchJob(key, { progress: p });
        let url: string;
        let kind: Kind;
        if (storage === "blob") {
          const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "file";
          const res = await upload(`media/files/${safe}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/blob",
            multipart: file.size > 8 * 1024 * 1024,
            onUploadProgress: ({ percentage }) => onProgress(Math.round(percentage)),
          });
          url = res.url;
          kind = file.type.startsWith("video/") ? "video" : "image";
        } else {
          ({ url, kind } = await uploadLocal(file, onProgress));
        }
        patchJob(key, { status: "saving", progress: 100 });
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            kind,
            section,
            title: batch.length === 1 ? title : title.trim() ? `${title.trim()} ${batch.findIndex((b) => b.key === key) + 1}` : titleFromFile(file.name),
            location,
            description,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not save");
        setItems((list) => [data, ...list]);
        patchJob(key, { status: "done" });
      } catch (err) {
        patchJob(key, { status: "error", error: (err as Error).message });
      }
    }
    setTitle("");
    setLocation("");
    setDescription("");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/media/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    if (!res.ok) return setFormError(data.error || "Could not save changes.");
    setItems((list) => list.map((i) => (i.id === data.id ? data : i)));
    setEditing(null);
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (res.ok) setItems((list) => list.filter((i) => i.id !== id));
    setConfirmId(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="wrap">
          <Logo id="lm-adm" />
          <div className="adm-top-actions">
            <a className="btn btn-outline" href="/" target="_blank" rel="noopener">View website</a>
            <button className="btn btn-teal" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="wrap adm-main">
        <section className="adm-card">
          <h1>Upload photos &amp; videos</h1>
          <p className="adm-sub">
            Photos and videos appear on your homepage right after upload. Use <b>Our tours</b> for tour packages and <b>Gallery</b> for trip photos and customer moments.
          </p>

          <form onSubmit={startUpload} className="adm-upload">
            <div
              className={`adm-drop${drag ? " drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                pick(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
              </svg>
              <b>Drag photos or videos here, or tap to choose</b>
              <span>JPG, PNG, WebP up to {limits.image} MB · MP4, MOV, WebM up to {limits.video} MB</span>
              <input ref={inputRef} type="file" accept={accept} multiple hidden onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
            </div>

            {files.length > 0 && (
              <ul className="adm-picked">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span><em>{f.type.startsWith("video/") ? "Video" : "Photo"}</em> {f.name}</span>
                    <small>{(f.size / 1024 / 1024).toFixed(1)} MB</small>
                    <button type="button" onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`}>×</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="adm-fields">
              <fieldset className="adm-seg">
                <legend>Show in</legend>
                {(Object.keys(sectionLabels) as Section[]).map((s) => (
                  <label key={s}>
                    <input type="radio" name="section" checked={section === s} onChange={() => setSection(s)} />
                    <span>{sectionLabels[s]}</span>
                  </label>
                ))}
              </fieldset>
              <label>
                Title {files.length > 1 && <small>(optional for several files)</small>}
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={section === "tours" ? "e.g. Manali 4 nights / 5 days" : "e.g. Family trip to Shimla"} maxLength={120} />
              </label>
              <label>
                Place <small>(optional)</small>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Himachal Pradesh" maxLength={80} />
              </label>
              <label className="full">
                Description <small>(optional)</small>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={600} placeholder={section === "tours" ? "What's included: route, stops, number of days, vehicle options…" : "A short caption for this photo or video"} />
              </label>
            </div>

            {formError && <p className="adm-error" role="alert">{formError}</p>}
            <button className="btn btn-primary" disabled={busy || !files.length}>
              {busy ? "Uploading…" : `Upload ${files.length || ""} ${files.length === 1 ? "file" : "files"}`.replace("  ", " ")}
            </button>
          </form>

          {jobs.length > 0 && (
            <ul className="adm-jobs">
              {jobs.map((j) => (
                <li key={j.key} className={j.status}>
                  <span className="name">{j.name}</span>
                  <span className="bar"><i style={{ width: `${j.progress}%` }} /></span>
                  <span className="st">
                    {j.status === "uploading" ? `${j.progress}%` : j.status === "saving" ? "Saving…" : j.status === "done" ? "Done ✓" : j.error}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-list-head">
            <h2>Your media</h2>
            <div className="adm-filter" role="tablist">
              {(["all", "tours", "gallery"] as const).map((f) => (
                <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : sectionLabels[f]} <span>{counts[f]}</span>
                </button>
              ))}
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="adm-empty">Nothing here yet. Upload your first photo or video above and it will show on the homepage.</p>
          ) : (
            <div className="adm-grid">
              {shown.map((item) => (
                <article key={item.id} className="adm-item">
                  <div className="adm-thumb">
                    <Preview item={item} controls={item.kind === "video"} />
                    <span className={`adm-badge ${item.section}`}>{sectionLabels[item.section]}</span>
                  </div>
                  <div className="adm-item-body">
                    <h3>{item.title}</h3>
                    {item.location && <small>{item.location}</small>}
                    {confirmId === item.id ? (
                      <div className="adm-confirm">
                        <span>Delete permanently?</span>
                        <button className="danger" onClick={() => remove(item.id)}>Delete</button>
                        <button onClick={() => setConfirmId(null)}>Keep</button>
                      </div>
                    ) : (
                      <div className="adm-actions">
                        <button onClick={() => setEditing(item)}>Edit</button>
                        <button className="danger" onClick={() => setConfirmId(item.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {editing && (
        <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Edit media" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="adm-modal-card" onSubmit={saveEdit}>
            <div className="adm-modal-media"><Preview item={editing} controls /></div>
            <fieldset className="adm-seg">
              <legend>Show in</legend>
              {(Object.keys(sectionLabels) as Section[]).map((s) => (
                <label key={s}>
                  <input type="radio" name="edit-section" checked={editing.section === s} onChange={() => setEditing({ ...editing, section: s })} />
                  <span>{sectionLabels[s]}</span>
                </label>
              ))}
            </fieldset>
            <label>Title<input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} maxLength={120} required /></label>
            <label>Place<input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} maxLength={80} /></label>
            <label>Description<textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} maxLength={600} /></label>
            <div className="adm-modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-teal">Save changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
