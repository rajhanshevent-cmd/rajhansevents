import React from 'react';

const defaultPlanningProcess = [
  {
    step: '01',
    title: 'Initial Consultation',
    desc: 'We sit down with you to understand your vision, preferences, and budget, ensuring we align completely with your dream.'
  },
  {
    step: '02',
    title: 'Design & Curation',
    desc: 'Our team crafts a bespoke concept, pulling together themes, moodboards, color palettes, and curated vendors.'
  },
  {
    step: '03',
    title: 'Coordination & Logistics',
    desc: 'We manage vendor coordination, staging, production schedules, and artist alignments with meticulous care.'
  },
  {
    step: '04',
    title: 'Flawless Execution',
    desc: 'On the big day, we orchestrate every single detail live behind the scenes so you can celebrate completely stress-free.'
  }
];

export default function ProcessSection({ items = defaultPlanningProcess }) {
  return (
    <section className="process-section how-it-works-section">
      <div className="container">
        <h2 className="section-title">How We Bring It to Life</h2>
        <div className="how-it-works-grid">
          {items.map((item, index) => (
            <div key={index} className="process-card">
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
