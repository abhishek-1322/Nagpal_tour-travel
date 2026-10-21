import { routes, site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <div className="footer-about">
          <Logo id="lm-foot" light />
          <p>Ludhiana-based taxi service for outstation trips, family tours, local rides and airport transfers across PAN India.</p>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About us</a></li>
            <li><a href="/#services">Services</a></li>
            <li><a href="/#fleet">Our fleet</a></li>
            <li><a href="/gallery">Tours &amp; gallery</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/pay">Pay online</a></li>
          </ul>
        </div>
        <div>
          <h4>Popular routes</h4>
          <ul>
            {routes.slice(0, 5).map((r) => (
              <li key={r.slug}>
                <a href={`/routes/${r.slug}`}>Ludhiana to {r.to}</a>
              </li>
            ))}
            <li><a href="/routes">All routes →</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a></li>
            <li><a href={site.mapsUrl} target="_blank" rel="noopener">{site.address}</a></li>
            <li><a href={site.instagram} target="_blank" rel="noopener">Instagram</a> · <a href={site.facebook} target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Nagpal Tour &amp; Travels, Ludhiana. All rights reserved.</span>
        <span>
          <a href="/terms">Terms &amp; conditions</a> · <a href="/credits">Photo credits</a>
        </span>
      </div>
    </footer>
  );
}
