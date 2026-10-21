
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    console.log("Login form submitted.");
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      // Read the response safely, even if the server returns non-JSON.
      const text = await res.text();
      let data: { error?: string } = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Login API returned non-JSON:", text);
      }

      console.log("Login API status:", res.status);
      console.log("Login API response:", data);

      if (!res.ok) {
        setError(
          data.error ||
            `Login failed (${res.status}). Check the server logs.`
        );
        return;
      }

      // The API must set the authentication cookie before returning success.
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login request failed:", err);
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <Logo id="lm-login" />

        <h1>Admin sign in</h1>
        <p>Manage the photos and videos on your website.</p>

        <label htmlFor="pw">Password</label>

        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={busy}
        />

        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-teal"
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <a href="/" className="adm-back">
          ← Back to website
        </a>
      </form>
    </main>
  );
}
