import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Icon } from "@/components/Icons";
import { site, waLink } from "@/lib/site";
import qr from "@/public/images/upi-qr.webp";

export const metadata: Metadata = {
  title: "Pay Online by UPI | Nagpal Tour & Travels",
  description: "Pay your Nagpal Tour & Travels taxi fare by UPI. Scan our QR code with Google Pay, PhonePe, Paytm or any UPI app.",
  alternates: { canonical: "/pay" },
};

const steps = [
  { title: "Confirm your fare", text: "Get your final fare from us on WhatsApp or phone before paying." },
  { title: "Scan and pay", text: "Open Google Pay, PhonePe, Paytm or any UPI app and scan the QR code." },
  { title: "Send the screenshot", text: "Share the payment screenshot with us on WhatsApp so we can confirm your booking." },
];

export default function PayPage() {
  return (
    <>
      <Header alwaysSolid />
      <main className="inner">
        <section className="section">
          <div className="wrap pay-layout">
            <div>
              <span className="kicker">Pay online</span>
              <h1 className="page-title">Pay your fare by UPI</h1>
              <p className="page-lead">Scan the QR code with any UPI app. Pay only after we have confirmed your fare and booking details.</p>
              <ol className="pay-steps">
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <span className="step-n">{i + 1}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="hero-actions">
                <a className="btn btn-wa" href={waLink("Hello! I have paid my fare by UPI. Sending the payment screenshot.")} target="_blank" rel="noopener">
                  <Icon name="wa" /> Send payment screenshot
                </a>
                <a className="btn btn-outline" href={`tel:${site.phoneE164}`}>
                  <Icon name="phone" /> {site.phoneDisplay}
                </a>
              </div>
              <p className="pay-note">
                <Icon name="shield" />
                <span>Prefer cash? You can also pay the driver directly. Refunds, if any, follow our <a href="/terms#refund">refund policy</a>.</span>
              </p>
            </div>
            <div className="qr-card">
              <Image src={qr} alt="UPI QR code for Nagpal Tour & Travels" sizes="(max-width: 900px) 90vw, 420px" priority />
              <p>Works with Google Pay, PhonePe, Paytm, BHIM and all UPI apps</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
