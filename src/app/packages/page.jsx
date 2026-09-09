import { getAll } from '@/lib/db'; 
import { BUSINESS_CONFIG } from '@/utils/constants';
import './Packages.css'; 

export const metadata = {
  title: "Packages & Pricing | Raj Hansh Events Ranchi", 
  description: "Transparent, luxury event planning and wedding packages tailored to your vision and celebration size in Ranchi." 
};

export default async function Packages() {
  // Fetch packages from Neon PostgreSQL
  const packagesData = await getAll('packages', 'created_at ASC'); 

  // Core packages used as fallbacks if the database is empty
  const fallbackPackages = [
    { pkg_name: 'Silver', price: '₹1,50,000', f1: 'Basic Planning', f2: 'Venue Booking', f3: 'Basic Decor', f4: 'Catering Assistance' }, 
    { pkg_name: 'Gold', price: '₹2,50,000', f1: 'Full Planning', f2: 'Premium Decor', f3: 'Catering Management', f4: 'Photography' }, 
    { pkg_name: 'Platinum', price: '₹4,00,000', f1: 'Luxury Planning', f2: 'Celebrity Entertainment', f3: '5-Star Hospitality', f4: 'Complete Filming' }, 
  ];

  const displayPackages = packagesData && packagesData.length > 0 ? packagesData : fallbackPackages; 

  // Updated to match the Raj Hansh Working Process styling
  const steps = [
    { num: '01', title: 'First Consultation', desc: 'We meet to understand your vision, guest list, and expectations for the celebration.' }, 
    { num: '02', title: 'Design & Curation', desc: 'Our team crafts a custom design board and detailed proposal with transparent pricing.' }, 
    { num: '03', title: 'On-Ground Logistics', desc: 'We handle all vendor bookings, entertainment, transport, and on-ground crew.' }, 
    { num: '04', title: 'Final Farewell', desc: 'You stay fully present in your celebration while we execute the event seamlessly.' } 
  ];

  // FAQs
  const faqs = [
    { q: 'Can I customize a package?', a: 'Absolutely! Every event is designed around your story, and we provide clear, itemised quotations with no hidden costs.' }, 
    { q: 'Do you travel for destination events?', a: 'Yes! While we are based in Ranchi, we have deep knowledge of venues across Jharkhand and frequently travel beyond.' }, 
    { q: 'How far in advance should we book?', a: 'We recommend booking at least 6-8 months in advance so we can dedicate our 1-on-1 founder-led focus to your celebration.' } 
  ];

  return (
    <div className="packages-page">
      
      {/* --- Packages Section --- */}
      <section className="container packages-container">
        
        {/* REDESIGNED HEADER */}
        <div className="elegant-section-header">
          <span className="section-kicker">— OUR PACKAGES</span>
          <h1 className="elegant-section-title">Choose the perfect package for your celebration.</h1>
        </div>

        <div className="grid-3">
          {displayPackages.map((pkg, index) => {
            // Map the individual database feature columns into an array and filter out any empty ones
            const features = [pkg.f1, pkg.f2, pkg.f3, pkg.f4].filter(Boolean); 
            const isFeatured = index === 1 || pkg.pkg_name?.toLowerCase() === 'gold';
            
            return (
              <div key={pkg.identifier || index} className={`pricing-card ${isFeatured ? 'featured-card' : ''}`}>
                {isFeatured && <span className="package-ribbon">MOST POPULAR</span>}
                <h3>{pkg.pkg_name}</h3> 
                <div className="price">{pkg.price}</div> 
                <p className="text-muted" style={{ marginBottom: '1rem' }}>Starting From</p> 
                <ul>
                  {features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li> 
                  ))}
                </ul>
                <div className="pricing-action">
                  <a
                    href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                      `Hello Raj Hansh Events,

I'm interested in your ${pkg.pkg_name} Package.

Could you please share:
• Complete package details
• What's included
• Pricing breakdown
• Availability for my event

Thank you!`
                    )}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`pkg-btn ${isFeatured ? 'featured-btn' : ''}`}
                  >
                    SELECT THIS PACKAGE &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="custom-quote-section">
          <h3>Need a Custom Package?</h3> 
          <p className="text-muted" style={{ margin: '1rem 0' }}>We can tailor everything exactly to your requirements with transparent pricing.</p> 
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@rajhansh.com" target="_blank" rel="noreferrer" className="btn btn-primary">Contact Us for Custom Quote</a> 
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="process-section">
        <div className="container">
          
          {/* REDESIGNED HEADER */}
          <div className="elegant-section-header">
            <span className="section-kicker text-gold">— HOW IT WORKS</span>
            <h2 className="elegant-section-title text-light">From the very first consultation to the final farewell.</h2>
          </div>
          
          <div className="process-grid">
            {steps.map((step, index) => (
              <div key={index} className="process-step-card">
                <div className="step-number">{step.num}</div> 
                <h3 className="step-title">{step.title}</h3> 
                <p className="step-desc">{step.desc}</p> 
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="container faq-section">
        
        {/* REDESIGNED HEADER */}
        <div className="elegant-section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-kicker">— KNOWLEDGE BASE</span>
          <h2 className="elegant-section-title">Frequently Asked Questions</h2>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h4>{faq.q}</h4> 
              <p className="text-muted">{faq.a}</p> 
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}