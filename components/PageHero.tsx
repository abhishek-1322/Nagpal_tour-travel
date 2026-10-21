import Image, { type StaticImageData } from "next/image";

export default function PageHero({ img, alt = "", kicker, title, lead, children }: { img: StaticImageData; alt?: string; kicker: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="hero-bg">
        <Image src={img} alt={alt} priority placeholder="blur" sizes="100vw" />
      </div>
      <div className="wrap">
        <span className="hero-badge"><i>{kicker}</i> Nagpal Tour &amp; Travels</span>
        <h1>{title}</h1>
        {lead && <p className="hero-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
