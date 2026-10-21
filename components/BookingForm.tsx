"use client";

import { useEffect, useRef, useState } from "react";
import { site, tripTypes, vehicles, waLink } from "@/lib/site";
import { copyText } from "./CopyButton";
import { Icon } from "./Icons";

type Field = "from" | "to" | "date";
const fieldLabels: Record<Field, string> = { from: "pickup", to: "destination", date: "travel date" };

function isoDate(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function BookingForm({ initialTo = "" }: { initialTo?: string }) {
  const [trip, setTrip] = useState<string>(tripTypes[0].value);
  const [from, setFrom] = useState("Ludhiana");
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [car, setCar] = useState("Sedan");
  const [pax, setPax] = useState("1–2");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [bad, setBad] = useState<Field[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok?: boolean }>({ text: "" });
  const [copied, setCopied] = useState(false);
  const refs = { from: useRef<HTMLInputElement>(null), to: useRef<HTMLInputElement>(null), date: useRef<HTMLInputElement>(null) };

  // Dates are set on the client so server and browser render the same HTML.
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setMinDate(isoDate(today));
    setDate(isoDate(tomorrow));
  }, []);

  // Service, fleet and destination cards prefill the form through data attributes.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-trip],[data-car],[data-to]");
      if (!a) return;
      const { trip: t, car: c, to: dest } = a.dataset;
      if (t) setTrip(t);
      if (c) setCar(c);
      if (dest) {
        setTo(dest);
        setBad((b) => b.filter((f) => f !== "to"));
      }
      setTimeout(() => (dest ? refs.date : refs.to).current?.focus({ preventScroll: true }), 600);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const message = [
    "Hello Nagpal Tour & Travels! I'd like a taxi quote.",
    `Trip: ${trip}`,
    `From: ${from.trim()}`,
    `To: ${to.trim()}`,
    `Date: ${date}`,
    `Vehicle: ${car}`,
    `Passengers: ${pax}`,
    name.trim() && `Name: ${name.trim()}`,
    notes.trim() && `Notes: ${notes.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  function validate() {
    const values: Record<Field, string> = { from, to, date };
    const missing = (Object.keys(values) as Field[]).filter((f) => !values[f].trim());
    setBad(missing);
    if (missing.length) {
      setMsg({ text: `Add your ${missing.map((f) => fieldLabels[f]).join(", ")} so we can quote the trip.` });
      refs[missing[0]].current?.focus();
    }
    return missing.length === 0;
  }

  function edit<T>(set: (v: T) => void, field?: Field) {
    return (v: T) => {
      set(v);
      setMsg({ text: "" });
      if (field) setBad((b) => b.filter((f) => f !== field));
    };
  }

  const cls = (f: Field, extra = "") => `field${extra}${bad.includes(f) ? " bad" : ""}`;

  return (
    <form className="book" id="book" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="book-title">
        <h2>Book your ride</h2>
        <span>Reply in minutes</span>
      </div>
      <p className="book-sub">Share your trip and get a personal fare on WhatsApp.</p>

      <div className="tabs" role="radiogroup" aria-label="Trip type">
        {tripTypes.map((t) => (
          <label key={t.id}>
            <input type="radio" name="trip" id={t.id} value={t.value} checked={trip === t.value} onChange={() => edit(setTrip)(t.value)} />
            <span>{t.label}</span>
          </label>
        ))}
      </div>

      <div className="fields">
        <div className={cls("from")}>
          <Icon name="pin" className="ic" />
          <label htmlFor="from">Pickup</label>
          <input id="from" ref={refs.from} placeholder="Pickup city" autoComplete="address-level2" value={from} onChange={(e) => edit(setFrom, "from")(e.target.value)} />
        </div>
        <div className={cls("to")}>
          <Icon name="mountain" className="ic" />
          <label htmlFor="to">Destination</label>
          <input id="to" ref={refs.to} placeholder="Where to?" value={to} onChange={(e) => edit(setTo, "to")(e.target.value)} />
        </div>
        <div className={cls("date")}>
          <Icon name="calendar" className="ic" />
          <label htmlFor="date">Travel date</label>
          <input id="date" ref={refs.date} type="date" min={minDate} value={date} onChange={(e) => edit(setDate, "date")(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="car" className="ic" />
          <label htmlFor="car">Vehicle</label>
          <select id="car" value={car} onChange={(e) => edit(setCar)(e.target.value)}>
            {vehicles.map((v) => (
              <option key={v}>{v}</option>
            ))}
            <option>Not sure, suggest one</option>
          </select>
        </div>
        <div className="field">
          <Icon name="family" className="ic" />
          <label htmlFor="pax">Passengers</label>
          <select id="pax" value={pax} onChange={(e) => edit(setPax)(e.target.value)}>
            {["1–2", "3–4", "5–6", "7+"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <Icon name="user" className="ic" />
          <label htmlFor="name">Your name</label>
          <input id="name" placeholder="Full name" autoComplete="name" value={name} onChange={(e) => edit(setName)(e.target.value)} />
        </div>
        <div className="field full">
          <Icon name="clock" className="ic" />
          <label htmlFor="notes">Pickup time &amp; notes (optional)</label>
          <input id="notes" placeholder="e.g. 6 AM, flight AI 812, two extra stops" value={notes} onChange={(e) => edit(setNotes)(e.target.value)} />
        </div>
      </div>

      <div className="book-actions">
        <a
          className="btn btn-primary"
          href={waLink(message)}
          target="_blank"
          rel="noopener"
          onClick={(e) => {
            if (!validate()) e.preventDefault();
          }}
        >
          <Icon name="wa" /> Get quote on WhatsApp
        </a>
        <button
          type="button"
          className="btn btn-outline"
          onClick={async () => {
            if (!validate()) return;
            await copyText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
            setMsg({ text: `Trip details copied. Paste them into WhatsApp or SMS to ${site.phoneDisplay}.`, ok: true });
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className={`msg${msg.ok ? " ok" : ""}`} role="status">
        {msg.text}
      </p>
      <p className="book-note">
        <Icon name="shield" /> No advance payment to enquire. Fare, tolls and inclusions are confirmed before you book.
      </p>
    </form>
  );
}
