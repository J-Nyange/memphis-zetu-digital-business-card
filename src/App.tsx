import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Globe2,
  Mail,
  Phone,
  ScanLine,
  Share2,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { QRCodeSVG } from 'qrcode.react';

type Theme = 'memphis' | 'zetu';

type DigitalCard = {
  slug: string;
  full_name: string;
  job_title: string;
  phone: string;
  whatsapp: string;
  email: string;
  memphis_website: string;
  zetu_website: string;
  default_theme: Theme;
};

const fallbackCard: DigitalCard = {
  slug: 'maurice-gimose',
  full_name: 'Maurice Gimose',
  job_title: 'Business Development Manager',
  phone: '+254 727 583260',
  whatsapp: '+254 727 583260',
  email: 'info@memphiscapital.co.ke',
  memphis_website: 'www.memphiscapital.co.ke',
  zetu_website: 'zetu.memphiscapital.co.ke',
  default_theme: 'memphis',
};

function initialTheme(fallback: Theme): Theme {
  if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('zetu')) {
    return 'zetu';
  }
  return fallback;
}

function App() {
  const [card] = useState<DigitalCard>(fallbackCard);
  const [theme, setTheme] = useState<Theme>(() => initialTheme(fallbackCard.default_theme));
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isMemphis = theme === 'memphis';
  const website = isMemphis ? card.memphis_website : card.zetu_website;
  const websiteHref = `https://${website}`;
  // Canonical public URL: set VITE_SITE_URL in production (Vercel env vars)
  // so QR codes and shared links never point at preview deployments.
  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') || window.location.origin;
  const cardUrl = isMemphis ? `${siteUrl}/card/${card.slug}` : `${siteUrl}/zetu/`;

  const initials = useMemo(
    () => card.full_name.split(' ').map((part) => part[0]).join('').slice(0, 2),
    [card.full_name],
  );

  async function copyCardLink() {
    try {
      await navigator.clipboard.writeText(cardUrl);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.full_name} | ${isMemphis ? 'Memphis Capital' : 'Zetu'}`,
          text: `Connect with ${card.full_name}`,
          url: cardUrl,
        });
      } catch {
        // Share cancelled or unavailable — stay on the card.
      }
      return;
    }

    await copyCardLink();
  }

  function downloadContact() {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.full_name}`,
      `TITLE:${card.job_title}`,
      `TEL;TYPE=CELL:${card.phone}`,
      `TEL;TYPE=WHATSAPP:${card.whatsapp}`,
      `EMAIL:${card.email}`,
      `URL:${websiteHref}`,
      'END:VCARD',
    ].join('\n');
    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'maurice-gimose.vcf';
    link.click();
    URL.revokeObjectURL(href);
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 2400);
  }

  return (
    <main className={`app-shell ${isMemphis ? 'theme-memphis' : 'theme-zetu'}`}>
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-dot" />
          <span>Digital identity</span>
        </div>
        <div className="theme-picker">
          <button
            className="theme-trigger"
            type="button"
            aria-expanded={isThemeMenuOpen}
            onClick={() => setIsThemeMenuOpen((open) => !open)}
          >
            <span className={`theme-mini-mark ${isMemphis ? 'mini-memphis' : 'mini-zetu'}`} />
            <span>{isMemphis ? 'Memphis Capital' : 'Zetu'}</span>
            <ChevronDown size={15} />
          </button>
          {isThemeMenuOpen && (
            <div className="theme-menu">
              <button type="button" onClick={() => { setTheme('memphis'); setIsThemeMenuOpen(false); }}>
                <span className="theme-menu-mark mini-memphis" />
                <span>Memphis Capital</span>
                {isMemphis && <Check size={15} />}
              </button>
              <button type="button" onClick={() => { setTheme('zetu'); setIsThemeMenuOpen(false); }}>
                <span className="theme-menu-mark mini-zetu" />
                <span>Zetu</span>
                {!isMemphis && <Check size={15} />}
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="showcase" aria-label="Digital business card">
        <article className={`business-card ${isMemphis ? 'business-card-memphis' : 'business-card-zetu'}`}>
          <div className="card-top-swoop" />
          <div className="card-top-content">
            {isMemphis ? (
              <img className="memphis-logo" src="/memphis-logo.png" alt="Memphis Capital" />
            ) : (
              <img
                className="zetu-logo"
                src="/zetu-logo.webp"
                alt="Zetu by Memphis Capital"
              />
            )}
            <span className="card-index">01 / 01</span>
          </div>

          <div className="profile-block">
            <div className="profile-orbit">
              <div className="profile-placeholder" aria-label="Temporary profile placeholder">{initials}</div>
              <span className="orbit-dot orbit-dot-one" />
              <span className="orbit-dot orbit-dot-two" />
            </div>
            <div className="identity">
              <p className="identity-kicker">Let’s connect</p>
              <h2>{card.full_name}</h2>
              <p>{card.job_title}</p>
            </div>
          </div>

          <div className="card-divider" />
          <p className="card-message">
            {isMemphis ? 'Building bridges. Creating value. Delivering impact.' : 'The right connections create extraordinary opportunities.'}
          </p>

          <div className="contact-grid">
            <a className="contact-tile tile-phone" href={`tel:${card.phone.replace(/\s/g, '')}`}>
              <span className="contact-icon"><Phone size={17} /></span>
              <span><small>Call me</small><strong>{card.phone}</strong></span>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>
            <a className="contact-tile tile-whatsapp" href={`https://wa.me/${card.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
              <span className="contact-icon"><WhatsAppIcon size={17} /></span>
              <span><small>WhatsApp</small><strong>Message me</strong></span>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>
            <a className="contact-tile tile-email" href={`mailto:${card.email}`}>
              <span className="contact-icon"><Mail size={17} /></span>
              <span><small>Email</small><strong>{card.email}</strong></span>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>
            <a className="contact-tile tile-website" href={websiteHref} target="_blank" rel="noreferrer">
              <span className="contact-icon"><Globe2 size={17} /></span>
              <span><small>Visit website</small><strong>{website}</strong></span>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>
          </div>

          <div className="qr-panel">
            <div className="qr-copy">
              <div className="qr-label"><ScanLine size={15} /> Digital card</div>
              <h3>Scan to view<br /><em>my digital card</em></h3>
              <p>Keep my details close. Share our next conversation.</p>
            </div>
            <div className="qr-frame">
              <QRCodeSVG value={cardUrl} size={70} marginSize={1} level="M" title={`QR code for ${card.full_name}'s digital card`} />
            </div>
          </div>

          <div className="card-bottom">
            <span>{isMemphis ? 'STRATEGIC FINANCE. LASTING IMPACT.' : 'BY MEMPHIS CAPITAL'}</span>
            <span className="bottom-mark">{isMemphis ? 'MC' : 'Z'}</span>
          </div>
        </article>

        <div className="action-dock">
          <button type="button" className="dock-button dock-primary" onClick={downloadContact}>
            {isSaved ? <Check size={17} /> : <Download size={17} />}
            <span>{isSaved ? 'Contact saved' : 'Save contact'}</span>
          </button>
          <button type="button" className="dock-button" onClick={() => void shareCard()}>
            <Share2 size={17} />
            <span>Share card</span>
          </button>
          <button type="button" className="dock-button" onClick={() => void copyCardLink()}>
            {copied ? <Check size={17} /> : <Copy size={17} />}
            <span>{copied ? 'Link copied' : 'Copy link'}</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
