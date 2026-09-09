import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Raj Hansh Events',
  description: 'Privacy Policy for Raj Hansh Events. Learn how we handle your personal data, inquiries, and information securely.',
};

export default function PrivacyPolicy() {
  return (
    <main style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
            LEGAL &amp; PRIVACY
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.5rem', color: '#7b1a28', marginTop: '10px', marginBottom: '8px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Effective Date: January 1, 2025 &bull; Last Updated: March 2026
          </p>
        </div>

        <div style={{ color: '#333', fontSize: '1rem', lineHeight: '1.8' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>Raj Hansh Events</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We provide premier wedding planning, decor styling, catering coordination, and luxury celebration management based in Ranchi, Jharkhand, India. We respect your privacy and are committed to protecting the personal information you share with us through our website.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              2. Information We Collect
            </h2>
            <p>We only collect personal information that is reasonably necessary to fulfill your event consultation requests, communicate with you, and manage our website:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '10px' }}>
              <li><strong>Inquiry &amp; Booking Details:</strong> Your full name, email address, phone number, preferred event date, celebration type, approximate guest count, and venue location provided when submitting our consultation or inquiry forms.</li>
              <li><strong>Communications Data:</strong> Information exchanged when you reach out to our team via WhatsApp, direct phone call, or email.</li>
              <li><strong>Administrative Access Data (Google OAuth):</strong> For authorized administrators accessing the internal management portal (/Manage), our application requests basic Google profile information (name, email address, and profile photo) strictly to verify administrator identity. We do not access, store, or share any personal emails, Google Drive files, contacts, or sensitive Google account data.</li>
              <li><strong>Technical Data:</strong> Non-personally identifiable analytical information such as browser type, device information, and anonymous session statistics to help us maintain website speed and security.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              3. How We Use Your Information
            </h2>
            <p>We use collected data solely for legitimate business purposes:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '10px' }}>
              <li>To prepare customized event proposals, theme designs, and pricing quotations tailored to your requirements.</li>
              <li>To schedule planning appointments, venue visits, and consultation sessions.</li>
              <li>To authenticate authorized site administrators via secure Google OAuth sign-in.</li>
              <li>To comply with statutory and legal obligations in India.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              <strong>We never sell, rent, or trade your personal information to third-party advertisers or data brokers.</strong>
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              4. Third-Party Service Providers
            </h2>
            <p>To deliver a smooth and secure digital experience, we utilize reputable, enterprise-grade cloud providers:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '10px' }}>
              <li><strong>Neon PostgreSQL:</strong> Secure serverless database storage for booking inquiries and client messages with SSL encryption in transit.</li>
              <li><strong>Cloudflare R2:</strong> S3-compatible media storage for publicly visible portfolio photos and celebration galleries.</li>
              <li><strong>Google OAuth 2.0:</strong> Identity provider utilized exclusively for administrative staff access control.</li>
              <li><strong>Meta / WhatsApp Business Cloud API:</strong> Facilitating direct client messaging and instant WhatsApp inquiries initiated by the user.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              5. Cookies and Session Management
            </h2>
            <p>
              We use strictly necessary HTTP-only session cookies to maintain secure sessions for logged-in administrators. We do not use third-party tracking or invasive behavioral advertising cookies.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              6. Data Retention and Security
            </h2>
            <p>
              We implement industry-standard encryption, firewalls, and token-based authentication to safeguard your information. We retain consultation records only as long as necessary to coordinate your events and maintain required accounting records.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              7. Your Rights
            </h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your contact records at any time by emailing us.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              8. Contact Us
            </h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please reach out to us:</p>
            <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#FDFBF7', borderRadius: '8px', borderLeft: '4px solid #7b1a28' }}>
              <p style={{ margin: '4px 0' }}><strong>Raj Hansh Events</strong></p>
              <p style={{ margin: '4px 0' }}>Email: <a href="mailto:rajhanshevent@gmail.com" style={{ color: '#7b1a28', textDecoration: 'underline' }}>rajhanshevent@gmail.com</a></p>
              <p style={{ margin: '4px 0' }}>Location: Ranchi, Jharkhand, India</p>
            </div>
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
