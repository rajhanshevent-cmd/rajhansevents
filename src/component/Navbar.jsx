"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link'; 
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { openCalendlyModal } from '@/component/CalendlyModal';
import { BUSINESS_CONFIG } from '@/utils/constants';
import './Navbar.css';

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();

  // Scroll detection for dynamic shadow and padding
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change (official React 19 pattern: adjusting state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile drawer when resizing up to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time Scrollspy when on the continuous homepage
  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = ['home', 'about', 'services', 'packages', 'portfolio', 'testimonials', 'contact'];

    const handleScrollSpy = () => {
      // Near top of page, always activate home
      if (window.scrollY < 120) {
        setActiveSection('home');
        return;
      }

      // If scrolled to bottom of page, activate contact
      const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 80);
      if (isBottom) {
        setActiveSection('contact');
        return;
      }

      const offset = 140; // navbar height + breathing room
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY + offset >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [pathname]);

  // If user lands directly on a legacy #section, scroll smoothly and strip hash from URL
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const timer = setTimeout(() => {
          const navbarHeight = 85;
          const targetPosition = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          setActiveSection(id);
          window.history.replaceState(null, '', window.location.pathname);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  // Clean navigation handler
  const handleNavClick = useCallback((e, link) => {
    if (pathname === '/' && link.href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (isMounted) {
          setIsAdmin(!!data.authenticated);
        }
      } catch (err) {
        console.error("Navbar auth check error:", err);
      }
    }

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const navLinks = [
    { id: 'home', href: '/', label: 'Home' },
    { id: 'about', href: '/about', label: 'About Us' },
    { id: 'services', href: '/services', label: 'Our Services' },
    { id: 'packages', href: '/packages', label: 'Packages' },
    { id: 'portfolio', href: '/portfolio', label: 'Portfolio' },
    { id: 'testimonials', href: '/testimonials', label: 'Testimonials' },
    { id: 'contact', href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="navbar-brand" 
            aria-label="Raj Hansh Events Home"
            onClick={(e) => handleNavClick(e, { id: 'home', href: '/' })}
          >
            <Image 
              src="/logo.png" 
              width={85} 
              height={85} 
              alt="Raj Hansh Events" 
              priority
              className="brand-logo-img"
            />
          </Link>

          {/* Desktop Navigation Links with Clean URLs */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link 
                  key={link.id} 
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                  {isActive && <span className="active-indicator" />}
                </Link>
              );
            })}

            {/* Manage CMS tab: ONLY visible when authenticated as admin */}
            {isAdmin && (
              <Link 
                href="/Manage" 
                className={`nav-link admin-nav-link ${pathname === '/Manage' ? 'active' : ''}`}
                title="Admin CMS Dashboard"
              >
                <span className="admin-nav-icon">⚙️</span>
                <span>Manage CMS</span>
                {pathname === '/Manage' && <span className="active-indicator" />}
              </Link>
            )}
          </nav>

          {/* Quick Action Button */}
          <div className="navbar-actions">
            <button 
              type="button" 
              className="nav-action-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openCalendlyModal();
              }}
              aria-label="Book Consultation"
            >
              Book Consultation
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              type="button"
              className={`mobile-toggle-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <aside 
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">Raj Hansh Events</span>
          <button 
            type="button" 
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            &times;
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, link)}
              >
                <span>{link.label}</span>
                {isActive && <span className="mobile-active-bullet">&bull;</span>}
              </Link>
            );
          })}

          {/* Mobile Manage Link: ONLY visible when authenticated as admin */}
          {isAdmin && (
            <Link 
              href="/Manage" 
              className={`mobile-nav-link admin-link ${pathname === '/Manage' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>⚙️ Manage CMS</span>
              {pathname === '/Manage' ? (
                <span className="mobile-active-bullet">&bull;</span>
              ) : (
                <span className="admin-pill-badge">ADMIN</span>
              )}
            </Link>
          )}
        </nav>

        <div className="mobile-drawer-footer">
          <Link 
            href="/contact" 
            className="mobile-drawer-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Plan Your Celebration
          </Link>
          <p className="mobile-drawer-phone">Direct Line: {BUSINESS_CONFIG.phone}</p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;