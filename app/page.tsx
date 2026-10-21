import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import Gallery from "@/components/Gallery";
import CopyButton from "@/components/CopyButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TourCard from "@/components/TourCard";
import { Icon } from "@/components/Icons";
import { listMedia } from "@/lib/media";
import { fleet, reasons, routes, services, site, waLink } from "@/lib/site";
import hero from "@/public/images/hero.jpg";
import ctaImg from "@/public/images/outstation.jpg";
import whyImg from "@/public/images/cta.jpg";

const steps = [
  { title: "Share your trip", text: "Fill the booking form or send your route, date and group size on WhatsApp." },
  { title: "Get your fare", text: "We reply with the vehicle, the total fare and exactly what's included." },
  { title: "Enjoy the ride", text: "Driver details reach you before pickup. Pay by cash or UPI." },
];

// Rebuilt hourly, and immediately whenever the admin uploads, edits or deletes media.
export const revalidate = 3600;

export default async function Home() {
  const media = await listMedia();
  const tours = media.filter((m) => m.section === "tours");
  const gallery = media.filter((m) => m.section === "gallery");

  return (
    <>
      <Header />
      <main id="home">
        <section className="hero">
          <div className="hero-bg">
            <Image src={hero} alt="Snow-capped peaks above Solang Valley near Manali" priority placeholder="blur" sizes="100vw" />
          </div>
          <div className="wrap">
            <div>
              <span className="hero-badge"><i>24/7</i> Taxi service from Ludhiana across India</span>
              <h1>
                Every journey deserves a <span className="hl">better ride.</span>
              </h1>
              <p className="hero-lead">
                Mountains, pilgrimages, airports or a family holiday. Travel in a clean Sedan, SUV or Innova with a driver who knows the road.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#book">
                  Get a free quote <Icon name="arrow" />
                </a>
                <a className="btn btn-glass" href={`tel:${site.phoneE164}`}>
                  <Icon name="phone" /> {site.phoneDisplay}
                </a>
              </div>
              <div className="hero-trust">
                <div><span className="ic"><Icon name="clock" /></span><p><b>24/7</b><span>Booking support</span></p></div>
                <div><span className="ic"><Icon name="globe" /></span><p><b>PAN India</b><span>Outstation trips</span></p></div>
                <div><span className="ic"><Icon name="rupee" /></span><p><b>No hidden</b><span>charges</span></p></div>
              </div>
            </div>
            <BookingForm />
          </div>
        </section>

        <section className="strip" aria-label="Highlights">
          <div className="wrap">
            <div className="cell"><span className="ic"><Icon name="car" /></span><p><b>Sedan · SUV · Innova</b><span>Pick the right car</span></p></div>
            <div className="cell"><span className="ic"><Icon name="user" /></span><p><b>Expert drivers</b><span>Highway &amp; hill trained</span></p></div>
            <div className="cell"><span className="ic"><Icon name="plane" /></span><p><b>Airport transfers</b><span>Day or night</span></p></div>
            <div className="cell"><span className="ic"><Icon name="wa" /></span><p><b>WhatsApp booking</b><span>Quick, easy replies</span></p></div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">Our services</span>
                <h2>One call for every kind of trip</h2>
              </div>
              <p>From a quick ride across Ludhiana to a week in the hills, tell us the plan and we&apos;ll match the car and the driver.</p>
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
                    <a className="link-arrow" href="#book" data-trip={s.trip}>
                      {s.cta} <Icon name="arrow" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section soft" id="fleet">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">Our fleet</span>
                <h2>Choose the car that fits your group</h2>
              </div>
              <p>Every vehicle is air-conditioned, cleaned before each trip and driven by an experienced driver.</p>
            </div>
            <div className="fleet">
              {fleet.map((c) => (
                <article className="car" key={c.name}>
                  <div className="car-img">
                    <Image src={c.img} alt={c.model} placeholder="blur" sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 400px" />
                    <span className="car-tag">{c.tag}</span>
                  </div>
                  <div className="car-body">
                    <h3>{c.name}</h3>
                    <p className="car-model">{c.model}</p>
                    <p>{c.text}</p>
                    <div className="chips">
                      <span className="chip"><Icon name="seat" /> {c.seats} seats</span>
                      <span className="chip"><Icon name="bag" /> {c.bags} bags</span>
                      <span className="chip"><Icon name="snow" /> AC</span>
                    </div>
                    <a className="btn btn-teal" href="#book" data-car={c.name}>
                      {c.cta} <Icon name="arrow" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="fleet-help">
              <div>
                <h3>Not sure which car to pick?</h3>
                <p>Tell us how many people and bags. We&apos;ll suggest the right vehicle.</p>
              </div>
              <a className="btn btn-primary" href={waLink("Hello! Please help me choose a car for my trip.")} target="_blank" rel="noopener">
                <Icon name="wa" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="destinations">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">Popular destinations</span>
                <h2>Where our travellers go from Ludhiana</h2>
              </div>
              <p>Our most-booked routes. We also drive anywhere else in India, so just ask.</p>
            </div>
            <div className="dest">
              {routes.map((r, i) => (
                <a className="dest-card" href={`/routes/${r.slug}`} key={r.to}>
                  <Image src={r.img} alt={`${r.to}, ${r.state}`} placeholder="blur" sizes={i === 0 || i === 5 ? "(max-width: 560px) 100vw, 600px" : "(max-width: 560px) 100vw, 400px"} />
                  <span className="dest-tag">{r.tag}</span>
                  <span className="dest-km">~{r.km} km · {r.time}</span>
                  <small>{r.state}</small>
                  <h3>{r.to}</h3>
                  <p>{r.blurb}</p>
                  <span className="dest-go">View route guide <Icon name="arrow" /></span>
                </a>
              ))}
            </div>
            <p className="dest-note">Distances and drive times from Ludhiana are approximate and depend on traffic, weather and stops.</p>
          </div>
        </section>

        {tours.length > 0 && (
          <section className="section soft" id="tours">
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <span className="kicker">Our tours</span>
                  <h2>Tour packages we run</h2>
                </div>
                <div className="sec-side">
                  <p>Ready-made trips with a car and driver. Every plan can be changed to suit your dates and group.</p>
                  <a className="link-arrow" href="/gallery#tours">View all tours <Icon name="arrow" /></a>
                </div>
              </div>
              <div className="tours">
                {tours.slice(0, 6).map((t) => (
                  <TourCard tour={t} key={t.id} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section soft" id="why">
          <div className="wrap why">
            <div className="why-media">
              <div className="main">
                <Image src={whyImg} alt="Green Himalayan valley on a road trip" placeholder="blur" sizes="(max-width: 980px) 100vw, 520px" />
              </div>
              <div className="why-float">
                <span className="ic"><Icon name="shield" /></span>
                <p><b>Safe &amp; on time</b><span>Every trip, every time</span></p>
              </div>
            </div>
            <div>
              <span className="kicker">Why Nagpal</span>
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <h2>Your trusted travel partner, any hour of the day</h2>
              </div>
              <div className="why-grid">
                {reasons.map((r) => (
                  <div className="why-item" key={r.title}>
                    <span className="ic"><Icon name={r.icon} /></span>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="section" id="gallery">
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <span className="kicker">Gallery</span>
                  <h2>Moments from the road</h2>
                </div>
                <div className="sec-side">
                  <p>Photos and videos from trips with our travellers. Tap any picture to see it full size.</p>
                  <a className="link-arrow" href="/gallery#photos">View full gallery <Icon name="arrow" /></a>
                </div>
              </div>
              <Gallery items={gallery.slice(0, 9)} />
            </div>
          </section>
        )}

        <section className="section">
          <div className="wrap">
            <div className="sec-head center">
              <span className="kicker">How it works</span>
              <h2>Booked in three simple steps</h2>
            </div>
            <div className="steps">
              {steps.map((s, i) => (
                <div className="step" key={s.title}>
                  <span className="step-n">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap" aria-label="Book now">
          <div className="cta">
            <Image src={ctaImg} alt="" placeholder="blur" sizes="(max-width: 1200px) 100vw, 1200px" />
            <div>
              <h2>Ready for your next journey?</h2>
              <p>Call or WhatsApp us any time. We&apos;ll plan the route, pick the car and send your fare in minutes.</p>
            </div>
            <div className="cta-actions">
              <a className="btn btn-primary" href={waLink("Hello! I want to book a taxi.")} target="_blank" rel="noopener">
                <Icon name="wa" /> WhatsApp us
              </a>
              <a className="btn btn-glass" href={`tel:${site.phoneE164}`}>
                <Icon name="phone" /> Call now
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="wrap contact">
            <div className="contact-card">
              <span className="kicker">Get in touch</span>
              <h2>Talk to us directly</h2>
              <p>Questions about a route or a special trip? We&apos;re available 24/7.</p>
              <ul className="c-list">
                <li>
                  <span className="ic"><Icon name="phone" /></span>
                  <div><small>Phone</small><a className="v" href={`tel:${site.phoneE164}`}><b>{site.phoneDisplay}</b></a></div>
                  <CopyButton text={site.phoneE164} />
                </li>
                <li>
                  <span className="ic"><Icon name="wa" /></span>
                  <div><small>WhatsApp</small><b>{site.phoneDisplay}</b></div>
                  <a className="copy" href={waLink()} target="_blank" rel="noopener">Chat</a>
                </li>
                <li>
                  <span className="ic"><Icon name="pin" /></span>
                  <div><small>Office</small><b>{site.address}</b></div>
                  <CopyButton text={site.address} />
                </li>
              </ul>
            </div>
            <div className="pay-card">
              <span className="kicker">Pay online</span>
              <h3>Pay your fare by UPI</h3>
              <p>Scan our QR code from Google Pay, PhonePe, Paytm or any UPI app once your trip is confirmed.</p>
              <a className="btn btn-primary" href={site.payOnline} target="_blank" rel="noopener">
                Open payment QR <Icon name="arrow" />
              </a>
              <div className="socials">
                <a href={site.instagram} target="_blank" rel="noopener">Instagram</a>
                <a href={site.facebook} target="_blank" rel="noopener">Facebook</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <a className="fab" href={waLink("Hello! I want to book a taxi.")} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <Icon name="wa" />
      </a>
    </>
  );
}
