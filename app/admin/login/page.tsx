"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setBusy(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || "Could not sign in.");
    }
  }

  return (
    <main className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <Logo id="lm-login" />
        <h1>Admin sign in</h1>
        <p>Manage the photos and videos on your website.</p>
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="adm-error" role="alert">{error}</p>}
        <button className="btn btn-teal" disabled={busy || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="adm-back">← Back to website</a>
      </form>
    </main>
  );
}
