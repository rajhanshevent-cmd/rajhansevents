'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToR2 } from '../../utils/r2Upload';
import styles from './Manage.module.css';
import imageCompression from 'browser-image-compression';

// ============================================================================
// DEV PREVIEW AUTH BYPASS
// When true: Allows immediate direct viewing & testing of Admin CMS without login.
// When asked to hide behind login: Change this to false.
// ============================================================================
const BYPASS_AUTH_FOR_DEV = true;

export default function ManagePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(!BYPASS_AUTH_FOR_DEV);
  const [isAuthorized, setIsAuthorized] = useState(BYPASS_AUTH_FOR_DEV);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (BYPASS_AUTH_FOR_DEV) {
      return;
    }

    let isMounted = true;
    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (!data.authenticated) {
          if (isMounted) router.push('/admin?error=unauthorized');
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error('Auth verification error in Manage:', err);
        if (isMounted) router.push('/admin');
      }
    }

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);
  
  // Section States
  const [homeData, setHomeData] = useState({ identifier: 'home_main', logo: null, banner_video: null, banner_title: '', banner_text: '', founded: '' });
  const [expertiseData, setExpertiseData] = useState({ identifier: '', title: '', file: null });
  const [featuredData, setFeaturedData] = useState({ identifier: '', title: '', file: null });
  const [contactData, setContactData] = useState({ identifier: 'contact_main', email: '', phone: '', location: '', insta: '', fb: '' });
  const [aboutData, setAboutData] = useState({ identifier: 'about_main', description: '' });
  const [teamData, setTeamData] = useState({ identifier: '', name: '', role: '', file: null });
  const [serviceData, setServiceData] = useState({ identifier: '', title: '', tag: '', desc: '', file: null });
  const [packageData, setPackageData] = useState({ identifier: '', pkg_name: '', f1: '', f2: '', f3: '', f4: '', price: '' });
  const [portfolioData, setPortfolioData] = useState({ identifier: '', file: null, category: '', media_type: 'image', title : '' });
  const [testimonialData, setTestimonialData] = useState({ identifier: '', name: '', comment: '', stars: 5 });
  const [experienceData, setExperienceData] = useState({ identifier: '', title: '', file: null });
  const [smileData, setSmileData] = useState({ identifier: '', file: null });

  // Compression helper tailored for WebP and dynamic sizing
  const compressImage = async (file, isThumbnail = false) => {
    if (!file || !file.type.startsWith('image/')) {
      return file;
    }

    const options = {
      maxSizeMB: isThumbnail ? 0.1 : 1.5, // 100KB for thumbs, 1.5MB for standards
      maxWidthOrHeight: isThumbnail ? 600 : 1920,
      useWebWorker: true,
      fileType: 'image/webp', // Force conversion to WebP format
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      // Strip original extension and enforce .webp
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const fileName = isThumbnail ? `thumb_${baseName}.webp` : `${baseName}.webp`;
      
      return new File([compressedBlob], fileName, { type: 'image/webp', lastModified: Date.now() });
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  // Universal Submit Handler
  const handleSubmit = async (e, table, payload, fileData = null, secondaryFileData = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPayload = { ...payload };

      const processFileUpload = async (fileInfo) => {
        if (!fileInfo || !fileInfo.file) return;

        // Portfolio Logic: High-Res Original + Compressed Thumbnail
        if (table === 'portfolio' && fileInfo.file.type.startsWith('image/')) {
          // Convert the original to a high-quality WebP for consistency
          const originalFile = await compressImage(fileInfo.file, false); 
          // Generate the tiny thumbnail WebP
          const thumbnailFile = await compressImage(fileInfo.file, true);

          const originalUrl = await uploadToR2(originalFile, fileInfo.bucket);
          const thumbnailUrl = await uploadToR2(thumbnailFile, fileInfo.bucket);

          finalPayload[fileInfo.columnName] = originalUrl;
          finalPayload['thumbnail_url'] = thumbnailUrl;
        } 
        // Standard Logic: Compress all other images and save as the only file
        else if (fileInfo.file.type.startsWith('image/')) {
          const compressedFile = await compressImage(fileInfo.file, false);
          const fileUrl = await uploadToR2(compressedFile, fileInfo.bucket);
          finalPayload[fileInfo.columnName] = fileUrl;
        } 
        // Videos: Upload as is, but block massive files to prevent freezing
        else if (fileInfo.file.type.startsWith('video/')) {
          if (fileInfo.file.size > 50 * 1024 * 1024) { // 50MB limit
             throw new Error("Video exceeds 50MB. Please compress it manually before uploading.");
          }
          const fileUrl = await uploadToR2(fileInfo.file, fileInfo.bucket);
          finalPayload[fileInfo.columnName] = fileUrl;
        }
      };

      await processFileUpload(fileData);
      await processFileUpload(secondaryFileData);

      const res = await fetch('/api/cms/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, payload: finalPayload, conflictKey: 'identifier' })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update ${table}`);
      }

      alert(`${table} updated successfully!`);
    } catch (error) {
      alert(`Error updating ${table}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: '1rem',
        padding: '2rem',
        color: '#0B192C',
        fontFamily: 'var(--font-nunito, sans-serif)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '3px solid rgba(218, 165, 32, 0.2)',
          borderTopColor: '#DAA520',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>Verifying administrator privileges...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className={styles.manageContainer}>
      {BYPASS_AUTH_FOR_DEV && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(123, 26, 40, 0.1), rgba(212, 175, 55, 0.15))',
          border: '1.5px solid #D4AF37',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              background: '#7b1a28',
              color: '#D4AF37',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              DEV PREVIEW ACTIVE
            </span>
            <strong style={{ color: '#7b1a28', fontSize: '0.95rem' }}>
              Admin page unlocked without login per your request
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#444' }}>
            You have direct access to view and test all content sections. Say <em>&quot;hide admin behind login&quot;</em> when you want to re-engage the authentication guard.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Website Content Manager</h1>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin');
          }}
          style={{
            padding: '8px 18px',
            backgroundColor: '#c53030',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <section className={styles.section}>
        <h2>Home Page Main</h2>
        <form onSubmit={(e) => handleSubmit(
          e, 'home_content', 
          { identifier: homeData.identifier, banner_title: homeData.banner_title, banner_text: homeData.banner_text, founded: homeData.founded },
          { file: homeData.logo, bucket: 'home', columnName: 'logo_url' },
          { file: homeData.banner_video, bucket: 'home', columnName: 'banner_video_url' }
        )}>
          <label>Logo</label>
          <input type="file" accept="image/*" onChange={e => setHomeData({...homeData, logo: e.target.files[0]})} />
          <label>Banner Media (Video/Image)</label>
          <input type="file" accept="video/*,image/*" onChange={e => setHomeData({...homeData, banner_video: e.target.files[0]})} />
          <input type="text" placeholder="Title on Banner" onChange={e => setHomeData({...homeData, banner_title: e.target.value})} />
          <textarea placeholder="Text under Title" onChange={e => setHomeData({...homeData, banner_text: e.target.value})} />
          <input type="text" placeholder="Founded Date/Text" onChange={e => setHomeData({...homeData, founded: e.target.value})} />
          <button type="submit" disabled={loading}>Save Home Data</button>
        </form>

        <h3>Our Expertise (Add 3 items one by one)</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'expertise', { identifier: expertiseData.identifier, title: expertiseData.title }, { file: expertiseData.file, bucket: 'home', columnName: 'image_url' })}>
          <input type="text" placeholder="Identifier (e.g., exp-1)" required onChange={e => setExpertiseData({...expertiseData, identifier: e.target.value})} />
          <input type="text" placeholder="Title" required onChange={e => setExpertiseData({...expertiseData, title: e.target.value})} />
          <input type="file" required onChange={e => setExpertiseData({...expertiseData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save Expertise Item</button>
        </form>

        <h3>Featured (Add 3 items one by one)</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'featured', { identifier: featuredData.identifier, title: featuredData.title }, { file: featuredData.file, bucket: 'home', columnName: 'image_url' })}>
          <input type="text" placeholder="Identifier (e.g., feat-1)" required onChange={e => setFeaturedData({...featuredData, identifier: e.target.value})} />
          <input type="text" placeholder="Title" required onChange={e => setFeaturedData({...featuredData, title: e.target.value})} />
          <input type="file" required onChange={e => setFeaturedData({...featuredData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save Featured Item</button>
        </form>

        <h3>Contact Info</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'contact_info', { identifier: contactData.identifier, email: contactData.email, phone: contactData.phone, location: contactData.location, insta: contactData.insta, fb: contactData.fb })}>
          <input type="email" placeholder="Email" onChange={e => setContactData({...contactData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" onChange={e => setContactData({...contactData, phone: e.target.value})} />
          <input type="text" placeholder="Location" onChange={e => setContactData({...contactData, location: e.target.value})} />
          <input type="text" placeholder="Instagram URL" onChange={e => setContactData({...contactData, insta: e.target.value})} />
          <input type="text" placeholder="Facebook URL" onChange={e => setContactData({...contactData, fb: e.target.value})} />
          <button type="submit" disabled={loading}>Save Contact Info</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>About Us</h2>
        <form onSubmit={(e) => handleSubmit(e, 'about_us', { identifier: aboutData.identifier, description: aboutData.description })}>
          <textarea placeholder="About description" required onChange={e => setAboutData({...aboutData, description: e.target.value})} />
          <button type="submit" disabled={loading}>Save About Text</button>
        </form>

        <h3>Team</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'team', { identifier: teamData.identifier, name: teamData.name, role: teamData.role }, { file: teamData.file, bucket: 'team', columnName: 'photo_url' })}>
          <input type="text" placeholder="Identifier (e.g., team-1)" required onChange={e => setTeamData({...teamData, identifier: e.target.value})} />
          <input type="text" placeholder="Name" required onChange={e => setTeamData({...teamData, name: e.target.value})} />
          <input type="text" placeholder="Role (e.g., Founder, Creative Director)" onChange={e => setTeamData({...teamData, role: e.target.value})} />
          <input type="file" accept="image/*" required onChange={e => setTeamData({...teamData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save Team Member</button>
        </form>

        <h3>Services</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'services', { identifier: serviceData.identifier, title: serviceData.title, tag: serviceData.tag, desc: serviceData.desc }, { file: serviceData.file, bucket: 'services', columnName: 'image_url' })}>
          <input type="text" placeholder="Identifier (e.g., serv-1)" required onChange={e => setServiceData({...serviceData, identifier: e.target.value})} />
          <input type="text" placeholder="Service Title" required onChange={e => setServiceData({...serviceData, title: e.target.value})} />
          <input type="text" placeholder="Category Tag (e.g., WEDDING, CORPORATE, BIRTHDAY)" onChange={e => setServiceData({...serviceData, tag: e.target.value})} />
          <textarea placeholder="Service Description" onChange={e => setServiceData({...serviceData, desc: e.target.value})} />
          <input type="file" accept="image/*" required onChange={e => setServiceData({...serviceData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save Service</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Packages</h2>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'packages', { identifier: packageData.identifier, pkg_name: packageData.pkg_name, f1: packageData.f1, f2: packageData.f2, f3: packageData.f3, f4: packageData.f4, price: packageData.price })}>
          <input type="text" placeholder="Identifier (e.g., pkg-1)" required onChange={e => setPackageData({...packageData, identifier: e.target.value})} />
          <input type="text" placeholder="Package Name" required onChange={e => setPackageData({...packageData, pkg_name: e.target.value})} />
          <input type="text" placeholder="Feature 1" onChange={e => setPackageData({...packageData, f1: e.target.value})} />
          <input type="text" placeholder="Feature 2" onChange={e => setPackageData({...packageData, f2: e.target.value})} />
          <input type="text" placeholder="Feature 3" onChange={e => setPackageData({...packageData, f3: e.target.value})} />
          <input type="text" placeholder="Feature 4" onChange={e => setPackageData({...packageData, f4: e.target.value})} />
          <input type="text" placeholder="Price" required onChange={e => setPackageData({...packageData, price: e.target.value})} />
          <button type="submit" disabled={loading}>Save Package</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Portfolio (Upload One by One)</h2>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'portfolio', { identifier: portfolioData.identifier, category: portfolioData.category, media_type: portfolioData.media_type,title: portfolioData.title }, { file: portfolioData.file, bucket: 'portfolio', columnName: 'media_url' })}>
          <input type="text" placeholder="Identifier (e.g., port-1)" required onChange={e => setPortfolioData({...portfolioData, identifier: e.target.value})} />
          <input type="text" placeholder="Title of the image" required onChange={e => setPortfolioData({...portfolioData, title: e.target.value})} />
          
          <select required defaultValue="" onChange={e => setPortfolioData({...portfolioData, category: e.target.value})}>
            <option value="" disabled>Select Category</option>
            <option value="wedding-planning">Wedding Planning</option>
            <option value="birthday-anniversary">Birthday & Anniversary</option>
            <option value="corporate-events">Corporate Events</option>
            <option value="decor-design">Decor & Design</option>
            <option value="catering-coordination">Catering Coordination</option>
            <option value="venue-selection">Venue Selection</option>
            <option value="entertainment-logistics">Entertainment & Logistics</option>
            <option value="photography-films">Photography & Films</option>
          </select>
          
          <select required defaultValue="image" onChange={e => setPortfolioData({...portfolioData, media_type: e.target.value})}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          
          <input type="file" required onChange={e => setPortfolioData({...portfolioData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save to Portfolio</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Testimonials</h2>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'testimonials', { identifier: testimonialData.identifier, name: testimonialData.name, comment: testimonialData.comment, stars: testimonialData.stars })}>
          <input type="text" placeholder="Identifier (e.g., test-1)" required onChange={e => setTestimonialData({...testimonialData, identifier: e.target.value})} />
          <input type="text" placeholder="Name" required onChange={e => setTestimonialData({...testimonialData, name: e.target.value})} />
          <textarea placeholder="Comment" required onChange={e => setTestimonialData({...testimonialData, comment: e.target.value})} />
          <input type="number" min="1" max="5" placeholder="Stars (1-5)" required onChange={e => setTestimonialData({...testimonialData, stars: parseInt(e.target.value)})} />
          <button type="submit" disabled={loading}>Save Testimonial</button>
        </form>

        <h3>Watch Their Experience</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'experiences', { identifier: experienceData.identifier, title: experienceData.title }, { file: experienceData.file, bucket: 'testimonials', columnName: 'video_url' })}>
          <input type="text" placeholder="Identifier" required onChange={e => setExperienceData({...experienceData, identifier: e.target.value})} />
          <input type="text" placeholder="Title" required onChange={e => setExperienceData({...experienceData, title: e.target.value})} />
          <input type="file" accept="video/*, image/*" required onChange={e => setExperienceData({...experienceData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save Experience Media</button>
        </form>

        <h3>Smiles We Created</h3>
        <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'smiles', { identifier: smileData.identifier }, { file: smileData.file, bucket: 'smiles', columnName: 'image_url' })}>
          <input type="text" placeholder="Identifier" required onChange={e => setSmileData({...smileData, identifier: e.target.value})} />
          <input type="file" accept="image/*" required onChange={e => setSmileData({...smileData, file: e.target.files[0]})} />
          <button type="submit" disabled={loading}>Save Smile Image</button>
        </form>
      </section>
    </div>
  );
}