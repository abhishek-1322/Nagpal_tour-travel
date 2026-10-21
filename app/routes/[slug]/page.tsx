import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Icon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { commonFaq, routes, site, waLink } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = routes.find((x) => x.slug === slug);
  if (!r) return {};
  return {
    title: `Ludhiana to ${r.to} Taxi | Sedan, SUV & Innova | Nagpal Tour & Travels`,
    description: `Book a Ludhiana to ${r.to} taxi, one way or round trip. About ${r.km} km, ${r.time} via ${r.via}. Sedan, SUV and Innova with experienced drivers, 24/7.`,
    alternates: { canonical: `/routes/${r.slug}` },
    openGraph: { images: [{ url: r.img.src }] },
  };
}

export default async function RoutePage({ params }: Props) {
  const { slug } = await params;
  const r = routes.find((x) => x.slug === slug);
  if (!r) notFound();
  const faq = [...commonFaq(r), ...r.faq];
  const others = routes.filter((x) => x.slug !== r.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Header />
      <main>
        <PageHero img={r.img} alt={`${r.to}, ${r.state}`} kicker={r.tag} title={`Ludhiana to ${r.to} taxi`} lead={r.intro}>
          <div className="route-facts">
            <div><Icon name="car" /><span><b>~{r.km} km</b>Distance</span></div>
            <div><Icon name="clock" /><span><b>{r.time}</b>Drive time</span></div>
            <div><Icon name="pin" /><span><b>{r.state}</b>Destination</span></div>
          </div>
        </PageHero>

        <section className="section">
          <div className="wrap route-layout">
            <div className="route-main">
              <div className="route-block">
                <span className="kicker">Places to visit</span>
                <h2>Things to see in {r.to}</h2>
                <ul className="tick-list">
                  {r.highlights.map((h) => (
                    <li key={h}><Icon name="check" /> {h}</li>
                  ))}
                </ul>
              </div>
              <div className="route-grid">
                <div className="why-item"><span className="ic"><Icon name="mountain" /></span><h3>The route</h3><p>Via {r.via}. {r.stop}</p></div>
                <div className="why-item"><span className="ic"><Icon name="calendar" /></span><h3>Best time to go</h3><p>{r.bestTime}</p></div>
                <div className="why-item"><span className="ic"><Icon name="car" /></span><h3>Which car to choose</h3><p>{r.car} <a href="/#fleet">See our fleet</a>.</p></div>
                <div className="why-item"><span className="ic"><Icon name="rupee" /></span><h3>Your fare</h3><p>We quote a clear total for your dates and car, including what&apos;s covered, before you book.</p></div>
              </div>
              <div className="route-block">
                <span className="kicker">FAQ</span>
                <h2>Common questions</h2>
                <div className="faq">
                  {faq.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
            <aside className="route-aside">
              <BookingForm initialTo={r.to} />
              <a className="btn btn-wa route-wa" href={waLink(`Hello! I want a taxi from Ludhiana to ${r.to}.`)} target="_blank" rel="noopener">
                <Icon name="wa" /> Quick WhatsApp: {site.phoneDisplay}
              </a>
            </aside>
          </div>
        </section>

        <section className="section soft">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">More routes</span>
                <h2>Other popular trips</h2>
              </div>
              <a className="link-arrow" href="/routes">All routes <Icon name="arrow" /></a>
            </div>
            <div className="dest dest-row">
              {others.map((o) => (
                <a className="dest-card" href={`/routes/${o.slug}`} key={o.slug}>
                  <Image src={o.img} alt={`${o.to}, ${o.state}`} placeholder="blur" sizes="(max-width: 560px) 100vw, 400px" />
                  <span className="dest-km">~{o.km} km · {o.time}</span>
                  <small>{o.state}</small>
                  <h3>{o.to}</h3>
                  <span className="dest-go">View route guide <Icon name="arrow" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
