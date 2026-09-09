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

const TABS = [
  { id: 'team', label: 'Team Members', icon: '👥' },
  { id: 'home', label: 'Home & Banner', icon: '🏠' },
  { id: 'about', label: 'About Us', icon: '📖' },
  { id: 'services', label: 'Services', icon: '💼' },
  { id: 'packages', label: 'Packages', icon: '📦' },
  { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
  { id: 'testimonials', label: 'Testimonials', icon: '⭐' },
  { id: 'contact', label: 'Contact Info', icon: '📞' },
  { id: 'all', label: 'Show All', icon: '📑' },
];

export default function ManagePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(!BYPASS_AUTH_FOR_DEV);
  const [isAuthorized, setIsAuthorized] = useState(BYPASS_AUTH_FOR_DEV);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && TABS.some(t => t.id === tabParam)) {
        return tabParam;
      }
    }
    return 'team';
  });

  // Verify auth if bypass is disabled
  useEffect(() => {
    if (BYPASS_AUTH_FOR_DEV) return;

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
    return () => { isMounted = false; };
  }, [router]);

  // Sync activeTab on browser back/forward history navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('tab');
      if (t && TABS.some(tab => tab.id === t)) {
        setActiveTab(t);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fluid Tab Change Handler: animates tab selection, updates URL, & scrolls smoothly into view
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState(null, '', url.toString());

      // Auto-scroll the clicked tab button into center of the tab bar
      const tabBtn = document.getElementById(`tab-btn-${tabId}`);
      if (tabBtn) {
        tabBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }

      // Smoothly reposition view to content area so user doesn't miss the top of the selected tab
      const contentAnchor = document.getElementById('manage-content-area');
      if (contentAnchor) {
        const targetTop = contentAnchor.getBoundingClientRect().top + window.scrollY - 140;
        if (window.scrollY > targetTop) {
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    }
  };

  // Section States
  const [homeData, setHomeData] = useState({ identifier: 'home_main', logo: null, banner_video: null, banner_title: '', banner_text: '', founded: '' });
  const [expertiseData, setExpertiseData] = useState({ identifier: '', title: '', file: null });
  const [featuredData, setFeaturedData] = useState({ identifier: '', title: '', file: null });
  const [contactData, setContactData] = useState({ identifier: 'contact_main', email: '', phone: '', location: '', insta: '', fb: '' });
  const [aboutData, setAboutData] = useState({ identifier: 'about_main', description: '' });
  const [teamList, setTeamList] = useState([]);
  const [teamData, setTeamData] = useState({ identifier: '', name: '', role: '', photo_url: '', file: null });
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamFilePreview, setTeamFilePreview] = useState('');
  const [serviceData, setServiceData] = useState({ identifier: '', title: '', tag: '', desc: '', file: null });
  const [packageData, setPackageData] = useState({ identifier: '', pkg_name: '', f1: '', f2: '', f3: '', f4: '', price: '' });
  const [portfolioData, setPortfolioData] = useState({ identifier: '', file: null, category: '', media_type: 'image', title: '' });
  const [testimonialData, setTestimonialData] = useState({ identifier: '', name: '', comment: '', stars: 5 });
  const [experienceData, setExperienceData] = useState({ identifier: '', title: '', file: null });
  const [smileData, setSmileData] = useState({ identifier: '', file: null });

  // Compression helper tailored for WebP and dynamic sizing
  const compressImage = async (file, isThumbnail = false) => {
    if (!file || !file.type.startsWith('image/')) return file;
    const options = {
      maxSizeMB: isThumbnail ? 0.1 : 1.5,
      maxWidthOrHeight: isThumbnail ? 600 : 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    };
    try {
      const compressedBlob = await imageCompression(file, options);
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

        if (table === 'portfolio' && fileInfo.file.type.startsWith('image/')) {
          const originalFile = await compressImage(fileInfo.file, false);
          const thumbnailFile = await compressImage(fileInfo.file, true);
          const originalUrl = await uploadToR2(originalFile, fileInfo.bucket);
          const thumbnailUrl = await uploadToR2(thumbnailFile, fileInfo.bucket);
          finalPayload[fileInfo.columnName] = originalUrl;
          finalPayload['thumbnail_url'] = thumbnailUrl;
        } else if (fileInfo.file.type.startsWith('image/')) {
          const compressedFile = await compressImage(fileInfo.file, false);
          const fileUrl = await uploadToR2(compressedFile, fileInfo.bucket);
          finalPayload[fileInfo.columnName] = fileUrl;
        } else if (fileInfo.file.type.startsWith('video/')) {
          if (fileInfo.file.size > 50 * 1024 * 1024) {
            throw new Error("Video exceeds 50MB limit. Please compress before uploading.");
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

      alert(`${table.replace('_', ' ').toUpperCase()} updated successfully!`);
    } catch (error) {
      alert(`Error updating ${table}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Team Management Handlers
  const loadTeamList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=team');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTeamList(data.data);
      }
    } catch (err) {
      console.error('Failed to load team list:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchTeam() {
      try {
        const res = await fetch('/api/cms/list?table=team');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setTeamList(data.data);
        }
      } catch (err) {
        console.error('Failed to load team list:', err);
      }
    }
    fetchTeam();
    return () => { isMounted = false; };
  }, []);

  const handleEditTeamMember = (member) => {
    setIsEditingTeam(true);
    setTeamData({
      identifier: member.identifier,
      name: member.name || '',
      role: member.role || '',
      photo_url: member.photo_url || '',
      file: null
    });
    setTeamFilePreview(member.photo_url || '');
  };

  const handleCancelTeamEdit = () => {
    setIsEditingTeam(false);
    setTeamData({
      identifier: '',
      name: '',
      role: '',
      photo_url: '',
      file: null
    });
    setTeamFilePreview('');
  };

  const handleDeleteTeamMember = async (identifier, name) => {
    if (!confirm(`Are you sure you want to delete team member "${name || identifier}"?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'team', identifier })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }
      alert(`Deleted "${name || identifier}" successfully!`);
      await loadTeamList();
      if (teamData.identifier === identifier) {
        handleCancelTeamEdit();
      }
    } catch (err) {
      alert(`Error deleting team member: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamData.identifier.trim()) {
      alert('Identifier is required (e.g. team-1)');
      return;
    }
    if (!teamData.name.trim()) {
      alert('Name is required');
      return;
    }

    const payload = {
      identifier: teamData.identifier.trim(),
      name: teamData.name.trim(),
      role: teamData.role.trim(),
      ...(teamData.photo_url ? { photo_url: teamData.photo_url } : {})
    };

    const fileData = teamData.file ? { file: teamData.file, bucket: 'team', columnName: 'photo_url' } : null;

    await handleSubmit(e, 'team', payload, fileData);
    await loadTeamList();
    handleCancelTeamEdit();
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
      {/* Dev Preview Banner */}
      {BYPASS_AUTH_FOR_DEV && (
        <div className={styles.devBanner}>
          <div>
            <span className={styles.devBadge}>DEV PREVIEW</span>
            <strong style={{ color: '#7b1a28' }}>Admin CMS Active</strong>
          </div>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>
            Say <em>&quot;hide admin behind login&quot;</em> to lock.
          </span>
        </div>
      )}

      {/* Clean Dashboard Top Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.dashboardTitle}>Website Content Manager</h1>
          <p className={styles.dashboardSubtitle}>
            Live Database & Cloudflare R2 Media Management
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.adminChip}>
            <span>👤</span>
            <span>Administrator</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/admin');
            }}
            className={styles.logoutBtn}
            title="Sign out of Admin CMS"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Fluid Sticky Category Navigation Tabs */}
      <div className={styles.tabBarStickyWrapper}>
        <nav className={styles.tabBar} aria-label="CMS Sections Navigation">
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'team' && (
                <span
                  className={styles.tabCountBadge}
                  style={{
                    background: activeTab === 'team' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
                    color: activeTab === 'team' ? '#7b1a28' : '#7b1a28',
                  }}
                >
                  {teamList.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Fluid Animated Content Area */}
      <div key={activeTab} className={styles.tabContentPanel} id="manage-content-area">

        {/* 1. TEAM MEMBERS SECTION */}
        {(activeTab === 'team' || activeTab === 'all') && (
          <section className={styles.section} id="section-team">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Team Members Management
              </h2>
              <span className={styles.badge} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {teamList.length} Active Member{teamList.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className={styles.teamSectionSplit}>
              {/* Left Column: Live Team Cards */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <strong style={{ color: '#7b1a28', fontSize: '1.02rem' }}>Current Team Cards</strong>
                  {!isEditingTeam && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextId = `team-${teamList.length + 1}`;
                        setTeamData({ identifier: nextId, name: '', role: '', photo_url: '', file: null });
                        setTeamFilePreview('');
                      }}
                      className={styles.addBtn}
                    >
                      + New Member (Auto ID)
                    </button>
                  )}
                </div>

                {teamList.length > 0 ? (
                  <div className={styles.teamListStack}>
                    {teamList.map((member) => (
                      <div
                        key={member.identifier}
                        className={`${styles.teamItemCard} ${teamData.identifier === member.identifier && isEditingTeam ? styles.teamItemCardActive : ''}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photo_url || '/logo.png'}
                          alt={member.name || 'Team member'}
                          className={styles.teamPhotoThumb}
                          onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                        />
                        <div className={styles.teamMeta}>
                          <div className={styles.teamName}>{member.name || 'Unnamed'}</div>
                          <div className={styles.teamRole}>{member.role || 'No role'}</div>
                          <span className={styles.badge}>{member.identifier}</span>
                        </div>
                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => handleEditTeamMember(member)}
                            title="Edit details"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteTeamMember(member.identifier, member.name)}
                            title="Delete member"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic', margin: '14px 0' }}>
                    No team members in database yet. Add one using the form on the right.
                  </p>
                )}
              </div>

              {/* Right Column: Add/Edit Form */}
              <div>
                <form className={styles.group} onSubmit={handleTeamSubmit} style={{ marginTop: 0 }}>
                  {isEditingTeam ? (
                    <div className={styles.modeNotice}>
                      <span>✏️ Editing: <strong>{teamData.name || teamData.identifier}</strong></span>
                      <button type="button" className={styles.cancelBtn} onClick={handleCancelTeamEdit}>
                        Cancel Edit
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontWeight: 700, color: '#7b1a28', marginBottom: '14px', fontSize: '1.02rem', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '6px' }}>
                      Add / Update Team Member
                    </div>
                  )}

                  <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                      <label>Identifier (e.g., team-1)</label>
                      <input
                        type="text"
                        placeholder="Identifier (e.g., team-1)"
                        value={teamData.identifier}
                        required
                        readOnly={isEditingTeam}
                        style={isEditingTeam ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                        onChange={e => setTeamData({ ...teamData, identifier: e.target.value })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={teamData.name}
                        required
                        onChange={e => setTeamData({ ...teamData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Role / Designation</label>
                    <input
                      type="text"
                      placeholder="Role (e.g., Founder, Head, Creative Director)"
                      value={teamData.role}
                      onChange={e => setTeamData({ ...teamData, role: e.target.value })}
                    />
                  </div>

                  {teamFilePreview && (
                    <div className={styles.previewBox}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={teamFilePreview} alt="Preview" className={styles.previewThumb} />
                      <div className={styles.previewText}>
                        <strong>{teamData.file ? 'Selected New Photo' : 'Current Photo'}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#666' }}>
                          {teamData.file ? teamData.file.name : 'Saved in Cloudflare R2'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.fieldGroup}>
                    <label>
                      {teamData.photo_url || isEditingTeam
                        ? 'Replace Photo (Optional — leave empty to keep current)'
                        : 'Photo (Required for new member)'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required={!teamData.photo_url && !isEditingTeam}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setTeamData({ ...teamData, file });
                          setTeamFilePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                      {loading ? 'Saving to Database & R2...' : isEditingTeam ? 'Update Team Member' : 'Save Team Member'}
                    </button>
                    {isEditingTeam && (
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={handleCancelTeamEdit}
                        style={{ width: 'auto', padding: '0 16px', marginTop: '8px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* 2. HOME PAGE MAIN & BANNER */}
        {(activeTab === 'home' || activeTab === 'all') && (
          <section className={styles.section} id="section-home">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Home Page Main & Banner
              </h2>
            </div>
            <form onSubmit={(e) => handleSubmit(
              e, 'home_content', 
              { identifier: homeData.identifier, banner_title: homeData.banner_title, banner_text: homeData.banner_text, founded: homeData.founded },
              { file: homeData.logo, bucket: 'home', columnName: 'logo_url' },
              { file: homeData.banner_video, bucket: 'home', columnName: 'banner_video_url' }
            )}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Logo File</label>
                  <input type="file" accept="image/*" onChange={e => setHomeData({...homeData, logo: e.target.files[0]})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Banner Media (Video/Image)</label>
                  <input type="file" accept="video/*,image/*" onChange={e => setHomeData({...homeData, banner_video: e.target.files[0]})} />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Banner Title</label>
                  <input type="text" placeholder="Title on Banner" onChange={e => setHomeData({...homeData, banner_title: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Founded Year / Text</label>
                  <input type="text" placeholder="e.g. Established 2017" onChange={e => setHomeData({...homeData, founded: e.target.value})} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Text Under Title</label>
                <textarea placeholder="Supporting text under main banner heading" onChange={e => setHomeData({...homeData, banner_text: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Home Data</button>
            </form>

            <h3 className={styles.subSectionTitle}>Our Expertise (Add Item)</h3>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'expertise', { identifier: expertiseData.identifier, title: expertiseData.title }, { file: expertiseData.file, bucket: 'home', columnName: 'image_url' })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g., exp-1" required onChange={e => setExpertiseData({...expertiseData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Expertise Title</label>
                  <input type="text" placeholder="e.g. Royal Stage Decor" required onChange={e => setExpertiseData({...expertiseData, title: e.target.value})} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label>Media File</label>
                <input type="file" required onChange={e => setExpertiseData({...expertiseData, file: e.target.files[0]})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Expertise Item</button>
            </form>

            <h3 className={styles.subSectionTitle}>Featured Showcase (Add Item)</h3>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'featured', { identifier: featuredData.identifier, title: featuredData.title }, { file: featuredData.file, bucket: 'home', columnName: 'image_url' })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g., feat-1" required onChange={e => setFeaturedData({...featuredData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Featured Title</label>
                  <input type="text" placeholder="e.g. The Grand Sangeet Gala" required onChange={e => setFeaturedData({...featuredData, title: e.target.value})} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label>Media File</label>
                <input type="file" required onChange={e => setFeaturedData({...featuredData, file: e.target.files[0]})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Featured Item</button>
            </form>
          </section>
        )}

        {/* 3. ABOUT US */}
        {(activeTab === 'about' || activeTab === 'all') && (
          <section className={styles.section} id="section-about">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                About Us Description
              </h2>
            </div>
            <form onSubmit={(e) => handleSubmit(e, 'about_us', { identifier: aboutData.identifier, description: aboutData.description })}>
              <div className={styles.fieldGroup}>
                <label>Main Brand Story / Description</label>
                <textarea
                  placeholder="Enter the full About Us story describing Raj Hans Events heritage, experience, and bespoke celebrations..."
                  required
                  rows={6}
                  onChange={e => setAboutData({...aboutData, description: e.target.value})}
                />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save About Text</button>
            </form>
          </section>
        )}

        {/* 4. SERVICES */}
        {(activeTab === 'services' || activeTab === 'all') && (
          <section className={styles.section} id="section-services">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Services
              </h2>
            </div>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'services', { identifier: serviceData.identifier, title: serviceData.title, tag: serviceData.tag, desc: serviceData.desc }, { file: serviceData.file, bucket: 'services', columnName: 'image_url' })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g., serv-1" required onChange={e => setServiceData({...serviceData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Service Title</label>
                  <input type="text" placeholder="e.g. Royal Wedding Planning" required onChange={e => setServiceData({...serviceData, title: e.target.value})} />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Category Tag</label>
                  <input type="text" placeholder="e.g. WEDDING, CORPORATE, BIRTHDAY" onChange={e => setServiceData({...serviceData, tag: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Cover Image</label>
                  <input type="file" accept="image/*" required onChange={e => setServiceData({...serviceData, file: e.target.files[0]})} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Service Description</label>
                <textarea placeholder="Detailed description of what this service covers..." onChange={e => setServiceData({...serviceData, desc: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Service</button>
            </form>
          </section>
        )}

        {/* 5. PACKAGES */}
        {(activeTab === 'packages' || activeTab === 'all') && (
          <section className={styles.section} id="section-packages">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Curated Packages
              </h2>
            </div>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'packages', { identifier: packageData.identifier, pkg_name: packageData.pkg_name, f1: packageData.f1, f2: packageData.f2, f3: packageData.f3, f4: packageData.f4, price: packageData.price })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g., pkg-1" required onChange={e => setPackageData({...packageData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Package Name</label>
                  <input type="text" placeholder="e.g. The Imperial Royal Package" required onChange={e => setPackageData({...packageData, pkg_name: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Price Display</label>
                  <input type="text" placeholder="e.g. ₹5,00,000 / Custom Quote" required onChange={e => setPackageData({...packageData, price: e.target.value})} />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Feature 1</label>
                  <input type="text" placeholder="Feature 1" onChange={e => setPackageData({...packageData, f1: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Feature 2</label>
                  <input type="text" placeholder="Feature 2" onChange={e => setPackageData({...packageData, f2: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Feature 3</label>
                  <input type="text" placeholder="Feature 3" onChange={e => setPackageData({...packageData, f3: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Feature 4</label>
                  <input type="text" placeholder="Feature 4" onChange={e => setPackageData({...packageData, f4: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Package</button>
            </form>
          </section>
        )}

        {/* 6. PORTFOLIO */}
        {(activeTab === 'portfolio' || activeTab === 'all') && (
          <section className={styles.section} id="section-portfolio">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Portfolio Gallery (Upload Media)
              </h2>
            </div>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'portfolio', { identifier: portfolioData.identifier, category: portfolioData.category, media_type: portfolioData.media_type, title: portfolioData.title }, { file: portfolioData.file, bucket: 'portfolio', columnName: 'media_url' })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g., port-1" required onChange={e => setPortfolioData({...portfolioData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Title</label>
                  <input type="text" placeholder="e.g. Royal Mandap Elegance" required onChange={e => setPortfolioData({...portfolioData, title: e.target.value})} />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Category</label>
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
                </div>
                <div className={styles.fieldGroup}>
                  <label>Media Type</label>
                  <select required defaultValue="image" onChange={e => setPortfolioData({...portfolioData, media_type: e.target.value})}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Media File</label>
                <input type="file" required onChange={e => setPortfolioData({...portfolioData, file: e.target.files[0]})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save to Portfolio</button>
            </form>
          </section>
        )}

        {/* 7. TESTIMONIALS & CLIENT MEDIA */}
        {(activeTab === 'testimonials' || activeTab === 'all') && (
          <section className={styles.section} id="section-testimonials">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Testimonials & Client Media
              </h2>
            </div>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'testimonials', { identifier: testimonialData.identifier, name: testimonialData.name, comment: testimonialData.comment, stars: testimonialData.stars })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g., test-1" required onChange={e => setTestimonialData({...testimonialData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Client Name</label>
                  <input type="text" placeholder="e.g. Rajesh & Priya Sharma" required onChange={e => setTestimonialData({...testimonialData, name: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Rating (1 to 5 Stars)</label>
                  <input type="number" min="1" max="5" placeholder="5" required onChange={e => setTestimonialData({...testimonialData, stars: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Client Review / Comment</label>
                <textarea placeholder="What the client said about their royal celebration experience..." required onChange={e => setTestimonialData({...testimonialData, comment: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Testimonial</button>
            </form>

            <h3 className={styles.subSectionTitle}>Client Video Experiences</h3>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'experiences', { identifier: experienceData.identifier, title: experienceData.title }, { file: experienceData.file, bucket: 'testimonials', columnName: 'video_url' })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g. exp-video-1" required onChange={e => setExperienceData({...experienceData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Video Title</label>
                  <input type="text" placeholder="e.g. The Royal Ranchi Wedding" required onChange={e => setExperienceData({...experienceData, title: e.target.value})} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label>Video / Media File</label>
                <input type="file" accept="video/*, image/*" required onChange={e => setExperienceData({...experienceData, file: e.target.files[0]})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Experience Media</button>
            </form>

            <h3 className={styles.subSectionTitle}>Smiles We Created (Images)</h3>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'smiles', { identifier: smileData.identifier }, { file: smileData.file, bucket: 'smiles', columnName: 'image_url' })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Identifier</label>
                  <input type="text" placeholder="e.g. smile-1" required onChange={e => setSmileData({...smileData, identifier: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Photo File</label>
                  <input type="file" accept="image/*" required onChange={e => setSmileData({...smileData, file: e.target.files[0]})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Smile Image</button>
            </form>
          </section>
        )}

        {/* 8. CONTACT INFORMATION */}
        {(activeTab === 'contact' || activeTab === 'all') && (
          <section className={styles.section} id="section-contact">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Contact Information
              </h2>
            </div>
            <form className={styles.group} onSubmit={(e) => handleSubmit(e, 'contact_info', { identifier: contactData.identifier, email: contactData.email, phone: contactData.phone, location: contactData.location, insta: contactData.insta, fb: contactData.fb })}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="rajhanshevent@gmail.com" onChange={e => setContactData({...contactData, email: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 90060 89331" onChange={e => setContactData({...contactData, phone: e.target.value})} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Office / Venue Location</label>
                <input type="text" placeholder="Ranchi, Jharkhand 834001, India" onChange={e => setContactData({...contactData, location: e.target.value})} />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Instagram URL</label>
                  <input type="text" placeholder="https://instagram.com/rajhanshevent" onChange={e => setContactData({...contactData, insta: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Facebook URL</label>
                  <input type="text" placeholder="https://facebook.com/rajhanshevent" onChange={e => setContactData({...contactData, fb: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>Save Contact Info</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}