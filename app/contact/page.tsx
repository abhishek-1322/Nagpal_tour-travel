import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Icon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { site, waLink } from "@/lib/site";
import heroImg from "@/public/images/local.jpg";

export const metadata: Metadata = {
  title: "Contact Us | Nagpal Tour & Travels, Ludhiana",
  description: `Call or WhatsApp Nagpal Tour & Travels on ${site.phoneDisplay}, 24/7. Office in Ludhiana, Punjab.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero img={heroImg} kicker="24/7" title="Contact us" lead="Call, WhatsApp or send a message. We reply quickly, day or night." />
        <section className="section">
          <div className="wrap contact">
            <div className="contact-card">
              <span className="kicker">Reach us</span>
              <h2>Talk to us directly</h2>
              <p>The fastest way to book is a call or a WhatsApp message.</p>
              <ul className="c-list">
                <li>
                  <span className="ic"><Icon name="phone" /></span>
                  <div><small>Phone</small><a className="v" href={`tel:${site.phoneE164}`}><b>{site.phoneDisplay}</b></a></div>
                  <CopyButton text={site.phoneE164} />
                </li>
                <li>
                  <span className="ic"><Icon name="wa" /></span>
                  <div><small>WhatsApp</small><b>{site.phoneDisplay}</b></div>
                  <a className="copy" href={waLink("Hello! I want to book a taxi.")} target="_blank" rel="noopener">Chat</a>
                </li>
                <li>
                  <span className="ic"><Icon name="pin" /></span>
                  <div><small>Office</small><b>{site.address}</b></div>
                  <a className="copy" href={site.mapsUrl} target="_blank" rel="noopener">Map</a>
                </li>
                <li>
                  <span className="ic"><Icon name="clock" /></span>
                  <div><small>Hours</small><b>Open 24 hours, 7 days a week</b></div>
                </li>
              </ul>
              <div className="socials light">
                <a href={site.instagram} target="_blank" rel="noopener">Instagram</a>
                <a href={site.facebook} target="_blank" rel="noopener">Facebook</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
