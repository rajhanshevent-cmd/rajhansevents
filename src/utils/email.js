import { BUSINESS_CONFIG } from './constants';

/**
 * Dispatches an email inquiry smartly:
 * - Desktop: Opens web Gmail compose in a new tab.
 * - Android / Mobile: Triggers mailto to open the device's default email app.
 *
 * @param {Object} options
 * @param {string} [options.to] - Destination email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.body - Pre-filled email body text
 */
export function openEmailInquiry({ to, subject = '', body = '' }) {
  const targetEmail = to || BUSINESS_CONFIG.email;
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const isMobile = typeof window !== 'undefined' && (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(max-width: 768px)').matches && 'ontouchstart' in window)
  );

  const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodedSubject}&body=${encodedBody}`;

  if (isMobile) {
    // Mobile / Android: Launch default mail client
    const mailLink = document.createElement('a');
    mailLink.href = mailtoUrl;
    mailLink.target = '_top';
    document.body.appendChild(mailLink);
    mailLink.click();
    setTimeout(() => {
      if (mailLink.parentNode) {
        document.body.removeChild(mailLink);
      }
    }, 150);
  } else {
    // Desktop: Open web Gmail composer in new tab
    const win = window.open(webGmailUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = mailtoUrl;
    }
  }

  return { isMobile, mailtoUrl, webGmailUrl };
}
