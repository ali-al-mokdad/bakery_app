import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

function SocialIcon({ href, label, path }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-bakery-200 text-bakery-700 transition hover:-translate-y-0.5 hover:bg-bakery-600 hover:text-white dark:border-bakery-700 dark:text-cream-100"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d={path} />
      </svg>
    </a>
  );
}

const ICONS = {
  facebook:
    'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12',
  instagram:
    'M12 2c-2.7 0-3.1 0-4.1.1-1.1 0-1.8.2-2.5.5-.7.3-1.3.7-1.9 1.3-.6.6-1 1.2-1.3 1.9-.3.7-.5 1.4-.5 2.5C1.6 9.3 1.6 9.7 1.6 12s0 2.7.1 3.7c0 1.1.2 1.8.5 2.5.3.7.7 1.3 1.3 1.9.6.6 1.2 1 1.9 1.3.7.3 1.4.5 2.5.5 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c1.1 0 1.8-.2 2.5-.5.7-.3 1.3-.7 1.9-1.3.6-.6 1-1.2 1.3-1.9.3-.7.5-1.4.5-2.5.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c0-1.1-.2-1.8-.5-2.5-.3-.7-.7-1.3-1.3-1.9-.6-.6-1.2-1-1.9-1.3-.7-.3-1.4-.5-2.5-.5C15.1 2 14.7 2 12 2Zm0 1.8c2.6 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.2.3.3.9.3 1.8.1 1 .1 1.4.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.2-.9.3-1.8.3-1 .1-1.4.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.2-.3-.3-.9-.3-1.8-.1-1-.1-1.4-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.2.9-.3 1.8-.3 1-.1 1.4-.1 4-.1ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm5.2-3.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z',
  tiktok:
    'M16.6 2h-3.2v13.2a2.9 2.9 0 1 1-2.1-2.8V9.1a6.1 6.1 0 1 0 5.3 6V8.6a7.8 7.8 0 0 0 4.5 1.4V6.8a4.6 4.6 0 0 1-4.5-4.8Z',
};

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="border-t border-bakery-100 bg-cream-100 px-6 py-12 dark:border-bakery-800 dark:bg-bakery-900 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-bold text-bakery-800 dark:text-cream-50">
            {settings?.businessName || 'Sweet Crumb Bakery'}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bakery-700/80 dark:text-cream-200/80">
            {settings?.description ||
              'Freshly baked bread, cakes, and pastries made with love, every single day.'}
          </p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href={settings?.facebook} label="Facebook" path={ICONS.facebook} />
            <SocialIcon href={settings?.instagram} label="Instagram" path={ICONS.instagram} />
            <SocialIcon href={settings?.tiktok} label="TikTok" path={ICONS.tiktok} />
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-bakery-600 dark:text-bakery-300">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-bakery-700 dark:text-cream-200">
            <li><Link className="hover:text-bakery-500" to="/">Home</Link></li>
            <li><Link className="hover:text-bakery-500" to="/menu">Menu</Link></li>
            <li><Link className="hover:text-bakery-500" to="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-bakery-500" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-bakery-600 dark:text-bakery-300">
            Visit Us
          </h4>
          <ul className="space-y-2 text-sm text-bakery-700 dark:text-cream-200">
            {settings?.address && <li>{settings.address}</li>}
            {settings?.phone && <li>{settings.phone}</li>}
            {settings?.email && <li>{settings.email}</li>}
          </ul>
          {settings?.openingHours && (
            <div className="mt-3 whitespace-pre-line text-xs text-bakery-600/80 dark:text-cream-300/70">
              {settings.openingHours}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-bakery-200/60 pt-6 text-center text-xs text-bakery-500 dark:border-bakery-800 dark:text-cream-300/60">
        © {new Date().getFullYear()} {settings?.businessName || 'Sweet Crumb Bakery'}. All rights reserved.
      </div>
    </footer>
  );
}
