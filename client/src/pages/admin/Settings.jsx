import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/Toast';
import ImageUploader from '../../components/ImageUploader';
import Spinner from '../../components/Spinner';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'LBP'];

export default function Settings() {
  const { settings, loading, refresh } = useSettings();
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.update(form);
      showToast('Settings updated successfully.');
      refresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bakery-900 dark:text-cream-50">
        Website Settings
      </h1>
      <p className="mt-1 text-sm text-bakery-500 dark:text-cream-300/60">
        Manage your bakery's information, contact details, and branding
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Bakery info */}
        <section className="card p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
            Bakery Information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <ImageUploader label="Logo" value={form.logo} onUploaded={(p) => handleChange('logo', p)} />
            <ImageUploader label="Cover Image" value={form.coverImage} onUploaded={(p) => handleChange('coverImage', p)} />
          </div>
          <div className="mt-5">
            <label className="label">Bakery Name</label>
            <input className="input" value={form.businessName || ''} onChange={(e) => handleChange('businessName', e.target.value)} />
          </div>
          <div className="mt-5">
            <label className="label">Description</label>
            <textarea className="input" rows={4} value={form.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
          </div>
        </section>

        {/* Contact info */}
        <section className="card p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
            Contact Information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input" value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">WhatsApp Number</label>
              <input
                className="input"
                placeholder="e.g. 15551234567 (country code, no + or spaces)"
                value={form.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Social media */}
        <section className="card p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
            Social Media
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="label">Facebook URL</label>
              <input className="input" value={form.facebook || ''} onChange={(e) => handleChange('facebook', e.target.value)} />
            </div>
            <div>
              <label className="label">Instagram URL</label>
              <input className="input" value={form.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} />
            </div>
            <div>
              <label className="label">TikTok URL</label>
              <input className="input" value={form.tiktok || ''} onChange={(e) => handleChange('tiktok', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Maps */}
        <section className="card p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
            Google Maps
          </h2>
          <label className="label">Google Maps Embed URL</label>
          <input
            className="input"
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={form.mapsEmbedUrl || ''}
            onChange={(e) => handleChange('mapsEmbedUrl', e.target.value)}
          />
        </section>

        {/* Opening hours & currency */}
        <section className="card p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
            Opening Hours &amp; Currency
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Opening Hours (one line per entry)</label>
              <textarea
                className="input"
                rows={4}
                placeholder={'Monday - Friday: 7:00 AM - 9:00 PM\nSaturday: 7:00 AM - 10:00 PM\nSunday: 8:00 AM - 8:00 PM'}
                value={form.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Currency</label>
              <select className="input" value={form.currency || 'USD'} onChange={(e) => handleChange('currency', e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
