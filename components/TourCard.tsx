import type { MediaItem } from "@/lib/media";
import { waLink } from "@/lib/site";
import { Icon } from "./Icons";

// "form" prefills the booking form on the same page; "whatsapp" opens a ready-made enquiry.
export default function TourCard({ tour, enquire = "form" }: { tour: MediaItem; enquire?: "form" | "whatsapp" }) {
  return (
    <article className="tour">
      <div className="tour-media">
        {tour.kind === "video" ? (
          <video src={`${tour.url}#t=0.1`} preload="metadata" controls playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tour.url} alt={tour.title} loading="lazy" />
        )}
        {tour.location && <span className="tour-loc"><Icon name="pin" /> {tour.location}</span>}
      </div>
      <div className="tour-body">
        <h3>{tour.title}</h3>
        {tour.description && <p>{tour.description}</p>}
        {enquire === "form" ? (
          <a className="btn btn-teal" href="#book" data-to={tour.title} data-trip="Multi-day tour">
            Enquire about this tour <Icon name="arrow" />
          </a>
        ) : (
          <a className="btn btn-teal" href={waLink(`Hello! I'm interested in your tour: ${tour.title}. Please share the details.`)} target="_blank" rel="noopener">
            <Icon name="wa" /> Enquire on WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
