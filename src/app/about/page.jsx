import Link from 'next/link';
import Image from 'next/image';
import { getSingle, getAll } from '@/lib/db'; 
import './About.css'; 

export const metadata = {
  title: "About Us | Raj Hansh Events Ranchi", 
  description: "Learn about the heritage, team, and bespoke planning philosophy behind Raj Hansh Events, Ranchi's premier celebration curators.", 
};

export const dynamic = 'force-dynamic';

export default async function About() {
  // Fetch all necessary data from Neon PostgreSQL in parallel for maximum speed
  const [
    aboutData, 
    teamMembers, 
    homeData,
  ] = await Promise.all([
    getSingle('about_us', 'about_main'), 
    getAll('team', 'created_at ASC'),
    getSingle('home_content', 'home_main')
  ]);

  // Keeping process steps static as requested
  const processSteps = [
    { step: '01', title: 'First Consultation', desc: 'We meet to understand your vision, guest list, and expectations for the celebration.' }, 
    { step: '02', title: 'Design & Curation', desc: 'We handle venue selection, decor themes, and catering coordination matched to your budget.' }, 
    { step: '03', title: 'On-Ground Logistics', desc: 'Managing entertainment, transport, and on-ground crew from start to finish.' }, 
    { step: '04', title: 'Final Farewell', desc: 'You stay fully present in your celebration while we execute the event seamlessly.' } 
  ];

  // Professional team fallback
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

  return (
    <div className="about-page">
      
      {/* --- Section 1: Brand Story --- */}
      <section className="container story-section">
        {/* REDESIGNED HEADER TO FIX SPACING AND ALIGNMENT */}
        <div className="elegant-section-header" style={{ textAlign: 'left', marginInline: '0', marginBottom: '3rem' }}>
          <span className="section-kicker">— OUR STORY</span>
          <h1 className="elegant-section-title">Nine years of orchestrating royal experiences.</h1>
        </div>
        
        <div className="story-content">
          <div className="story-image-wrapper">
            <Image 
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800" 
              alt="Raj Hansh Event Decor" 
              width={700}
              height={500}
              className="story-image"
              sizes="(max-width: 900px) 100vw, 50vw"
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
                <h3>{homeData?.founded ? `${Math.max(1, new Date().getFullYear() - (parseInt(homeData.founded.replace(/\D/g, '') || '2016', 10)))}` : '9'}</h3> 
                <p>{homeData?.founded ? `SINCE ${homeData.founded.replace(/\D/g, '') || '2016'}` : 'YEARS'}</p> 
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Mission & Promise --- */}
      <section className="container mission-promise-section">
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
      </section>

      {/* --- Section 3: Working Process --- */}
      <section className="process-section">
        <div className="container">
          
          {/* REDESIGNED HEADER */}
          <div className="elegant-section-header">
            <span className="section-kicker text-gold">— HOW WE WORK</span>
            <h2 className="elegant-section-title text-light">From the very first consultation to the final farewell.</h2>
          </div>

          <div className="process-grid">
            {processSteps.map((item, index) => (
              <div key={index} className="process-step-card">
                <div className="step-number">{item.step}</div> 
                <h3 className="step-title">{item.title}</h3> 
                <p className="step-desc">{item.desc}</p> 
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 4: Team Photos --- */}
      <section className="container team-section">
        
        {/* REDESIGNED HEADER */}
        <div className="elegant-section-header" style={{ marginBottom: '4rem' }}>
          <span className="section-kicker">— THE PEOPLE BEHIND THE MAGIC</span>
          <h2 className="elegant-section-title">Meet the Team</h2>
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
      </section>

      {/* --- Section 5: Call to Action --- */}
      <section className="container cta-section">
        <Link href="/contact" className="cta-button">
          BOOK A FREE CONSULTATION <span>&rarr;</span>
        </Link> 
      </section>
      
    </div>
  );
}