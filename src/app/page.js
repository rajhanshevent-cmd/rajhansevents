import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import HeroSlider from '@/app/HeroSlider';
import PortfolioSection from '@/component/sections/PortfolioSection';
import ContactSection from '@/component/sections/ContactSection';
import VideoCard from '@/component/VideoCard';

import './Home.css';
import '@/app/about/About.css';
import '@/app/services/Services.css';
import '@/app/packages/Packages.css';
import '@/app/testimonials/Testimonials.css';

export const metadata = {
  title: "Raj Hansh Events | Premier Wedding & Event Management in Ranchi",
  description: "Transform your special occasions into unforgettable memories with Raj Hansh Events. Expert wedding, corporate, and luxury celebration planning in Ranchi, Jharkhand.",
};

export default async function Home() {
  // Fetch all necessary data from Supabase in parallel
  const [
    { data: homeData },
    { data: expertise },
    { data: featuredEvents },
    { data: aboutData },
    { data: teamMembers },
    { data: servicesData },
    { data: packagesData },
    { data: testimonialsData },
    { data: experiencesData },
    { data: smilesData },
    { data: contactData }
  ] = await Promise.all([
    supabase.from('home_content').select('*').eq('identifier', 'home_main').single(),
    supabase.from('expertise').select('*').order('created_at', { ascending: true }),
    supabase.from('featured').select('*').order('created_at', { ascending: true }),
    supabase.from('about_us').select('*').eq('identifier', 'about_main').single(),
    supabase.from('team').select('*').order('created_at', { ascending: true }),
    supabase.from('services').select('*').order('created_at', { ascending: true }),
    supabase.from('packages').select('*').order('created_at', { ascending: true }),
    supabase.from('testimonials').select('*').order('created_at', { ascending: true }),
    supabase.from('experiences').select('*').order('created_at', { ascending: true }),
    supabase.from('smiles').select('*').order('created_at', { ascending: true }),
    supabase.from('contact_info').select('*').eq('identifier', 'contact_main').single()
  ]);

  // Fallback Home Expertise & Featured Events (Original Home Page Content Under Hero)
  const fallbackExpertise = [
    { identifier: 'exp-1', title: 'Wedding Planning', image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200" },
    { identifier: 'exp-2', title: 'Birthday & Anniversary', image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200" },
    { identifier: 'exp-3', title: 'Corporate Events', image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200" }
  ];

  const fallbackFeatured = [
    { identifier: 'feat-1', title: 'Royal Wedding', image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200" },
    { identifier: 'feat-2', title: 'Reception', image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200" },
    { identifier: 'feat-3', title: 'BirthDay', image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200" }
  ];

  const displayExpertise = expertise && expertise.length > 0 ? expertise : fallbackExpertise;
  const displayFeatured = featuredEvents && featuredEvents.length > 0 ? featuredEvents : fallbackFeatured;

  // Fallback Team Data
  const fallbackTeam = [
    {
      identifier: 'tm-1',
      name: 'Rajesh Sharma',
      role: 'Founder & Managing Director',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'
    },
    {
      identifier: 'tm-2',
      name: 'Priyanka Hansh',
      role: 'Creative Director & Lead Stylist',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'
    },
    {
      identifier: 'tm-3',
      name: 'Amit Verma',
      role: 'Head of Production & Logistics',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800'
    }
  ];
  const displayTeam = teamMembers && teamMembers.length > 0 ? teamMembers : fallbackTeam;

  // Fallback Services Data
  const fallbackServices = [
    { identifier: 'srv-1', tag: 'WEDDING', title: 'Wedding Planning', desc: 'End-to-end open wedding orchestration — floral design, catering, decor & rituals crafted to your traditions.', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800' },
    { identifier: 'srv-2', tag: 'BIRTHDAY', title: 'Birthday Celebrations', desc: 'Themed birthday parties for every age — from magical first birthdays to milestone soirees.', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800' },
    { identifier: 'srv-3', tag: 'ANNIVERSARY', title: 'Anniversary Celebrations', desc: 'Celebrate romance with intimate, meticulously designed anniversary experiences.', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800' },
    { identifier: 'srv-4', tag: 'CORPORATE', title: 'Corporate & Commercial Events', desc: 'Product launches, conferences, gala dinners and brand activations executed with precision.', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800' },
    { identifier: 'srv-5', tag: 'DECOR & DESIGN', title: 'Decoration & Floral Design', desc: 'Bespoke archway installations, centerpieces and lighting design for unforgettable venues.', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800' },
    { identifier: 'srv-6', tag: 'CATERING', title: 'Catering & Culinary', desc: 'Multi-cuisine food counters and plated fine dining curated by award-winning chefs.', image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800' }
  ];
  const displayServices = servicesData && servicesData.length > 0 ? servicesData : fallbackServices;

  // Fallback Packages Data
  const fallbackPackages = [
    { pkg_name: 'Silver', price: '₹1,50,000', f1: 'Essential Planning & Timeline', f2: 'Venue Coordination', f3: 'Floral Arch & Stage Decor', f4: 'Catering Assistance' },
    { pkg_name: 'Gold', price: '₹2,50,000', f1: 'Full 360° Event Planning', f2: 'Premium Thematic Decor', f3: 'Live Culinary Stations & Catering', f4: 'Cinematic Photography & Film' },
    { pkg_name: 'Platinum', price: '₹4,00,000', f1: 'Royal Bespoke Concierge', f2: 'Celebrity Artist & Entertainment', f3: '5-Star Hospitality & Guest Concierge', f4: 'Drone & 4K Master Filmmaking' },
  ];
  const displayPackages = packagesData && packagesData.length > 0 ? packagesData : fallbackPackages;

  // Fallback Testimonials Data
  const fallbackReviews = [
    { identifier: 'rev-1', name: 'Anjali Mehta', comment: "Raj Hansh Event Management made our wedding a dream come true. Everything was beyond perfect!", stars: 5, platform: 'Google Review' },
    { identifier: 'rev-2', name: 'Vikram Singh', comment: "Incredible corporate event execution. The team handled the 500+ guests flawlessly.", stars: 5, platform: 'Google Review' },
    { identifier: 'rev-3', name: 'Neha & Rohit', comment: "From decor to catering, every detail was handled with immense care. Highly recommended!", stars: 5, platform: 'Google Review' }
  ];
  const fallbackVideos = [
    { identifier: 'vid-1', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'The Sharma Wedding' },
    { identifier: 'vid-2', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'TechCorp Gala 2025' }
  ];
  const fallbackPhotos = [
    { identifier: 'photo-1', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', alt: 'Happy Couple' },
    { identifier: 'photo-2', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800', alt: 'Corporate Team' },
    { identifier: 'photo-3', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800', alt: 'Anniversary Celebration' }
  ];
  const displayReviews = testimonialsData && testimonialsData.length > 0 ? testimonialsData : fallbackReviews;
  const displayVideos = experiencesData && experiencesData.length > 0 ? experiencesData : fallbackVideos;
  const displayPhotos = smilesData && smilesData.length > 0 ? smilesData : fallbackPhotos;

  const planningProcess = [
    { step: '01', title: 'Initial Consultation', desc: 'We sit down with you to understand your vision, preferences, and budget, ensuring we align completely with your dream.' },
    { step: '02', title: 'Design & Curation', desc: 'Our team crafts a meticulous plan, pulling together the best vendors, themes, and timelines tailored just for you.' },
    { step: '03', title: 'Flawless Execution', desc: 'On the big day, we handle every single detail behind the scenes so you can focus on making beautiful memories with your guests.' }
  ];

  const faqs = [
    { q: 'Can I customize a package?', a: 'Absolutely! Every event is designed around your story, and we provide clear, itemised quotations with no hidden costs.' },
    { q: 'Do you travel for destination events?', a: 'Yes! While we are based in Ranchi, we have deep knowledge of venues across Jharkhand and frequently travel beyond.' },
    { q: 'How far in advance should we book?', a: 'We recommend booking at least 6-8 months in advance so we can dedicate our 1-on-1 founder-led focus to your celebration.' }
  ];

  return (
    <div className="home-page continuous-scroll-page">
      
      {/* ============================================================ */}
      {/* 1. SECTION: HOME (Hero + Stats + Expertise + Featured Events) */}
      {/* ============================================================ */}
      <section id="home" className="home-hero-section continuous-section" style={{ padding: 0 }}>
        {/* Premium Hero Section with Slideshow Component */}
        <HeroSlider homeData={homeData} />

        {/* Elegant Stats Band */}
        <div className="elegant-stats-band">
          <div className="container stats-flex-container">
            <div className="elegant-stat-item">
              <h3>850+</h3>
              <p>EVENTS CURATED</p>
            </div>
            <div className="elegant-stat-item">
              <h3>220+</h3>
              <p>WEDDINGS DELIVERED</p>
            </div>
            <div className="elegant-stat-item">
              <h3>60+</h3>
              <p>CORPORATE CLIENTS</p>
            </div>
            <div className="elegant-stat-item">
              <h3>9</h3>
              <p>YEARS OF CRAFT</p>
            </div>
          </div>
        </div>

        {/* Services/Expertise Section (Restored Home Page Section Under Hero) */}
        <div className="home-expertise-section bg-light">
          <div className="container">
            <div className="elegant-section-header">
              <span className="section-kicker">— OUR EXPERTISE</span>
              <h2 className="elegant-section-title">End-to-end event planning, tailored to your vision.</h2>
            </div>
            
            <div className="grid-3">
              {displayExpertise.map((item, index) => (
                <div key={item.identifier || index} className="image-card relative overflow-hidden">
                  <Image 
                    src={item.image_url} 
                    alt={item.title || "Our Expertise"} 
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="card-overlay relative z-10"></div>
                  <div className="card-content relative z-10">
                    <span className="card-kicker">Explore Our Services</span>
                    <h3 className="card-title">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Events (Restored Home Page Section Under Hero) */}
        <div className="home-featured-section">
          <div className="container">
            <div className="elegant-section-header">
              <span className="section-kicker">— FEATURED EVENTS</span>
              <h2 className="elegant-section-title">A glimpse into the magic we create.</h2>
            </div>
            
            <div className="grid-3">
              {displayFeatured.map((event, index) => (
                <div key={event.identifier || index} className="image-card relative overflow-hidden">
                  <Image 
                    src={event.image_url} 
                    alt={event.title || "Featured Event"} 
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="card-overlay relative z-10"></div>
                  <div className="card-content relative z-10">
                    <span className="card-kicker">Ranchi, Jharkhand</span>
                    <h3 className="card-title">{event.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SECTION: ABOUT US */}
      {/* ============================================================ */}
      <section id="about" className="about-page continuous-section bg-light">
        <div className="container story-section">
          <div className="elegant-section-header">
            <span className="section-kicker">— OUR STORY</span>
            <h2 className="elegant-section-title">Nine years of orchestrating royal experiences.</h2>
          </div>
          
          <div className="story-content">
            <div className="story-image-wrapper">
              <Image 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800" 
                alt="Raj Hansh Event Decor" 
                width={700}
                height={500}
                className="story-image"
                sizes="(max-width: 900px) 100vw, 55vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            
            <div className="story-text-wrapper">
              <div className="story-desc">
                {aboutData?.description ? (
                  aboutData.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>Founded in Ranchi, Raj Hansh Event began as a family-run wedding planning boutique and grew into Jharkhand&apos;s most trusted name for premium celebrations. Our team blends traditional cultural sensibility with modern production values — every event we deliver feels handmade, not manufactured.</p>
                )}
              </div>
              
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-icon">📅</span>
                  <h3>850+</h3>
                  <p>EVENTS</p>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">👥</span>
                  <h3>800+</h3>
                  <p>HAPPY CLIENTS</p>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">🏆</span>
                  <h3>12</h3>
                  <p>AWARDS</p>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">✨</span>
                  <h3>9</h3>
                  <p>YEARS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Promise */}
        <div className="container mission-promise-section">
          <div className="mission-box">
            <div className="box-overline">MISSION</div>
            <h2>Our Mission</h2>
            <p>To transform your most cherished moments into experiences that guests will remember for a lifetime.</p>
          </div>
          <div className="promise-box">
            <div className="box-overline text-gold">PROMISE</div>
            <h2>Our Promise</h2>
            <p>Uncompromising quality, punctual delivery and personal attention from a single point of contact — always.</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="container team-section">
          <div className="elegant-section-header">
            <span className="section-kicker">— THE PEOPLE BEHIND THE MAGIC</span>
            <h3 className="elegant-section-title" style={{ fontSize: '2.5rem' }}>Meet the Team</h3>
          </div>
          
          <div className="team-grid">
            {displayTeam.map(member => (
              <div key={member.identifier} className="team-card squarish-card">
                <div className="team-img-wrapper relative" style={{ position: 'relative' }}>
                  <Image 
                    src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800'} 
                    alt={member.name} 
                    fill
                    className="team-img"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role || 'CORE TEAM'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SECTION: SERVICES */}
      {/* ============================================================ */}
      <section id="services" className="services-page continuous-section">
        <div className="services-container">
          <div className="services-header-content" style={{ textAlign: 'center', marginInline: 'auto' }}>
            <span className="section-kicker">— OUR SIGNATURE SERVICES</span>
            <h2 className="services-title">Every detail, thoughtfully composed.</h2>
            <p className="services-subtitle" style={{ maxWidth: '750px', marginInline: 'auto' }}>From intimate ceremonies to landmark corporate galas — we bring your vision to life with quiet luxury and meticulous execution.</p>
          </div>
          
          <div className="services-grid" style={{ marginTop: '3.5rem' }}>
            {displayServices.map((service, index) => (
              <div key={service.identifier || index} className="service-card">
                <div className="card-image-wrapper">
                  <span className="card-tag">{service.tag || 'SERVICE'}</span>
                  <Image 
                    src={service.image_url} 
                    alt={service.title} 
                    fill
                    className="card-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                <div className="card-content">
                  <hr className="card-divider" />
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-desc">{service.desc || 'Experience our premium services tailored just for your special occasion.'}</p>
                  <Link href="/#contact" className="card-quote-link">GET A QUOTE <span>&rarr;</span></Link>
                </div>
              </div>
            ))}
          </div>

          <div className="services-footer-link" style={{ textAlign: 'center' }}>
            <Link href="/#packages">EXPLORE OUR PACKAGES <span>&rarr;</span></Link>
          </div>
        </div>

        {/* Extended Section: Our Process */}
        <div className="process-section">
          <div className="container">
            <h2 className="section-title">How We Bring It to Life</h2>
            <div className="process-grid">
              {planningProcess.map((item, index) => (
                <div key={index} className="process-card">
                  <span className="process-step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="brochure-section" style={{ textAlign: 'center', margin: '60px 0 20px' }}>
          <a href="/brochure.pdf" download><span>📄</span> Download Brochure</a>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SECTION: PACKAGES */}
      {/* ============================================================ */}
      <section id="packages" className="packages-page continuous-section bg-light">
        <div className="container packages-container">
          <div className="elegant-section-header">
            <span className="section-kicker">— OUR PACKAGES</span>
            <h2 className="elegant-section-title">Choose the perfect package for your celebration.</h2>
          </div>

          <div className="grid-3">
            {displayPackages.map((pkg, index) => {
              const features = [pkg.f1, pkg.f2, pkg.f3, pkg.f4].filter(Boolean);
              const isFeatured = index === 1 || pkg.pkg_name?.toLowerCase() === 'gold';
              
              return (
                <div key={pkg.identifier || index} className={`pricing-card ${isFeatured ? 'featured-card' : ''}`}>
                  {isFeatured && (
                    <div className="package-popular-ribbon">
                      <span>MOST POPULAR</span>
                    </div>
                  )}

                  <div className="card-header">
                    <h3 className="pkg-name">{pkg.pkg_name}</h3>
                    <p className="pkg-price">{pkg.price}</p>
                    <span className="pkg-subtitle">Customizable for your guest count</span>
                  </div>

                  <hr className="pricing-divider" />

                  <ul className="features-list">
                    {features.map((feature, fIndex) => (
                      <li key={fIndex} className="feature-item">
                        <span className="gold-check">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pricing-action">
                    <Link href="/#contact" className={`pkg-btn ${isFeatured ? 'featured-btn' : ''}`}>
                      BOOK THIS PACKAGE &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQs Section */}
          <div className="faq-section" style={{ marginTop: '5rem' }}>
            <div className="elegant-section-header" style={{ marginBottom: '2.5rem' }}>
              <span className="section-kicker">— FREQUENTLY ASKED</span>
              <h3 className="elegant-section-title" style={{ fontSize: '2.4rem' }}>Common Questions</h3>
            </div>

            <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-card" style={{ background: '#ffffff', padding: '2rem', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <h4 style={{ color: 'var(--primary-maroon)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.8rem' }}>{faq.q}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SECTION: PORTFOLIO */}
      {/* ============================================================ */}
      <PortfolioSection id="portfolio" />

      {/* ============================================================ */}
      {/* 6. SECTION: TESTIMONIALS */}
      {/* ============================================================ */}
      <section id="testimonials" className="testimonials-page continuous-section bg-light">
        <div className="testimonials-container">
          <div className="elegant-section-header">
            <span className="section-kicker">— WHAT OUR CLIENTS SAY</span>
            <h2 className="elegant-section-title">Real stories from our unforgettable events.</h2>
          </div>

          {/* Google Trust & Rating Badge */}
          <div className="google-trust-badge">
            <div className="google-badge-left">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <div className="google-badge-score">
                <strong>4.9</strong>
                <span className="badge-stars">★★★★★</span>
              </div>
            </div>
            <div className="google-badge-divider" />
            <div className="google-badge-right">
              <span>Verified Google Reviews • Ranchi &amp; Jharkhand</span>
            </div>
          </div>
          
          <div className="reviews-grid">
            {displayReviews.map(review => (
              <div key={review.identifier} className="review-card">
                <div className="review-card-header">
                  <div className="reviewer-avatar">
                    {(review.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-meta">
                    <h4 className="review-author">{review.name}</h4>
                    <span className="reviewer-badge">
                      <span className="verified-check">✓</span> Google Review
                    </span>
                  </div>
                  <div className="google-logo-wrapper" title="Google Verified Review">
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </div>
                </div>

                <div className="review-stars-row">
                  <div className="stars">
                    {"★".repeat(review.stars || 5)}{"☆".repeat(5 - (review.stars || 5))}
                  </div>
                  <span className="review-date">5.0 Star Rating</span>
                </div>

                <p className="review-text">&ldquo;{review.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="video-section">
          <div className="testimonials-container">
            <div className="elegant-section-header">
              <span className="section-kicker">— WATCH THEIR EXPERIENCE</span>
              <h2 className="elegant-section-title">Hear directly from our happy clients.</h2>
            </div>
            
            <div className="video-grid">
              {displayVideos.map((video, idx) => (
                <VideoCard key={video.identifier || idx} video={video} index={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Client Photos (Smiles) */}
        <div className="testimonials-container gallery-section">
          <div className="elegant-section-header">
            <span className="section-kicker">— SMILES WE&apos;VE CREATED</span>
            <h2 className="elegant-section-title">A picture is worth a thousand words.</h2>
          </div>
          
          <div className="photo-grid">
            {displayPhotos.map(photo => (
              <div key={photo.identifier} className="photo-card squarish-card">
                <Image 
                  loading="lazy" 
                  src={photo.image_url} 
                  alt={photo.alt || photo.identifier} 
                  fill
                  className="client-image"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. SECTION: CONTACT */}
      {/* ============================================================ */}
      <ContactSection id="contact" initialContact={contactData} />

    </div>
  );
}