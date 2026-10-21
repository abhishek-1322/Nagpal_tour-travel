import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import { Icon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import TourCard from "@/components/TourCard";
import { listMedia } from "@/lib/media";
import { waLink } from "@/lib/site";
import heroImg from "@/public/images/family.jpg";

export const metadata: Metadata = {
  title: "Tours & Gallery | Nagpal Tour & Travels",
  description: "Tour packages and photos from trips with Nagpal Tour & Travels, Ludhiana. Hill tours, pilgrimages and family holidays across India.",
  alternates: { canonical: "/gallery" },
};

// Rebuilt hourly, and immediately whenever the admin uploads, edits or deletes media.
export const revalidate = 3600;

export default async function GalleryPage() {
  const media = await listMedia();
  const tours = media.filter((m) => m.section === "tours");
  const photos = media.filter((m) => m.section === "gallery");

  return (
    <>
      <Header />
      <main>
        <PageHero img={heroImg} kicker="Tours & Gallery" title="Our tours and travel moments" lead="Browse our tour packages and photos and videos from trips with our travellers.">
          <nav className="jump" aria-label="Sections">
            <a href="#tours"><Icon name="mountain" /> Tours <span>{tours.length}</span></a>
            <a href="#photos"><Icon name="star" /> Photos &amp; videos <span>{photos.length}</span></a>
          </nav>
        </PageHero>

        <section className="section" id="tours">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">Our tours</span>
                <h2>Tour packages</h2>
              </div>
              <p>Every tour includes a car and an experienced driver, and can be changed to suit your dates and group.</p>
            </div>
            {tours.length ? (
              <div className="tours">
                {tours.map((t) => (
                  <TourCard tour={t} key={t.id} enquire="whatsapp" />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="mountain" />
                <h3>New tour packages are coming soon</h3>
                <p>Tell us where you want to go and we&apos;ll plan a custom tour for you.</p>
                <a className="btn btn-primary" href={waLink("Hello! I'd like to plan a tour.")} target="_blank" rel="noopener"><Icon name="wa" /> Plan a tour on WhatsApp</a>
              </div>
            )}
          </div>
        </section>

        <section className="section soft" id="photos">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="kicker">Gallery</span>
                <h2>Moments from the road</h2>
              </div>
              <p>Photos and videos from trips with our travellers. Tap any picture to see it full size.</p>
            </div>
            {photos.length ? (
              <Gallery items={photos} />
            ) : (
              <div className="empty-state">
                <Icon name="star" />
                <h3>Photos from our trips will appear here soon</h3>
                <p>Travelled with us? Share your trip photos with us on WhatsApp.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
