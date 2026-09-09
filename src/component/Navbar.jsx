"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link'; 
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
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

  // Handle hash scrolling if user lands directly on /#section
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
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  // Smooth scroll handler on link click
  const handleNavClick = useCallback((e, link) => {
    if (pathname === '/') {
      e.preventDefault();
      const targetEl = document.getElementById(link.id);
      if (targetEl) {
        const navbarHeight = 85;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        setActiveSection(link.id);
        window.history.pushState(null, '', `/#${link.id}`);
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (isMounted) {
            setIsAdmin(profile?.role === 'admin');
          }
        } else {
          if (isMounted) {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error("Navbar auth check error:", err);
      }
    }

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        checkAdminStatus();
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) setIsAdmin(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { id: 'home', href: '/#home', label: 'Home', fallbackRoute: '/' },
    { id: 'about', href: '/#about', label: 'About Us', fallbackRoute: '/about' },
    { id: 'services', href: '/#services', label: 'Our Services', fallbackRoute: '/services' },
    { id: 'packages', href: '/#packages', label: 'Packages', fallbackRoute: '/packages' },
    { id: 'portfolio', href: '/#portfolio', label: 'Portfolio', fallbackRoute: '/portfolio' },
    { id: 'testimonials', href: '/#testimonials', label: 'Testimonials', fallbackRoute: '/testimonials' },
    { id: 'contact', href: '/#contact', label: 'Contact', fallbackRoute: '/contact' },
  ];

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link 
          href="/#home" 
          className="navbar-brand" 
          aria-label="Raj Hansh Events Home"
          onClick={(e) => handleNavClick(e, { id: 'home', href: '/#home' })}
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

        {/* Desktop Navigation Links with Scrollspy */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === '/' 
              ? activeSection === link.id 
              : (pathname === link.fallbackRoute || pathname === link.href);

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

          {/* Manage CMS tab (Active in Dev Preview Mode) */}
          <Link 
            href="/Manage" 
            className={`nav-link admin-nav-link ${pathname === '/Manage' ? 'active' : ''}`}
            title="Dev Preview: Admin CMS"
          >
            Manage
          </Link>
        </nav>

        {/* Quick Action Button */}
        <div className="navbar-actions">
          <Link 
            href="/#contact" 
            className="nav-action-btn"
            onClick={(e) => handleNavClick(e, { id: 'contact', href: '/#contact' })}
          >
            Book Consultation
          </Link>

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

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
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
            const isActive = pathname === '/' 
              ? activeSection === link.id 
              : (pathname === link.fallbackRoute || pathname === link.href);

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

          {/* Mobile Manage Link (Active in Dev Preview Mode) */}
          <Link 
            href="/Manage" 
            className={`mobile-nav-link admin-link ${pathname === '/Manage' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Manage CMS</span>
          </Link>
        </nav>

        <div className="mobile-drawer-footer">
          <Link 
            href="/#contact" 
            className="mobile-drawer-cta"
            onClick={(e) => handleNavClick(e, { id: 'contact', href: '/#contact' })}
          >
            Plan Your Celebration
          </Link>
          <p className="mobile-drawer-phone">Direct Line: +91 90060 89331</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;