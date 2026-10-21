"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import { Icon } from "./Icons";

type Field = "name" | "message";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [bad, setBad] = useState<Field[]>([]);
  const [msg, setMsg] = useState("");

  const text = [`Hello Nagpal Tour & Travels! My name is ${name.trim()}.`, phone.trim() ? `Phone: ${phone.trim()}` : null, "", message.trim()].filter((l) => l !== null).join("\n");

  function validate() {
    const missing = ([["name", name], ["message", message]] as [Field, string][]).filter(([, v]) => !v.trim()).map(([f]) => f);
    setBad(missing);
    setMsg(missing.length ? `Add your ${missing.join(" and ")} so we can reply.` : "");
    return missing.length === 0;
  }

  const cls = (f: Field) => `field${bad.includes(f) ? " bad" : ""}`;

  return (
    <form className="book contact-form" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="book-title">
        <h2>Send us a message</h2>
        <span>Reply on WhatsApp</span>
      </div>
      <p className="book-sub">Ask about a route, a tour or a special trip. Your message opens in WhatsApp, ready to send.</p>
      <div className="fields">
        <div className={cls("name")}>
          <Icon name="user" className="ic" />
          <label htmlFor="c-name">Your name</label>
          <input id="c-name" autoComplete="name" placeholder="Full name" value={name} onChange={(e) => { setName(e.target.value); setBad((b) => b.filter((f) => f !== "name")); }} />
        </div>
        <div className="field">
          <Icon name="phone" className="ic" />
          <label htmlFor="c-phone">Phone (optional)</label>
          <input id="c-phone" type="tel" autoComplete="tel" placeholder="+91" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className={`${cls("message")} full field-area`}>
          <label htmlFor="c-msg">Your message</label>
          <textarea id="c-msg" rows={5} placeholder="e.g. We are 6 people planning Manali for 4 days in December. Which car do you suggest?" value={message} onChange={(e) => { setMessage(e.target.value); setBad((b) => b.filter((f) => f !== "message")); }} />
        </div>
      </div>
      <div className="book-actions single">
        <a className="btn btn-primary" href={waLink(text)} target="_blank" rel="noopener" onClick={(e) => { if (!validate()) e.preventDefault(); }}>
          <Icon name="wa" /> Send on WhatsApp
        </a>
      </div>
      <p className="msg" role="status">{msg}</p>
    </form>
  );
}
