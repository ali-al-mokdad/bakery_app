import { useSettings } from '../context/SettingsContext';

/**
 * Renders a WhatsApp CTA button that opens WhatsApp with a pre-filled message.
 * Falls back gracefully (renders nothing) if no WhatsApp number is configured.
 */
export default function WhatsAppButton({ message, className = '', children }) {
  const { settings } = useSettings();
  const whatsapp = settings?.whatsapp?.replace(/[^\d]/g, '');

  if (!whatsapp) return null;

  const text = encodeURIComponent(message || 'Hello, I would like to know more about your bakery products.');
  const href = `https://wa.me/${whatsapp}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'btn-whatsapp'}
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M16.004 3C9.383 3 4 8.383 4 15.004c0 2.393.66 4.63 1.807 6.55L4 29l7.62-1.775a11.94 11.94 0 0 0 4.384.827h.005c6.62 0 12.003-5.383 12.003-12.005C28.012 8.383 22.63 3 16.004 3Zm0 21.86h-.004a9.9 9.9 0 0 1-5.05-1.386l-.363-.216-3.766.878.895-3.673-.238-.377a9.86 9.86 0 0 1-1.518-5.28C5.96 9.53 10.49 5 16.004 5c2.646 0 5.133 1.032 7.005 2.905a9.833 9.833 0 0 1 2.902 7.005c0 5.514-4.531 10.05-9.907 9.95Zm5.462-7.42c-.298-.15-1.77-.874-2.044-.974-.274-.1-.474-.15-.674.15-.199.298-.774.973-.949 1.173-.174.2-.349.224-.647.075-.298-.15-1.258-.463-2.397-1.478-.886-.79-1.484-1.767-1.658-2.065-.174-.298-.019-.46.131-.609.134-.134.298-.35.448-.524.15-.175.199-.3.298-.5.1-.2.05-.375-.025-.524-.075-.15-.673-1.62-.923-2.22-.243-.583-.49-.504-.673-.513l-.573-.01c-.2 0-.524.075-.799.374-.274.3-1.048 1.024-1.048 2.498s1.073 2.898 1.223 3.098c.15.199 2.112 3.226 5.117 4.523.715.309 1.273.493 1.708.63.717.228 1.37.196 1.886.119.575-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.124-.274-.199-.573-.349Z" />
      </svg>
      {children || 'Order on WhatsApp'}
    </a>
  );
}
