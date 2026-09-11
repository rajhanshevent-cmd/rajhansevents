"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_CONFIG } from '@/utils/constants';
import { getServiceYears } from '@/utils/date';
import WhatsAppIcon from '@/component/WhatsAppIcon';
import { openCalendlyModal } from '@/component/CalendlyModal';
import './Footer.css';

const Footer = () => {
  const [contactData, setContactData] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchFooterData = async () => {
      try {
        const res = await fetch('/api/footer');
        const data = await res.json();

        if (!isMounted) return;
        if (data.contact) setContactData(data.contact);
        if (data.home) setHomeData(data.home);
        if (data.services && data.services.length > 0) setServicesList(data.services);
      } catch (err) {
        console.error("Error fetching footer data:", err);
      }
    };

    fetchFooterData();
    return () => { isMounted = false; };
  }, []);

  const fallbackServices = [
    'Royal Wedding Planning',
    'Grand Receptions & Sangeet',
    'Themed Milestone Birthdays',
    'Corporate Galas & Summits',
    'Bespoke Floral & Stage Decor',
    'Master Catering & Hospitality'
  ];

  const displayServices = servicesList.length > 0
    ? servicesList.map(s => s.title)
    : fallbackServices;

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        const navbarOffset = 85;
        const targetTop = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    }
  };

  const phoneRaw = (contactData?.phone || BUSINESS_CONFIG.phone || "+91 90060 89331").replace(/\s+/g, '');
  const waNumber = (BUSINESS_CONFIG.whatsappNumber || "919905002293").replace(/\D/g, '');
  const emailAddress = contactData?.email || BUSINESS_CONFIG.email;
  const officeAddress = contactData?.location || BUSINESS_CONFIG.location;
  const serviceYears = getServiceYears(homeData?.founded);

  return (
    <footer className="site-footer">
      {/* Sleek Pre-Footer Concierge Bar */}
      <div className="footer-prebanner">
        <div className="footer-prebanner-content">
          <div className="prebanner-text">
            <span className="prebanner-dot" />
            <p><strong>Ready to orchestrate your royal celebration?</strong> Connect directly with Ranchi&apos;s premier event specialists.</p>
          </div>
          <div className="prebanner-actions">
            <button
              type="button"
              onClick={openCalendlyModal}
              className="btn-prebanner-primary"
              aria-label="Book consultation on calendar"
            >
              BOOK CONSULTATION &rarr;
            </button>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-prebanner-wa"
            >
              <WhatsAppIcon size={16} style={{ marginRight: '6px' }} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Architectural Grid */}
      <div className="footer-main">

        {/* Column 1: Brand Heritage */}
        <div className="footer-column brand-column">
          <Link href="/" className="footer-brand-link">
            <Image
              src={homeData?.logo_url || '/logo.png'}
              width={140}
              height={40}
              alt="Raj Hansh Events"
              className="footer-logo-img"
              style={{ width: 'auto', height: '40px', objectFit: 'contain' }}
            />
          </Link>
          <p className="brand-tagline">
            {serviceYears.word} years of orchestrating royal weddings, landmark galas, and bespoke celebrations in Jharkhand &amp; Bihar.
          </p>
          <div className="social-icons" aria-label="Social Media Links">
            <a href={contactData?.fb || "https://facebook.com"} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href={contactData?.insta || "https://instagram.com"} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14f8 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon size={16} color="currentColor" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="footer-column">
          <h3 className="column-title">EXPLORE</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            <li><Link href="/packages">Curated Packages</Link></li>
            <li><Link href="/portfolio">Portfolio Gallery</Link></li>
            <li><Link href="/testimonials">Client Stories</Link></li>
            <li><Link href="/contact">Contact & Concierge</Link></li>
          </ul>
        </div>

        {/* Column 3: Signature Experiences */}
        <div className="footer-column">
          <h3 className="column-title">EXPERIENCES</h3>
          <ul className="footer-links">
            {displayServices.map((serviceName, index) => (
              <li key={index}>
                <Link href="/services">
                  {serviceName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Direct Concierge & Newsletter */}
        <div className="footer-column concierge-column">
          <h3 className="column-title">DIRECT CONCIERGE</h3>
          <ul className="contact-info">
            <li>
              <a href={`tel:${phoneRaw}`} className="contact-link">
                <span className="gold-icon">📞</span> {contactData?.phone || BUSINESS_CONFIG.phone}
              </a>
            </li>
            <li>f
              <a href={`mailto:${emailAddress}`} className="contact-link">
                <span className="gold-icon">✉️</span> {emailAddress}
              </a>
            </li>
            <li>
              <a
                href={BUSINESS_CONFIG.mapsUrl || "https://maps.app.goo.gl/CeZKUvDzapYfJzWv9?g_st=ac"}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <span className="gold-icon">📍</span> {officeAddress}
              </a>
            </li>
            <li className="hours-item">
              <span className="gold-icon">🕒</span> {BUSINESS_CONFIG.hours}
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Bar with Back to Top */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <div className="footer-meta">
            <span>Jharkhand&apos;s Premier Event Specialists</span>
            <span className="meta-dot">•</span>
            <Link href="/privacy">Privacy Policy</Link>
            <span className="meta-dot">•</span>
            <Link href="/terms">Terms &amp; Credits</Link>
          </div>
          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span>Top</span>
            <span className="arrow-icon">&uarr;</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;