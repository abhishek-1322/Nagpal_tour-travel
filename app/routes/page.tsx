import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Icon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { routes } from "@/lib/site";
import heroImg from "@/public/images/cta.jpg";

export const metadata: Metadata = {
  title: "Taxi Routes from Ludhiana | Nagpal Tour & Travels",
  description: "Outstation taxi routes from Ludhiana to Amritsar, Manali, Delhi, Chandigarh, Haridwar and Rishikesh. Distances, travel times and travel tips.",
  alternates: { canonical: "/routes" },
};

export default function RoutesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero img={heroImg} kicker="Routes" title="Taxi routes from Ludhiana" lead="Distances, drive times and travel tips for our most popular trips. We also drive anywhere else in India." />
        <section className="section">
          <div className="wrap">
            <div className="dest">
              {routes.map((r, i) => (
                <a className="dest-card" href={`/routes/${r.slug}`} key={r.slug}>
                  <Image src={r.img} alt={`${r.to}, ${r.state}`} placeholder="blur" sizes={i === 0 || i === 5 ? "(max-width: 560px) 100vw, 600px" : "(max-width: 560px) 100vw, 400px"} />
                  <span className="dest-tag">{r.tag}</span>
                  <span className="dest-km">~{r.km} km · {r.time}</span>
                  <small>{r.state}</small>
                  <h3>Ludhiana to {r.to}</h3>
                  <p>{r.blurb}</p>
                  <span className="dest-go">View route guide <Icon name="arrow" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
