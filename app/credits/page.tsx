import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import credits from "@/lib/credits.json";

export const metadata: Metadata = { title: "Photo credits | Nagpal Tour & Travels" };

export default function Credits() {
  return (
    <>
      <Header alwaysSolid />
      <main className="wrap credits">
        <h1>Photo credits</h1>
        <p>Photos on this site come from Wikimedia Commons and are used under their Creative Commons licences.</p>
        <ul>
          {credits.map((c) => (
            <li key={c.file}>
              <a href={c.source} target="_blank" rel="noopener">{c.title}</a> by {c.artist}, {c.license}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
