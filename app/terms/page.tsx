import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nagpal Tour & Travels",
  description: "Booking, payment, cancellation and refund terms for Nagpal Tour & Travels taxi services.",
  alternates: { canonical: "/terms" },
};

const terms: { id: string; title: string; body: React.ReactNode }[] = [
  { id: "booking", title: "Booking & payments", body: <p>Bookings can be made through our website, WhatsApp or phone. You can pay by UPI, card, net banking or cash as agreed. You may book on behalf of someone else, but we need the details of both the person booking and the traveller.</p> },
  { id: "charges", title: "Discounts & additional charges", body: <><p>Discounts apply only to the base fare. Tolls, parking, state taxes and night charges are charged separately unless your quote says otherwise.</p><p>Extra kilometres or hours beyond your booking are billed separately. Unscheduled changes to the itinerary may cost extra.</p></> },
  { id: "distance", title: "Distances", body: <p>All distances shown on the website are approximate. Actual distances can vary with the route taken.</p> },
  { id: "calendar-day", title: "Calendar-day bookings", body: <p>A day booking runs from 12:00 AM to 11:59 PM on the same date. For example, a booking that starts on 1 January at 5 PM ends at 11:59 PM on 1 January.</p> },
  { id: "one-way", title: "One-way trips & usage", body: <><p>One-way fares cover a single pickup and drop point unless agreed otherwise. If the trip needs extra time or distance, the extra cost is payable by the customer.</p><p>Outstation bookings cannot be used for local travel.</p></> },
  { id: "vehicle", title: "Vehicle availability", body: <p>Bookings depend on vehicle availability. If the vehicle you chose isn&apos;t available, we provide a similar vehicle from the same segment at no extra cost.</p> },
  { id: "ac", title: "Air conditioning", body: <p>The AC may be switched off on steep hill roads or while the car is stationary. We ask customers not to request AC in these conditions.</p> },
  { id: "no-show", title: "No-show policy", body: <p>The driver waits up to 30 minutes after the scheduled pickup time. If we cannot reach you in that time, the booking is marked as a no-show and the amount paid is forfeited.</p> },
  { id: "cancellation", title: "Cancellation policy", body: <ul><li>Cancelled 24 hours or more before pickup: 10% of the booking amount is deducted.</li><li>Cancelled less than 24 hours before pickup: no refund.</li></ul> },
  { id: "refund", title: "Refund policy", body: <p>Refunds, where applicable, are paid to your bank account within 7 business days. We do not give cash refunds.</p> },
  { id: "booking-details", title: "Not received driver details?", body: <p>If you haven&apos;t received the driver or car details before your trip, call or WhatsApp us on {site.phoneDisplay} with your booking details.</p> },
  { id: "conduct", title: "Driver conduct", body: <p>If a driver behaves inappropriately, please report it on {site.phoneDisplay} with your booking details. We take every complaint seriously.</p> },
  { id: "delays", title: "Delays beyond our control", body: <p>We are not responsible for delays caused by traffic, weather, road closures or other circumstances outside our control.</p> },
  { id: "liability", title: "Limitation of liability", body: <p>Nagpal Tour &amp; Travels is not liable for any injury, loss or damage incurred during the use of our services.</p> },
  { id: "privacy", title: "Privacy & security", body: <><p>We only use the details you share (name, phone number and trip details) to plan and confirm your trip. We do not sell your information. Any change to this policy will be shown on this page with a new date.</p><p>For privacy questions, contact us on {site.phoneDisplay} with the subject &ldquo;Privacy Policy&rdquo;. We aim to reply within five business days.</p></> },
  { id: "ownership", title: "Website ownership", body: <p>The content, design, layout and graphics of this website are owned by or licensed to Nagpal Tour &amp; Travels. Reproduction is not allowed without permission. Some photos are used under Creative Commons licences; see <a href="/credits">photo credits</a>.</p> },
];

export default function TermsPage() {
  return (
    <>
      <Header alwaysSolid />
      <main className="inner">
        <section className="section">
          <div className="wrap">
            <span className="kicker">Legal</span>
            <h1 className="page-title">Terms &amp; conditions</h1>
            <p className="page-lead">Please read these terms before booking. By booking with Nagpal Tour &amp; Travels you agree to them. This is an electronic record under the Information Technology Act, 2000 and needs no signature.</p>
            <div className="terms">
              <nav className="toc" aria-label="On this page">
                <b>On this page</b>
                <ol>
                  {terms.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`}>{t.title}</a></li>
                  ))}
                </ol>
              </nav>
              <div className="prose">
                {terms.map((t) => (
                  <section key={t.id} id={t.id}>
                    <h2>{t.title}</h2>
                    {t.body}
                  </section>
                ))}
                <p className="prose-end">Thank you for choosing Nagpal Tour &amp; Travels. Questions? Call or WhatsApp {site.phoneDisplay}.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
