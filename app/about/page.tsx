import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Icon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { fleet, reasons, services, site, waLink } from "@/lib/site";
import heroImg from "@/public/images/outstation.jpg";
import storyImg from "@/public/images/innova.jpg";

export const metadata: Metadata = {
  title: "About Us | Nagpal Tour & Travels, Ludhiana",
  description: "Nagpal Tour & Travels is a Ludhiana-based taxi and tour operator offering outstation, local and airport cabs across PAN India.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero img={heroImg} kicker="About us" title="Your trusted travel partner from Ludhiana" lead="Comfortable cars, experienced drivers and honest pricing for every journey across India." />

        <section className="section">
          <div className="wrap why">
            <div className="why-media">
              <div className="main">
                <Image src={storyImg} alt="Toyota Innova Crysta" placeholder="blur" sizes="(max-width: 980px) 100vw, 520px" />
              </div>
            </div>
            <div className="prose about-story">
              <span className="kicker">Who we are</span>
              <h2 className="page-title">Welcome to Nagpal Tour &amp; Travels</h2>
              <p>We are a Ludhiana-based taxi and tour company, and your partner for both local and long-distance journeys. From a quick ride across the city to a week in the mountains, we take care of the car, the driver and the route so you can enjoy the trip.</p>
              <p>We run outstation one way and round trips across PAN India, 24-hour airport transfers, family holidays, pilgrimages and local bookings. Our fleet of Sedans, SUVs and Innovas covers every group size, from couples to large families.</p>
              <p>Our promise is simple: pick you up on time, drive you safely and charge exactly what we quoted, with no hidden charges.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="/#book">Book your ride <Icon name="arrow" /></a>
                <a className="btn btn-outline" href={`tel:${site.phoneE164}`}><Icon name="phone" /> {site.phoneDisplay}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section soft">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">What we do</span>
                <h2>Services for every kind of trip</h2>
              </div>
            </div>
            <div className="services">
              {services.map((s) => (
                <article className="svc" key={s.title}>
                  <div className="svc-img">
                    <Image src={s.img} alt="" placeholder="blur" sizes="(max-width: 560px) 100vw, (max-width: 1060px) 50vw, 300px" />
                    <span className="svc-ic"><Icon name={s.icon} /></span>
                  </div>
                  <div className="svc-body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">Why travel with us</span>
                <h2>What you can expect</h2>
              </div>
              <p>Our fleet: {fleet.map((f) => f.name).join(", ")}. Every car is air-conditioned and cleaned before each trip.</p>
            </div>
            <div className="why-grid three">
              {reasons.map((r) => (
                <div className="why-item" key={r.title}>
                  <span className="ic"><Icon name={r.icon} /></span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap" aria-label="Book now">
          <div className="cta">
            <Image src={heroImg} alt="" placeholder="blur" sizes="(max-width: 1200px) 100vw, 1200px" />
            <div>
              <h2>Planning a trip?</h2>
              <p>Tell us where you want to go. We&apos;ll suggest the right car and send your fare in minutes.</p>
            </div>
            <div className="cta-actions">
              <a className="btn btn-primary" href={waLink("Hello! I want to book a taxi.")} target="_blank" rel="noopener"><Icon name="wa" /> WhatsApp us</a>
              <a className="btn btn-glass" href="/contact">Contact page</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
