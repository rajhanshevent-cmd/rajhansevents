import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Raj Hansh Events',
  description: 'Terms of Service for Raj Hansh Events. Information on event planning contracts, services, and website terms.',
};

export default function TermsOfService() {
  return (
    <main style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
            LEGAL &amp; AGREEMENTS
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.5rem', color: '#7b1a28', marginTop: '10px', marginBottom: '8px' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Effective Date: January 1, 2025 &bull; Last Updated: March 2026
          </p>
        </div>

        <div style={{ color: '#333', fontSize: '1rem', lineHeight: '1.8' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing our website or booking our event management services, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site or engage our services.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              2. Event Services &amp; Quotations
            </h2>
            <p>
              All event quotations provided via this website or in consultation are estimates based on your stated requirements and are valid for the period specified on the formal proposal. Contracts become binding upon mutual execution of our formal Event Planning Agreement and receipt of the agreed deposit.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              3. Intellectual Property
            </h2>
            <p>
              All photographs, logos, theme designs, and media published on this site are the intellectual property of Raj Hansh Events or licensed partners. Unauthorized reproduction or commercial use without prior written consent is strictly prohibited.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              4. Contact &amp; Inquiries
            </h2>
            <p>
              For inquiries regarding contracts or service terms, contact us at <a href="mailto:rajhanshevent@gmail.com" style={{ color: '#7b1a28', textDecoration: 'underline' }}>rajhanshevent@gmail.com</a>.
            </p>
          </section>

          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Link href="/" style={{ color: '#7b1a28', fontWeight: '600', textDecoration: 'none' }}>
              &larr; Return to Home Page
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
