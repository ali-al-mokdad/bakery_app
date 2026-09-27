import { useSettings } from '../context/SettingsContext';
import WhatsAppButton from '../components/WhatsAppButton';
import Spinner from '../components/Spinner';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const SocialIcon = ({ href, label, Icon }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-bakery-200 px-4 py-2 text-sm font-semibold text-bakery-700 transition hover:bg-bakery-600 hover:text-white dark:border-bakery-700 dark:text-cream-100"
    >
      <Icon className="w-5 h-5" />
      {label}
    </a>
  );
};

export default function Contact() {
  const { settings, loading } = useSettings();

  if (loading) return <Spinner />;

  return (
    <div className="section">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="section-title">Get in Touch</h1>
          <p className="mt-3 text-bakery-600/80 dark:text-cream-300/70">
            We'd love to hear from you — visit, call, or message us
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card p-8">
            <h2 className="font-display text-xl font-bold text-bakery-900 dark:text-cream-50">
              {settings?.businessName}
            </h2>

            <div className="mt-6 space-y-4 text-bakery-700 dark:text-cream-200">
              {settings?.address && (
                <div className="flex gap-3">
                  <span className="text-xl">📍</span>
                  <p>{settings.address}</p>
                </div>
              )}
              {settings?.phone && (
                <div className="flex gap-3">
                  <span className="text-xl">📞</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-bakery-500">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="flex gap-3">
                  <span className="text-xl">✉️</span>
                  <a href={`mailto:${settings.email}`} className="hover:text-bakery-500">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings?.openingHours && (
                <div className="flex gap-3">
                  <span className="text-xl">🕐</span>
                  <p className="whitespace-pre-line">{settings.openingHours}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <WhatsAppButton message="Hello, I would like to know more about your bakery products." />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <SocialIcon href={settings?.facebook} label="Facebook" Icon={FaFacebookF} />
              <SocialIcon href={settings?.instagram} label="Instagram" Icon={FaInstagram} />
              <SocialIcon href={settings?.tiktok} label="TikTok" Icon={FaTiktok} />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-soft">
            {settings?.mapsEmbedUrl ? (
              <iframe
                src={settings.mapsEmbedUrl}
                title="Bakery location"
                className="h-full min-h-[320px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-bakery-100 text-bakery-500 dark:bg-bakery-800 dark:text-cream-300/60">
                Map location not configured yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
