'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToR2 } from '../../utils/r2Upload';
import styles from './Manage.module.css';
import imageCompression from 'browser-image-compression';

const TABS = [
  { id: 'enquiries', label: 'Enquiries', icon: '✉️' },
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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
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

  // Verify administrator session
  useEffect(() => {
    let isMounted = true;
    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
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
        if (isMounted) router.push('/admin?error=unauthorized');
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

  // Helper to check if a URL points to video media
  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.(mp4|webm|mov|ogg)($|\?)/i.test(url) || url.includes('/video');
  };

  // Section States
  // Enquiries & Resend Email Services State
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState(null);
  const [enquirySearch, setEnquirySearch] = useState('');

  const [homeData, setHomeData] = useState({
    identifier: 'home_main',
    logo: null,
    logo_url: '',
    slide_1_file: null,
    slide_1_url: '',
    slide_2_file: null,
    slide_2_url: '',
    slide_3_file: null,
    slide_3_url: '',
    slide_4_file: null,
    slide_4_url: '',
    banner_video: null,
    banner_video_url: '',
    banner_title: '',
    banner_text: '',
    founded: '',
  });
  const [homeLogoPreview, setHomeLogoPreview] = useState('');
  const [slidePreviews, setSlidePreviews] = useState({ 1: '', 2: '', 3: '', 4: '' });

  const [expertiseList, setExpertiseList] = useState([]);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState(null);
  const [expertiseData, setExpertiseData] = useState({ identifier: '', title: '', story: '', image_url: '', file: null });
  const [expertiseFilePreview, setExpertiseFilePreview] = useState('');
  const [expertiseGalleryImages, setExpertiseGalleryImages] = useState([]);
  const [expertiseGalleryUploadFiles, setExpertiseGalleryUploadFiles] = useState([]);
  const [expertiseGalleryUploading, setExpertiseGalleryUploading] = useState(false);

  // Featured Showcase State
  const [featuredList, setFeaturedList] = useState([]);
  const [selectedFeaturedId, setSelectedFeaturedId] = useState(null);
  const [featuredFilePreview, setFeaturedFilePreview] = useState('');
  const [featuredData, setFeaturedData] = useState({ identifier: '', title: '', file: null, image_url: '' });

  // Contact & About Us
  const [contactData, setContactData] = useState({ identifier: 'contact_main', email: '', phone: '', location: '', insta: '', fb: '' });
  const [aboutData, setAboutData] = useState({
    identifier: 'about_main',
    description: '',
    image_url: '',
    brochure_url: '',
    image_file: null,
    brochure_file: null,
  });
  const [aboutImagePreview, setAboutImagePreview] = useState('');
  const [aboutBrochureName, setAboutBrochureName] = useState('');

  // Team
  const [teamList, setTeamList] = useState([]);
  const [teamData, setTeamData] = useState({ identifier: '', name: '', role: '', photo_url: '', file: null });
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamFilePreview, setTeamFilePreview] = useState('');

  // Services
  const [servicesList, setServicesList] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceFilePreview, setServiceFilePreview] = useState('');
  const [serviceData, setServiceData] = useState({ identifier: '', title: '', tag: '', desc: '', file: null, image_url: '' });

  // Packages
  const [packagesList, setPackagesList] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [packageData, setPackageData] = useState({ identifier: '', pkg_name: '', f1: '', f2: '', f3: '', f4: '', price: '' });

  // Portfolio & Luxury Gallery
  const [portfolioList, setPortfolioList] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [portfolioFilePreview, setPortfolioFilePreview] = useState('');
  const [portfolioGalleryImages, setPortfolioGalleryImages] = useState([]);
  const [galleryUploadFiles, setGalleryUploadFiles] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    id: null,
    identifier: '',
    file: null,
    category: '',
    media_type: 'image',
    title: '',
    story: '',
    media_url: '',
  });

  // Testimonials
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState(null);
  const [testimonialData, setTestimonialData] = useState({ identifier: '', name: '', comment: '', stars: 5 });

  // Experiences (Video stories)
  const [experiencesList, setExperiencesList] = useState([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [experienceFilePreview, setExperienceFilePreview] = useState('');
  const [experienceData, setExperienceData] = useState({ identifier: '', title: '', file: null, video_url: '' });

  // Smiles
  const [smilesList, setSmilesList] = useState([]);
  const [smileFilePreview, setSmileFilePreview] = useState('');
  const [smileData, setSmileData] = useState({ identifier: '', file: null });

  // Universal Helper to generate the next guaranteed-unique Auto ID for any list
  const getNextAutoId = (prefix, list) => {
    const existingIds = new Set(
      (list || [])
        .map(item => (typeof item === 'string' ? item : item?.identifier || ''))
        .filter(Boolean)
    );

    let maxNum = 0;
    const regex = new RegExp(`^${prefix}[-_]?(\\d+)$`, 'i');

    for (const id of existingIds) {
      const match = id.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }

    let nextNum = maxNum > 0 ? maxNum + 1 : (existingIds.size + 1 || 1);
    let candidate = `${prefix}-${nextNum}`;

    while (existingIds.has(candidate)) {
      nextNum++;
      candidate = `${prefix}-${nextNum}`;
    }

    return candidate;
  };

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

  // Universal Submit Handler supporting variable file arguments
  const handleSubmit = async (e, table, payload, ...fileArgs) => {
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
        } else {
          // Documents (e.g. Brochure PDF/DOC) or other allowed asset types
          const fileUrl = await uploadToR2(fileInfo.file, fileInfo.bucket);
          finalPayload[fileInfo.columnName] = fileUrl;
        }
      };

      for (const arg of fileArgs) {
        if (!arg) continue;
        if (Array.isArray(arg)) {
          for (const item of arg) {
            await processFileUpload(item);
          }
        } else {
          await processFileUpload(arg);
        }
      }

      // Synchronize legacy banner_video_url with slide_1_url if slide 1 is updated
      if (finalPayload.slide_1_url) {
        finalPayload.banner_video_url = finalPayload.slide_1_url;
      }

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
      if (table === 'portfolio') {
        await loadPortfolioList();
      }
      if (table === 'expertise') {
        await loadExpertiseList();
        if (finalPayload.identifier) {
          setSelectedExpertiseId(finalPayload.identifier);
          await loadExpertiseGalleryImages(finalPayload.identifier);
        }
      }
      if (table === 'featured') {
        await loadFeaturedList();
        setSelectedFeaturedId(finalPayload.identifier);
      }
      if (table === 'services') {
        await loadServicesList();
        setSelectedServiceId(finalPayload.identifier);
      }
      if (table === 'packages') {
        await loadPackagesList();
        setSelectedPackageId(finalPayload.identifier);
      }
      if (table === 'testimonials') {
        await loadTestimonialsList();
        setSelectedTestimonialId(finalPayload.identifier);
      }
      if (table === 'experiences') {
        await loadExperiencesList();
        setSelectedExperienceId(finalPayload.identifier);
      }
      if (table === 'smiles') {
        await loadSmilesList();
        setSmileFilePreview('');
        const smileInput = document.getElementById('smile-file-input');
        if (smileInput) smileInput.value = '';
        const resList = await fetch('/api/cms/list?table=smiles');
        const listData = await resList.json();
        if (listData.success && Array.isArray(listData.data)) {
          setSmileData({ identifier: getNextAutoId('smile', listData.data), file: null });
        } else {
          setSmileData({ identifier: '', file: null });
        }
      }
      if (table === 'about_us') await loadAboutData();
      if (table === 'contact_info') await loadContactData();
    } catch (error) {
      alert(`Error updating ${table}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Unified Deletion Handler for any table record
  const handleDeleteRecord = async (table, identifier, label, onSuccess) => {
    if (!identifier) return;
    if (!confirm(`Are you sure you want to delete ${label || identifier}? This will permanently remove the record from the database and delete associated media files from storage.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, identifier }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }
      alert(`Deleted ${label || identifier} successfully from database & storage.`);
      if (onSuccess) await onSuccess();
    } catch (err) {
      alert(`Error deleting: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear Individual Slide from Home Content & R2
  const handleClearSlide = async (slotNumber, slideKey) => {
    if (!confirm(`Are you sure you want to clear Slide ${slotNumber} and delete its media file from storage?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'home_content', identifier: homeData.identifier || 'home_main', slideKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to clear slide');
      alert(`Slide ${slotNumber} cleared and media file removed successfully.`);
      setSlidePreviews(prev => ({ ...prev, [slotNumber]: '' }));
      setHomeData(prev => ({
        ...prev,
        [slideKey]: '',
        [`slide_${slotNumber}_file`]: null,
        ...(slotNumber === 1 ? { banner_video_url: '' } : {})
      }));
      await loadHomeData();
    } catch (err) {
      alert(`Error clearing slide: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear Brand Logo
  const handleClearLogo = async () => {
    if (!confirm('Are you sure you want to remove the brand logo and delete its file from storage?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'home_content', identifier: homeData.identifier || 'home_main', slideKey: 'logo_url' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to clear logo');
      alert('Brand logo cleared and media file removed successfully.');
      setHomeLogoPreview('');
      setHomeData(prev => ({ ...prev, logo: null, logo_url: '' }));
      await loadHomeData();
    } catch (err) {
      alert(`Error clearing logo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear About Section Media (Image or Brochure file) from Database & R2
  const handleClearAboutMedia = async (columnKey, label) => {
    if (!confirm(`Are you sure you want to remove the ${label || columnKey} and permanently delete its file from storage?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'about_us',
          identifier: aboutData.identifier || 'about_main',
          columnKey,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || `Failed to clear ${label}`);
      alert(`${label} cleared and file removed from storage successfully.`);
      if (columnKey === 'image_url') {
        setAboutImagePreview('');
        setAboutData(prev => ({ ...prev, image_url: '', image_file: null }));
        const input = document.getElementById('about-image-input');
        if (input) input.value = '';
      }
      if (columnKey === 'brochure_url') {
        setAboutBrochureName('');
        setAboutData(prev => ({ ...prev, brochure_url: '', brochure_file: null }));
        const input = document.getElementById('about-brochure-input');
        if (input) input.value = '';
      }
      await loadAboutData();
    } catch (err) {
      alert(`Error clearing ${label}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Enquiries & Resend Email Handlers
  const loadEnquiriesList = async () => {
    try {
      const res = await fetch('/api/enquiry');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEnquiriesList(data.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailStatus(null);
    try {
      const res = await fetch('/api/email/test', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to dispatch test email');
      }
      setTestEmailStatus({
        success: true,
        message: `✅ Test email successfully dispatched via Resend to ${json.data?.to || 'admin inbox'}! Please check your email inbox.`,
      });
    } catch (err) {
      setTestEmailStatus({
        success: false,
        message: `❌ Resend test failed: ${err.message}`,
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleDeleteEnquiry = async (id, clientName) => {
    if (!confirm(`Are you sure you want to delete enquiry #${id} from "${clientName || 'Client'}"?`)) return;
    try {
      const res = await fetch(`/api/enquiry?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete enquiry');
      }
      setEnquiriesList(prev => prev.filter(e => e.id !== id));
      alert(`Enquiry #${id} deleted successfully.`);
    } catch (err) {
      alert(`Error deleting enquiry: ${err.message}`);
    }
  };

  // Home Page Management Handlers
  const loadHomeData = async () => {
    try {
      const res = await fetch('/api/cms/list?table=home_content');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const home = data.data.find(h => h.identifier === 'home_main') || data.data[0];
        setHomeData(prev => ({
          ...prev,
          identifier: home.identifier || 'home_main',
          banner_title: home.banner_title || '',
          banner_text: home.banner_text || '',
          founded: home.founded || '',
          banner_video_url: home.banner_video_url || '',
          slide_1_url: home.slide_1_url || home.banner_video_url || '',
          slide_2_url: home.slide_2_url || '',
          slide_3_url: home.slide_3_url || '',
          slide_4_url: home.slide_4_url || '',
          logo_url: home.logo_url || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load home data:', err);
    }
  };

  // Featured Showcase Handlers
  const loadFeaturedList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=featured');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setFeaturedList(data.data);
    } catch (err) {
      console.error('Failed to load featured items:', err);
    }
  };

  const handleSelectFeatured = (e) => {
    const val = e.target.value;
    if (!val || val === 'new') {
      setSelectedFeaturedId(null);
      setFeaturedData({
        identifier: getNextAutoId('feat', featuredList),
        title: '',
        file: null,
        image_url: ''
      });
      setFeaturedFilePreview('');
      return;
    }
    const item = featuredList.find(f => f.identifier === val);
    if (item) {
      setSelectedFeaturedId(item.identifier);
      setFeaturedData({
        identifier: item.identifier || '',
        title: item.title || '',
        file: null,
        image_url: item.image_url || '',
      });
      setFeaturedFilePreview(item.image_url || '');
    }
  };

  // Services Handlers
  const loadServicesList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=services');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setServicesList(data.data);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  const handleSelectService = (e) => {
    const val = e.target.value;
    if (!val || val === 'new') {
      setSelectedServiceId(null);
      setServiceData({
        identifier: getNextAutoId('srv', servicesList),
        title: '',
        tag: '',
        desc: '',
        file: null,
        image_url: ''
      });
      setServiceFilePreview('');
      return;
    }
    const item = servicesList.find(s => s.identifier === val);
    if (item) {
      setSelectedServiceId(item.identifier);
      setServiceData({
        identifier: item.identifier || '',
        title: item.title || '',
        tag: item.tag || '',
        desc: item.desc || '',
        file: null,
        image_url: item.image_url || '',
      });
      setServiceFilePreview(item.image_url || '');
    }
  };

  // Packages Handlers
  const loadPackagesList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=packages');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setPackagesList(data.data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    }
  };

  const handleSelectPackage = (e) => {
    const val = e.target.value;
    if (!val || val === 'new') {
      setSelectedPackageId(null);
      setPackageData({
        identifier: getNextAutoId('pkg', packagesList),
        pkg_name: '',
        f1: '',
        f2: '',
        f3: '',
        f4: '',
        price: ''
      });
      return;
    }
    const item = packagesList.find(p => p.identifier === val);
    if (item) {
      setSelectedPackageId(item.identifier);
      setPackageData({
        identifier: item.identifier || '',
        pkg_name: item.pkg_name || '',
        f1: item.f1 || '',
        f2: item.f2 || '',
        f3: item.f3 || '',
        f4: item.f4 || '',
        price: item.price || '',
      });
    }
  };

  // Testimonials Handlers
  const loadTestimonialsList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=testimonials');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setTestimonialsList(data.data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  };

  const handleSelectTestimonial = (e) => {
    const val = e.target.value;
    if (!val || val === 'new') {
      setSelectedTestimonialId(null);
      setTestimonialData({
        identifier: getNextAutoId('rev', testimonialsList),
        name: '',
        comment: '',
        stars: 5
      });
      return;
    }
    const item = testimonialsList.find(t => t.identifier === val);
    if (item) {
      setSelectedTestimonialId(item.identifier);
      setTestimonialData({
        identifier: item.identifier || '',
        name: item.name || '',
        comment: item.comment || '',
        stars: item.stars || 5,
      });
    }
  };

  // Experiences Handlers
  const loadExperiencesList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=experiences');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setExperiencesList(data.data);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    }
  };

  const handleSelectExperience = (e) => {
    const val = e.target.value;
    if (!val || val === 'new') {
      setSelectedExperienceId(null);
      setExperienceData({
        identifier: getNextAutoId('exp-video', experiencesList),
        title: '',
        file: null,
        video_url: ''
      });
      setExperienceFilePreview('');
      return;
    }
    const item = experiencesList.find(ex => ex.identifier === val);
    if (item) {
      setSelectedExperienceId(item.identifier);
      setExperienceData({
        identifier: item.identifier || '',
        title: item.title || '',
        file: null,
        video_url: item.video_url || '',
      });
      setExperienceFilePreview(item.video_url || '');
    }
  };

  // Smiles Handlers
  const loadSmilesList = async () => {
    try {
      const res = await fetch('/api/cms/list?table=smiles');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setSmilesList(data.data);
    } catch (err) {
      console.error('Failed to load smiles:', err);
    }
  };

  // About & Contact Handlers
  const loadAboutData = async () => {
    try {
      const res = await fetch('/api/cms/list?table=about_us');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const item = data.data.find(a => a.identifier === 'about_main') || data.data[0];
        setAboutData({
          identifier: item.identifier || 'about_main',
          description: item.description || '',
          image_url: item.image_url || '',
          brochure_url: item.brochure_url || '',
          image_file: null,
          brochure_file: null,
        });
        setAboutImagePreview('');
        setAboutBrochureName('');
        const imgInput = document.getElementById('about-image-input');
        if (imgInput) imgInput.value = '';
        const docInput = document.getElementById('about-brochure-input');
        if (docInput) docInput.value = '';
      }
    } catch (err) {
      console.error('Failed to load about data:', err);
    }
  };

  const loadContactData = async () => {
    try {
      const res = await fetch('/api/cms/list?table=contact_info');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const item = data.data.find(c => c.identifier === 'contact_main') || data.data[0];
        setContactData({
          identifier: item.identifier || 'contact_main',
          email: item.email || '',
          phone: item.phone || '',
          location: item.location || '',
          insta: item.insta || '',
          fb: item.fb || '',
        });
      }
    } catch (err) {
      console.error('Failed to load contact data:', err);
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

  // Portfolio & Gallery Handlers
  const loadPortfolioList = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setPortfolioList(data.data);
      }
    } catch (err) {
      console.error('Failed to load portfolio list:', err);
    }
  };

  const loadGalleryImages = async (eventId) => {
    if (!eventId) {
      setPortfolioGalleryImages([]);
      return;
    }
    try {
      const res = await fetch(`/api/cms/gallery?event_id=${eventId}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setPortfolioGalleryImages(data.data);
      } else {
        setPortfolioGalleryImages([]);
      }
    } catch (err) {
      console.error('Failed to load gallery images:', err);
      setPortfolioGalleryImages([]);
    }
  };

  const handleSelectPortfolioEvent = (e) => {
    const selectedId = e.target.value;
    if (!selectedId || selectedId === 'new') {
      setSelectedPortfolioId(null);
      setPortfolioData({
        id: null,
        identifier: getNextAutoId('port', portfolioList),
        file: null,
        category: '',
        media_type: 'image',
        title: '',
        story: '',
        media_url: '',
      });
      setPortfolioFilePreview('');
      setPortfolioGalleryImages([]);
      return;
    }

    const item = portfolioList.find((p) => String(p.id) === String(selectedId));
    if (item) {
      setSelectedPortfolioId(item.id);
      setPortfolioData({
        id: item.id,
        identifier: item.identifier || '',
        file: null,
        category: item.category || '',
        media_type: item.media_type || 'image',
        title: item.title || '',
        story: item.story || '',
        media_url: item.media_url || '',
      });
      setPortfolioFilePreview(item.media_url || '');
      loadGalleryImages(item.id);
    }
  };

  const handleUploadGalleryImages = async (e) => {
    e.preventDefault();
    if (!selectedPortfolioId) {
      alert('Please select or save a portfolio event first before uploading gallery images.');
      return;
    }
    if (!galleryUploadFiles || galleryUploadFiles.length === 0) {
      alert('Please select one or more image files to upload.');
      return;
    }

    setGalleryUploading(true);
    try {
      const uploadedList = [];
      for (const file of galleryUploadFiles) {
        const compressedFile = await compressImage(file, false);
        const fileUrl = await uploadToR2(compressedFile, 'portfolio');
        uploadedList.push({
          image_url: fileUrl,
          caption: file.name,
          alt_text: portfolioData.title || file.name,
        });
      }

      const res = await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          event_id: selectedPortfolioId,
          images: uploadedList,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add gallery images.');
      }

      alert(`${uploadedList.length} image(s) uploaded successfully!`);
      setGalleryUploadFiles([]);
      const inputEl = document.getElementById('multi-gallery-upload-input');
      if (inputEl) inputEl.value = '';
      await loadGalleryImages(selectedPortfolioId);
    } catch (err) {
      alert(`Error uploading gallery images: ${err.message}`);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (imgId) => {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;
    try {
      const res = await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: imgId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete image.');
      }
      await loadGalleryImages(selectedPortfolioId);
    } catch (err) {
      alert(`Error deleting image: ${err.message}`);
    }
  };

  const handleReorderGalleryImage = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= portfolioGalleryImages.length) return;

    const newImages = [...portfolioGalleryImages];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setPortfolioGalleryImages(newImages);

    const orders = newImages.map((img, idx) => ({
      id: img.id,
      display_order: idx,
    }));

    try {
      await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orders }),
      });
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleDeletePortfolioItem = async () => {
    if (!selectedPortfolioId || !portfolioData.identifier) return;
    if (!confirm(`Are you sure you want to delete event "${portfolioData.title || portfolioData.identifier}" and all its gallery images?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'portfolio', identifier: portfolioData.identifier }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete event.');
      }
      alert('Event deleted successfully.');
      setSelectedPortfolioId(null);
      setPortfolioData({
        id: null,
        identifier: '',
        file: null,
        category: '',
        media_type: 'image',
        title: '',
        story: '',
        media_url: '',
      });
      setPortfolioGalleryImages([]);
      await loadPortfolioList();
    } catch (err) {
      alert(`Error deleting event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Expertise & Multi-Image Gallery Handlers
  const loadExpertiseList = async () => {
    try {
      const res = await fetch('/api/expertise');
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setExpertiseList(data.data);
      }
    } catch (err) {
      console.error('Failed to load expertise list:', err);
    }
  };

  const loadExpertiseGalleryImages = async (identifier) => {
    if (!identifier) {
      setExpertiseGalleryImages([]);
      return;
    }
    try {
      const res = await fetch(`/api/cms/gallery?type=expertise&expertise_identifier=${identifier}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setExpertiseGalleryImages(data.data);
      } else {
        setExpertiseGalleryImages([]);
      }
    } catch (err) {
      console.error('Failed to load expertise gallery images:', err);
      setExpertiseGalleryImages([]);
    }
  };

  const handleSelectExpertise = (e) => {
    const selectedIdentifier = e.target.value;
    if (!selectedIdentifier || selectedIdentifier === 'new') {
      setSelectedExpertiseId(null);
      setExpertiseData({
        identifier: getNextAutoId('exp', expertiseList),
        title: '',
        story: '',
        image_url: '',
        file: null,
      });
      setExpertiseFilePreview('');
      setExpertiseGalleryImages([]);
      return;
    }

    const item = expertiseList.find((p) => String(p.identifier) === String(selectedIdentifier));
    if (item) {
      setSelectedExpertiseId(item.identifier);
      setExpertiseData({
        identifier: item.identifier || '',
        title: item.title || '',
        story: item.story || '',
        image_url: item.image_url || '',
        file: null,
      });
      setExpertiseFilePreview(item.image_url || '');
      loadExpertiseGalleryImages(item.identifier);
    }
  };

  const handleUploadExpertiseGalleryImages = async (e) => {
    e.preventDefault();
    if (!selectedExpertiseId) {
      alert('Please select or save an expertise item first before uploading gallery photos.');
      return;
    }
    if (!expertiseGalleryUploadFiles || expertiseGalleryUploadFiles.length === 0) {
      alert('Please select one or more image files to upload.');
      return;
    }

    setExpertiseGalleryUploading(true);
    try {
      const uploadedImages = [];
      for (const file of expertiseGalleryUploadFiles) {
        const fileUploadRes = await uploadFileToR2(file, 'home');
        if (fileUploadRes && fileUploadRes.url) {
          uploadedImages.push({
            image_url: fileUploadRes.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            alt_text: expertiseData.title || 'Expertise photo',
          });
        }
      }

      const res = await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          type: 'expertise',
          expertise_identifier: selectedExpertiseId,
          images: uploadedImages,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add gallery images.');
      }

      alert(`Successfully added ${uploadedImages.length} image(s) to expertise gallery!`);
      setExpertiseGalleryUploadFiles([]);
      const inputEl = document.getElementById('multi-expertise-gallery-upload-input');
      if (inputEl) inputEl.value = '';
      await loadExpertiseGalleryImages(selectedExpertiseId);
      await loadExpertiseList();
    } catch (err) {
      alert(`Error uploading gallery images: ${err.message}`);
    } finally {
      setExpertiseGalleryUploading(false);
    }
  };

  const handleDeleteExpertiseGalleryImage = async (imgId) => {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;
    try {
      const res = await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          type: 'expertise',
          id: imgId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete image');
      await loadExpertiseGalleryImages(selectedExpertiseId);
      await loadExpertiseList();
    } catch (err) {
      alert(`Error deleting image: ${err.message}`);
    }
  };

  const handleReorderExpertiseGalleryImage = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= expertiseGalleryImages.length) return;

    const newImages = [...expertiseGalleryImages];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    const orders = newImages.map((img, idx) => ({ id: img.id, display_order: idx }));
    setExpertiseGalleryImages(newImages);

    try {
      await fetch('/api/cms/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          type: 'expertise',
          orders,
        }),
      });
      await loadExpertiseGalleryImages(selectedExpertiseId);
      await loadExpertiseList();
    } catch (err) {
      console.error('Failed to update image order:', err);
    }
  };

  const handleDeleteExpertise = async () => {
    if (!selectedExpertiseId) return;
    if (!confirm(`Are you sure you want to delete expertise "${expertiseData.title || expertiseData.identifier}" and all its gallery images?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cms/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'expertise', identifier: selectedExpertiseId }),
      });
      if (!res.ok) throw new Error('Failed to delete expertise');
      alert('Expertise item deleted successfully.');
      setSelectedExpertiseId(null);
      setExpertiseData({
        identifier: '',
        title: '',
        story: '',
        image_url: '',
        file: null,
      });
      setExpertiseGalleryImages([]);
      await loadExpertiseList();
    } catch (err) {
      alert(`Error deleting expertise: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function initCmsData() {
      try {
        const [
          teamRes, homeRes, portfolioRes, expertiseRes,
          featuredRes, servicesRes, packagesRes, testimonialsRes,
          experiencesRes, smilesRes, aboutRes, contactRes, enquiriesRes
        ] = await Promise.all([
          fetch('/api/cms/list?table=team'),
          fetch('/api/cms/list?table=home_content'),
          fetch('/api/portfolio'),
          fetch('/api/expertise'),
          fetch('/api/cms/list?table=featured'),
          fetch('/api/cms/list?table=services'),
          fetch('/api/cms/list?table=packages'),
          fetch('/api/cms/list?table=testimonials'),
          fetch('/api/cms/list?table=experiences'),
          fetch('/api/cms/list?table=smiles'),
          fetch('/api/cms/list?table=about_us'),
          fetch('/api/cms/list?table=contact_info'),
          fetch('/api/enquiry'),
        ]);

        const [
          teamDataRes, homeDataRes, portfolioDataRes, expertiseDataRes,
          featuredD, servicesD, packagesD, testimonialsD,
          experiencesD, smilesD, aboutD, contactD, enquiriesD
        ] = await Promise.all([
          teamRes.json().catch(() => ({})),
          homeRes.json().catch(() => ({})),
          portfolioRes.json().catch(() => ({})),
          expertiseRes.json().catch(() => ({})),
          featuredRes.json().catch(() => ({})),
          servicesRes.json().catch(() => ({})),
          packagesRes.json().catch(() => ({})),
          testimonialsRes.json().catch(() => ({})),
          experiencesRes.json().catch(() => ({})),
          smilesRes.json().catch(() => ({})),
          aboutRes.json().catch(() => ({})),
          contactRes.json().catch(() => ({})),
          enquiriesRes.json().catch(() => ({})),
        ]);

        if (isMounted) {
          if (enquiriesD && Array.isArray(enquiriesD.data)) {
            setEnquiriesList(enquiriesD.data);
          }
          if (teamDataRes.success && Array.isArray(teamDataRes.data)) {
            setTeamList(teamDataRes.data);
            setTeamData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('team', teamDataRes.data) });
          }
          if (portfolioDataRes && Array.isArray(portfolioDataRes.data)) {
            setPortfolioList(portfolioDataRes.data);
            setPortfolioData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('port', portfolioDataRes.data) });
          }
          if (expertiseDataRes && Array.isArray(expertiseDataRes.data)) {
            setExpertiseList(expertiseDataRes.data);
            setExpertiseData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('exp', expertiseDataRes.data) });
          }
          if (featuredD.success && Array.isArray(featuredD.data)) {
            setFeaturedList(featuredD.data);
            setFeaturedData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('feat', featuredD.data) });
          }
          if (servicesD.success && Array.isArray(servicesD.data)) {
            setServicesList(servicesD.data);
            setServiceData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('srv', servicesD.data) });
          }
          if (packagesD.success && Array.isArray(packagesD.data)) {
            setPackagesList(packagesD.data);
            setPackageData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('pkg', packagesD.data) });
          }
          if (testimonialsD.success && Array.isArray(testimonialsD.data)) {
            setTestimonialsList(testimonialsD.data);
            setTestimonialData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('rev', testimonialsD.data) });
          }
          if (experiencesD.success && Array.isArray(experiencesD.data)) {
            setExperiencesList(experiencesD.data);
            setExperienceData(prev => prev.identifier ? prev : { ...prev, identifier: getNextAutoId('exp-video', experiencesD.data) });
          }
          if (smilesD.success && Array.isArray(smilesD.data)) {
            setSmilesList(smilesD.data);
            setSmileData({ identifier: getNextAutoId('smile', smilesD.data), file: null });
          }

          if (aboutD.success && Array.isArray(aboutD.data) && aboutD.data.length > 0) {
            const ab = aboutD.data.find(a => a.identifier === 'about_main') || aboutD.data[0];
            setAboutData({
              identifier: ab.identifier || 'about_main',
              description: ab.description || '',
              image_url: ab.image_url || '',
              brochure_url: ab.brochure_url || '',
              image_file: null,
              brochure_file: null,
            });
          }

          if (contactD.success && Array.isArray(contactD.data) && contactD.data.length > 0) {
            const ct = contactD.data.find(c => c.identifier === 'contact_main') || contactD.data[0];
            setContactData({
              identifier: ct.identifier || 'contact_main',
              email: ct.email || '',
              phone: ct.phone || '',
              location: ct.location || '',
              insta: ct.insta || '',
              fb: ct.fb || '',
            });
          }

          if (homeDataRes.success && Array.isArray(homeDataRes.data) && homeDataRes.data.length > 0) {
            const home = homeDataRes.data.find(h => h.identifier === 'home_main') || homeDataRes.data[0];
            setHomeData(prev => ({
              ...prev,
              identifier: home.identifier || 'home_main',
              banner_title: home.banner_title || '',
              banner_text: home.banner_text || '',
              founded: home.founded || '',
              banner_video_url: home.banner_video_url || '',
              slide_1_url: home.slide_1_url || home.banner_video_url || '',
              slide_2_url: home.slide_2_url || '',
              slide_3_url: home.slide_3_url || '',
              slide_4_url: home.slide_4_url || '',
              logo_url: home.logo_url || '',
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load CMS data:', err);
      }
    }
    initCmsData();
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
      identifier: getNextAutoId('team', teamList),
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
        <button
          type="button"
          className={styles.tabScrollArrow}
          onClick={() => {
            const el = document.getElementById('cms-tab-bar');
            if (el) el.scrollBy({ left: -220, behavior: 'smooth' });
          }}
          aria-label="Scroll tabs left"
          title="Scroll tabs left"
        >
          &#10094;
        </button>

        <nav
          id="cms-tab-bar"
          className={styles.tabBar}
          aria-label="CMS Sections Navigation"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
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
              {tab.id === 'enquiries' && enquiriesList.length > 0 && (
                <span
                  className={styles.tabCountBadge}
                  style={{
                    background: activeTab === 'enquiries' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
                    color: activeTab === 'enquiries' ? '#7b1a28' : '#7b1a28',
                  }}
                >
                  {enquiriesList.length}
                </span>
              )}
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

        <button
          type="button"
          className={styles.tabScrollArrow}
          onClick={() => {
            const el = document.getElementById('cms-tab-bar');
            if (el) el.scrollBy({ left: 220, behavior: 'smooth' });
          }}
          aria-label="Scroll tabs right"
          title="Scroll tabs right"
        >
          &#10095;
        </button>
      </div>

      {/* Fluid Animated Content Area */}
      <div key={activeTab} className={styles.tabContentPanel} id="manage-content-area">

        {/* 0. ENQUIRIES & RESEND EMAIL SERVICES SECTION */}
        {(activeTab === 'enquiries' || activeTab === 'all') && (
          <section className={styles.section} id="section-enquiries">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Client Inquiries & Resend Email Services
              </h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={testEmailLoading}
                  className={styles.submitBtn}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    cursor: testEmailLoading ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #7B1A28 0%, #0B192C 100%)',
                    border: '1px solid #D4AF37',
                    color: '#D4AF37'
                  }}
                >
                  {testEmailLoading ? '⏳ Sending Test Email...' : '⚡ Send Resend Test Email'}
                </button>
                <span className={styles.badge} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  {enquiriesList.length} Total Inquir{enquiriesList.length === 1 ? 'y' : 'ies'}
                </span>
              </div>
            </div>

            {testEmailStatus && (
              <div
                style={{
                  margin: '1rem 0',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '10px',
                  background: testEmailStatus.success ? 'rgba(37, 211, 102, 0.12)' : 'rgba(229, 62, 62, 0.12)',
                  border: `1.5px solid ${testEmailStatus.success ? '#25D366' : '#E53E3E'}`,
                  color: testEmailStatus.success ? '#155724' : '#721c24',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                }}
              >
                <span>{testEmailStatus.message}</span>
                <button
                  type="button"
                  onClick={() => setTestEmailStatus(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'inherit' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Search filter bar */}
            <div style={{ margin: '1.2rem 0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search inquiries by name, phone, email, event..."
                value={enquirySearch}
                onChange={(e) => setEnquirySearch(e.target.value)}
                className={styles.input}
                style={{ maxWidth: '400px' }}
              />
              {enquirySearch && (
                <button
                  type="button"
                  onClick={() => setEnquirySearch('')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #CBD5E0',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Inquiries Cards Grid */}
            {(() => {
              const filtered = enquiriesList.filter((enq) => {
                if (!enquirySearch.trim()) return true;
                const q = enquirySearch.toLowerCase();
                return (
                  enq.name?.toLowerCase().includes(q) ||
                  enq.email?.toLowerCase().includes(q) ||
                  enq.phone?.toLowerCase().includes(q) ||
                  enq.event_type?.toLowerCase().includes(q) ||
                  enq.message?.toLowerCase().includes(q)
                );
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed #CBD5E0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✉️</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#7B1A28' }}>
                      {enquiriesList.length === 0 ? 'No Enquiries Received Yet' : 'No matching inquiries found'}
                    </h3>
                    <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>
                      {enquiriesList.length === 0
                        ? 'When a visitor submits the website consultation form, their details will appear here instantly and trigger Resend email notifications.'
                        : 'Try changing your search keywords.'}
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.2rem' }}>
                  {filtered.map((enq) => {
                    const cleanPhone = enq.phone ? enq.phone.replace(/\D/g, '') : '';
                    const waNumber = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
                    const dateDisplay = enq.created_at
                      ? new Date(enq.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recent';

                    return (
                      <div
                        key={enq.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '12px',
                          padding: '1.4rem',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                            <span
                              style={{
                                background: 'rgba(123, 26, 40, 0.08)',
                                color: '#7B1A28',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(123, 26, 40, 0.2)',
                              }}
                            >
                              {enq.event_type || 'Event'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>
                              {dateDisplay}
                            </span>
                          </div>

                          <h3 style={{ margin: '0 0 0.3rem 0', color: '#0B192C', fontSize: '1.15rem' }}>
                            {enq.name}
                          </h3>

                          <div style={{ fontSize: '0.85rem', color: '#4A5568', lineHeight: 1.6, marginBottom: '0.8rem' }}>
                            <div>
                              <strong>Email:</strong>{' '}
                              <a href={`mailto:${enq.email}`} style={{ color: '#7B1A28', textDecoration: 'none' }}>
                                {enq.email}
                              </a>
                            </div>
                            {enq.phone && (
                              <div>
                                <strong>Phone:</strong>{' '}
                                <a href={`tel:${enq.phone.replace(/\s+/g, '')}`} style={{ color: '#7B1A28', textDecoration: 'none' }}>
                                {enq.phone}
                                </a>
                              </div>
                            )}
                            {enq.event_date && (
                              <div>
                                <strong>Target Date:</strong> {enq.event_date}
                              </div>
                            )}
                            {(enq.guests || enq.budget) && (
                              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                {enq.guests && <span>👥 {enq.guests} guests</span>}
                                {enq.budget && <span>💰 {enq.budget}</span>}
                              </div>
                            )}
                          </div>

                          {enq.message && (
                            <div
                              style={{
                                background: '#FDFBF7',
                                border: '1px solid #EADDC9',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                fontSize: '0.85rem',
                                color: '#2D3748',
                                lineHeight: 1.5,
                                whiteSpace: 'pre-wrap',
                                marginBottom: '1rem',
                              }}
                            >
                              &ldquo;{enq.message}&rdquo;
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '0.8rem', borderTop: '1px solid #F0ECE1' }}>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                                `Hello ${enq.name}, thank you for contacting Raj Hansh Events regarding your ${enq.event_type || 'celebration'}.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#25D366',
                                color: '#ffffff',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                            >
                              💬 WhatsApp
                            </a>
                          )}
                          <a
                            href={`mailto:${enq.email}?subject=${encodeURIComponent(
                              `Raj Hansh Events — Regarding your ${enq.event_type || 'enquiry'}`
                            )}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#0B192C',
                              color: '#D4AF37',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              border: '1px solid #D4AF37',
                            }}
                          >
                            ✉️ Email
                          </a>
                          {cleanPhone && (
                            <a
                              href={`tel:${enq.phone.replace(/\s+/g, '')}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#7B1A28',
                                color: '#ffffff',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                            >
                              📞 Call
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteEnquiry(enq.id, enq.name)}
                            style={{
                              marginLeft: 'auto',
                              background: 'transparent',
                              color: '#E53E3E',
                              border: '1px solid #FEB2B2',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                            title="Delete enquiry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </section>
        )}

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
                      <div className={styles.labelWithAction}>
                        <label style={{ margin: 0 }}>Identifier (e.g., team-1)</label>
                        {!isEditingTeam && (
                          <button
                            type="button"
                            className={styles.autoIdBtn}
                            onClick={() => setTeamData(prev => ({ ...prev, identifier: getNextAutoId('team', teamList) }))}
                            title="Auto generate next unique team ID"
                          >
                            ⚡ Auto ID
                          </button>
                        )}
                      </div>
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
            <form onSubmit={async (e) => {
              e.preventDefault();
              const payload = {
                identifier: homeData.identifier || 'home_main',
                ...(homeData.banner_title !== undefined ? { banner_title: homeData.banner_title } : {}),
                ...(homeData.banner_text !== undefined ? { banner_text: homeData.banner_text } : {}),
                ...(homeData.founded !== undefined ? { founded: homeData.founded } : {}),
                ...(homeData.slide_1_url !== undefined ? { slide_1_url: homeData.slide_1_url, banner_video_url: homeData.slide_1_url } : {}),
                ...(homeData.slide_2_url !== undefined ? { slide_2_url: homeData.slide_2_url } : {}),
                ...(homeData.slide_3_url !== undefined ? { slide_3_url: homeData.slide_3_url } : {}),
                ...(homeData.slide_4_url !== undefined ? { slide_4_url: homeData.slide_4_url } : {}),
                ...(homeData.logo_url !== undefined ? { logo_url: homeData.logo_url } : {})
              };

              const fileUploads = [
                homeData.logo ? { file: homeData.logo, bucket: 'home', columnName: 'logo_url' } : null,
                homeData.slide_1_file ? { file: homeData.slide_1_file, bucket: 'home', columnName: 'slide_1_url' } : null,
                homeData.slide_2_file ? { file: homeData.slide_2_file, bucket: 'home', columnName: 'slide_2_url' } : null,
                homeData.slide_3_file ? { file: homeData.slide_3_file, bucket: 'home', columnName: 'slide_3_url' } : null,
                homeData.slide_4_file ? { file: homeData.slide_4_file, bucket: 'home', columnName: 'slide_4_url' } : null,
              ].filter(Boolean);

              await handleSubmit(
                e, 'home_content', 
                payload,
                fileUploads
              );
              await loadHomeData();
            }}>
              {/* BRAND LOGO */}
              <div className={styles.fieldGroup} style={{ marginBottom: '20px' }}>
                <label>Header Brand Logo File</label>
                {homeLogoPreview ? (
                  <div className={styles.mediaPreviewCard}>
                    <img src={homeLogoPreview} alt="Selected Logo Preview" className={styles.mediaPreviewThumb} />
                    <div className={styles.mediaPreviewText}>
                      <strong>Selected New Logo</strong>
                      <span>{homeData.logo ? homeData.logo.name : 'Image preview'}</span>
                    </div>
                  </div>
                ) : homeData.logo_url ? (
                  <div className={styles.mediaPreviewCard}>
                    <img src={homeData.logo_url} alt="Current Logo" className={styles.mediaPreviewThumb} />
                    <div className={styles.mediaPreviewText} style={{ flex: 1 }}>
                      <strong>Current Saved Logo</strong>
                      <a href={homeData.logo_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline' }}>
                        {homeData.logo_url.split('/').pop()}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearLogo}
                      className={styles.deleteBtn}
                      style={{ marginLeft: 'auto' }}
                      title="Remove logo from DB and R2"
                    >
                      🗑️ Remove Logo
                    </button>
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setHomeData({...homeData, logo: file});
                    if (file) setHomeLogoPreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              {/* 4 HERO SHOWCASE SLIDES */}
              <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🎬</span>
                  <h3 style={{ fontSize: '1.15rem', color: '#7b1a28', fontWeight: 700, margin: 0 }}>
                    Hero Showcase Media (4 Slides)
                  </h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#666', marginBottom: '16px', lineHeight: 1.5 }}>
                  Configure all 4 hero slideshow slots. Upload custom MP4/WebM videos or WebP/JPG/PNG images directly to Cloudflare R2, or paste direct URLs. Live previews and delete options are available for each slot.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {/* SLIDE 1 */}
                  <div style={{ background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0B192C' }}>Slide 1 (Primary)</strong>
                      <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>SLOT 1</span>
                    </div>

                    {/* Visual Preview */}
                    {slidePreviews[1] ? (
                      <div className={styles.mediaPreviewCard}>
                        {homeData.slide_1_file?.type.startsWith('video/') ? (
                          <video src={slidePreviews[1]} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={slidePreviews[1]} alt="Slide 1 Preview" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText}>
                          <strong>New Selected Media</strong>
                          <span>{homeData.slide_1_file?.name}</span>
                        </div>
                      </div>
                    ) : (homeData.slide_1_url || homeData.banner_video_url) ? (
                      <div className={styles.mediaPreviewCard}>
                        {isVideoUrl(homeData.slide_1_url || homeData.banner_video_url) ? (
                          <video src={homeData.slide_1_url || homeData.banner_video_url} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={homeData.slide_1_url || homeData.banner_video_url} alt="Slide 1 active" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText} style={{ flex: 1, minWidth: 0 }}>
                          <strong>Active Media</strong>
                          <a href={homeData.slide_1_url || homeData.banner_video_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                            {(homeData.slide_1_url || homeData.banner_video_url).split('/').pop()}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearSlide(1, 'slide_1_url')}
                          className={styles.deleteBtn}
                          title="Delete media from DB and R2"
                        >
                          🗑️ Clear
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>
                        No media uploaded for Slot 1 yet.
                      </div>
                    )}

                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Upload Video or Image</label>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        setHomeData({...homeData, slide_1_file: file});
                        if (file) setSlidePreviews(prev => ({ ...prev, 1: URL.createObjectURL(file) }));
                      }}
                    />
                    
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginTop: '10px', marginBottom: '4px' }}>Or Direct Media URL</label>
                    <input
                      type="url"
                      placeholder="https://pub-...r2.dev/home/..."
                      value={homeData.slide_1_url || ''}
                      onChange={e => setHomeData({...homeData, slide_1_url: e.target.value, banner_video_url: e.target.value})}
                      style={{ fontSize: '0.82rem', padding: '8px 10px', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* SLIDE 2 */}
                  <div style={{ background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0B192C' }}>Slide 2</strong>
                      <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>SLOT 2</span>
                    </div>

                    {/* Visual Preview */}
                    {slidePreviews[2] ? (
                      <div className={styles.mediaPreviewCard}>
                        {homeData.slide_2_file?.type.startsWith('video/') ? (
                          <video src={slidePreviews[2]} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={slidePreviews[2]} alt="Slide 2 Preview" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText}>
                          <strong>New Selected Media</strong>
                          <span>{homeData.slide_2_file?.name}</span>
                        </div>
                      </div>
                    ) : homeData.slide_2_url ? (
                      <div className={styles.mediaPreviewCard}>
                        {isVideoUrl(homeData.slide_2_url) ? (
                          <video src={homeData.slide_2_url} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={homeData.slide_2_url} alt="Slide 2 active" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText} style={{ flex: 1, minWidth: 0 }}>
                          <strong>Active Media</strong>
                          <a href={homeData.slide_2_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                            {homeData.slide_2_url.split('/').pop()}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearSlide(2, 'slide_2_url')}
                          className={styles.deleteBtn}
                          title="Delete media from DB and R2"
                        >
                          🗑️ Clear
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>
                        No media uploaded for Slot 2 yet.
                      </div>
                    )}

                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Upload Video or Image</label>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        setHomeData({...homeData, slide_2_file: file});
                        if (file) setSlidePreviews(prev => ({ ...prev, 2: URL.createObjectURL(file) }));
                      }}
                    />
                    
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginTop: '10px', marginBottom: '4px' }}>Or Direct Media URL</label>
                    <input
                      type="url"
                      placeholder="https://pub-...r2.dev/home/..."
                      value={homeData.slide_2_url || ''}
                      onChange={e => setHomeData({...homeData, slide_2_url: e.target.value})}
                      style={{ fontSize: '0.82rem', padding: '8px 10px', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* SLIDE 3 */}
                  <div style={{ background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0B192C' }}>Slide 3</strong>
                      <span style={{ fontSize: '0.72rem', background: '#f3e8ff', color: '#6b21a8', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>SLOT 3</span>
                    </div>

                    {/* Visual Preview */}
                    {slidePreviews[3] ? (
                      <div className={styles.mediaPreviewCard}>
                        {homeData.slide_3_file?.type.startsWith('video/') ? (
                          <video src={slidePreviews[3]} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={slidePreviews[3]} alt="Slide 3 Preview" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText}>
                          <strong>New Selected Media</strong>
                          <span>{homeData.slide_3_file?.name}</span>
                        </div>
                      </div>
                    ) : homeData.slide_3_url ? (
                      <div className={styles.mediaPreviewCard}>
                        {isVideoUrl(homeData.slide_3_url) ? (
                          <video src={homeData.slide_3_url} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={homeData.slide_3_url} alt="Slide 3 active" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText} style={{ flex: 1, minWidth: 0 }}>
                          <strong>Active Media</strong>
                          <a href={homeData.slide_3_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                            {homeData.slide_3_url.split('/').pop()}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearSlide(3, 'slide_3_url')}
                          className={styles.deleteBtn}
                          title="Delete media from DB and R2"
                        >
                          🗑️ Clear
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>
                        No media uploaded for Slot 3 yet.
                      </div>
                    )}

                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Upload Video or Image</label>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        setHomeData({...homeData, slide_3_file: file});
                        if (file) setSlidePreviews(prev => ({ ...prev, 3: URL.createObjectURL(file) }));
                      }}
                    />
                    
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginTop: '10px', marginBottom: '4px' }}>Or Direct Media URL</label>
                    <input
                      type="url"
                      placeholder="https://pub-...r2.dev/home/..."
                      value={homeData.slide_3_url || ''}
                      onChange={e => setHomeData({...homeData, slide_3_url: e.target.value})}
                      style={{ fontSize: '0.82rem', padding: '8px 10px', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* SLIDE 4 */}
                  <div style={{ background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0B192C' }}>Slide 4</strong>
                      <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>SLOT 4</span>
                    </div>

                    {/* Visual Preview */}
                    {slidePreviews[4] ? (
                      <div className={styles.mediaPreviewCard}>
                        {homeData.slide_4_file?.type.startsWith('video/') ? (
                          <video src={slidePreviews[4]} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={slidePreviews[4]} alt="Slide 4 Preview" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText}>
                          <strong>New Selected Media</strong>
                          <span>{homeData.slide_4_file?.name}</span>
                        </div>
                      </div>
                    ) : homeData.slide_4_url ? (
                      <div className={styles.mediaPreviewCard}>
                        {isVideoUrl(homeData.slide_4_url) ? (
                          <video src={homeData.slide_4_url} controls className={styles.mediaPreviewThumb} />
                        ) : (
                          <img src={homeData.slide_4_url} alt="Slide 4 active" className={styles.mediaPreviewThumb} />
                        )}
                        <div className={styles.mediaPreviewText} style={{ flex: 1, minWidth: 0 }}>
                          <strong>Active Media</strong>
                          <a href={homeData.slide_4_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                            {homeData.slide_4_url.split('/').pop()}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearSlide(4, 'slide_4_url')}
                          className={styles.deleteBtn}
                          title="Delete media from DB and R2"
                        >
                          🗑️ Clear
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>
                        No media uploaded for Slot 4 yet.
                      </div>
                    )}

                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Upload Video or Image</label>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        setHomeData({...homeData, slide_4_file: file});
                        if (file) setSlidePreviews(prev => ({ ...prev, 4: URL.createObjectURL(file) }));
                      }}
                    />
                    
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginTop: '10px', marginBottom: '4px' }}>Or Direct Media URL</label>
                    <input
                      type="url"
                      placeholder="https://pub-...r2.dev/home/..."
                      value={homeData.slide_4_url || ''}
                      onChange={e => setHomeData({...homeData, slide_4_url: e.target.value})}
                      style={{ fontSize: '0.82rem', padding: '8px 10px', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* BANNER TEXT & METADATA */}
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Banner Title</label>
                  <input type="text" placeholder="Title on Banner" value={homeData.banner_title || ''} onChange={e => setHomeData({...homeData, banner_title: e.target.value})} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Founded Year / Text</label>
                  <input type="text" placeholder="e.g. Established 2023" value={homeData.founded || ''} onChange={e => setHomeData({...homeData, founded: e.target.value})} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Text Under Title</label>
                <textarea placeholder="Supporting text under main banner heading" value={homeData.banner_text || ''} onChange={e => setHomeData({...homeData, banner_text: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Saving to Database & R2...' : 'Save Home Data'}
              </button>
            </form>

            <h3 className={styles.subSectionTitle}>Our Expertise &amp; Luxury Multi-Image Gallery</h3>

            {/* Expertise Item Selector */}
            <div className={styles.fieldGroup} style={{ marginBottom: '1.2rem' }}>
              <label>Select Expertise Item to Edit or Manage Photos</label>
              <select
                value={selectedExpertiseId || 'new'}
                onChange={handleSelectExpertise}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  background: '#fcfbf8',
                  fontSize: '0.95rem',
                  color: '#2c2c2c',
                  fontWeight: '500',
                }}
              >
                <option value="new">+ Add New Expertise Item</option>
                {expertiseList.map((item) => (
                  <option key={item.identifier} value={item.identifier}>
                    {item.title || item.identifier} ({item.identifier})
                  </option>
                ))}
              </select>
            </div>

            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'expertise',
                  {
                    identifier: expertiseData.identifier,
                    title: expertiseData.title,
                    story: expertiseData.story || '',
                  },
                  expertiseData.file
                    ? { file: expertiseData.file, bucket: 'home', columnName: 'image_url' }
                    : null
                )
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier</label>
                    {!selectedExpertiseId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setExpertiseData(prev => ({ ...prev, identifier: getNextAutoId('exp', expertiseList) }))}
                        title="Auto generate next unique expertise ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., exp-1"
                    value={expertiseData.identifier || ''}
                    required
                    disabled={!!selectedExpertiseId}
                    onChange={(e) => setExpertiseData({ ...expertiseData, identifier: e.target.value })}
                  />
                  {selectedExpertiseId && (
                    <small style={{ color: '#888', fontSize: '0.78rem' }}>Identifier cannot be changed once created.</small>
                  )}
                </div>
                <div className={styles.fieldGroup}>
                  <label>Expertise Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding Planning"
                    value={expertiseData.title || ''}
                    required
                    onChange={(e) => setExpertiseData({ ...expertiseData, title: e.target.value })}
                  />
                </div>
              </div>

              {/* Story Field for Luxury Gallery Modal */}
              <div className={styles.fieldGroup}>
                <label>Story / Narrative (Displayed in Luxury Modal)</label>
                <textarea
                  placeholder="Describe the craft, royal hospitality, tradition, or bespoke services for this expertise..."
                  value={expertiseData.story || ''}
                  rows={4}
                  onChange={(e) => setExpertiseData({ ...expertiseData, story: e.target.value })}
                />
              </div>

              {/* Cover Image Upload & Current Preview */}
              <div className={styles.fieldGroup}>
                <label>Main Cover Image {selectedExpertiseId ? '(Leave empty to keep current image)' : ''}</label>
                {(expertiseFilePreview || expertiseData.image_url) && (
                  <div className={styles.mediaPreviewCard}>
                    <img
                      src={expertiseFilePreview || expertiseData.image_url}
                      alt="Cover Preview"
                      className={styles.mediaPreviewThumb}
                    />
                    <div className={styles.mediaPreviewText}>
                      <strong>{expertiseData.file ? 'Selected New Cover Photo' : 'Current Saved Cover Photo'}</strong>
                      <span>{expertiseData.file ? expertiseData.file.name : (expertiseData.image_url?.split('/').pop() || '')}</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  required={!selectedExpertiseId && !expertiseData.image_url}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setExpertiseData({ ...expertiseData, file });
                    if (file) setExpertiseFilePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: '1' }}>
                  {loading ? 'Saving to Database & R2...' : selectedExpertiseId ? 'Update Expertise Item' : 'Save New Expertise Item'}
                </button>

                {selectedExpertiseId && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleDeleteExpertise}
                    className={styles.deleteBtn}
                    style={{ background: '#b22222', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Delete Expertise
                  </button>
                )}
              </div>
            </form>

            {/* Multi-Image Gallery Manager for Selected Expertise */}
            {selectedExpertiseId && (
              <div className={styles.gallerySection}>
                <div className={styles.galleryHeader}>
                  <h3 className={styles.galleryTitle}>Multi-Image Gallery for &ldquo;{expertiseData.title || 'Expertise'}&rdquo;</h3>
                  <p className={styles.gallerySubtitle}>
                    Upload high-resolution photos that visitors can explore, navigate, and zoom into in the luxury modal.
                  </p>
                </div>

                {/* Upload Multiple Images */}
                <form className={styles.galleryUploadBox} onSubmit={handleUploadExpertiseGalleryImages}>
                  <input
                    id="multi-expertise-gallery-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setExpertiseGalleryUploadFiles(Array.from(e.target.files || []))}
                  />
                  <button
                    type="submit"
                    disabled={expertiseGalleryUploading || expertiseGalleryUploadFiles.length === 0}
                    className={styles.addBtn}
                  >
                    {expertiseGalleryUploading
                      ? 'Uploading Photos...'
                      : `Upload ${expertiseGalleryUploadFiles.length > 0 ? expertiseGalleryUploadFiles.length : ''} Gallery Photos`}
                  </button>
                </form>

                {/* Gallery Images List */}
                {expertiseGalleryImages.length > 0 ? (
                  <div className={styles.galleryGrid}>
                    {expertiseGalleryImages.map((img, idx) => (
                      <div key={img.id || idx} className={styles.galleryCard}>
                        <div className={styles.galleryCardImgWrapper}>
                          <span className={styles.galleryCardBadge}>#{idx + 1}</span>
                          <img src={img.image_url} alt={img.caption || 'Expertise photo'} className={styles.galleryCardImg} />
                        </div>
                        <div className={styles.galleryCardControls}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleReorderExpertiseGalleryImage(idx, -1)}
                              className={styles.galleryOrderBtn}
                              title="Move Left"
                            >
                              &larr;
                            </button>
                            <button
                              type="button"
                              disabled={idx === expertiseGalleryImages.length - 1}
                              onClick={() => handleReorderExpertiseGalleryImage(idx, 1)}
                              className={styles.galleryOrderBtn}
                              title="Move Right"
                            >
                              &rarr;
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpertiseGalleryImage(img.id)}
                            className={styles.galleryDeleteBtn}
                            title="Remove Photo"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic', margin: '1rem 0' }}>
                    No additional gallery photos yet. Upload celebration photos above for the interactive modal!
                  </p>
                )}
              </div>
            )}

            <h3 className={styles.subSectionTitle}>Featured Showcase (Homepage Highlights)</h3>
            <div className={styles.itemSelectBar}>
              <span className={styles.itemSelectLabel}>Select Featured Event:</span>
              <select
                className={styles.itemSelect}
                value={selectedFeaturedId || 'new'}
                onChange={handleSelectFeatured}
              >
                <option value="new">+ Add New Featured Item</option>
                {featuredList.map(item => (
                  <option key={item.identifier} value={item.identifier}>
                    {item.title || item.identifier} ({item.identifier})
                  </option>
                ))}
              </select>
              {selectedFeaturedId && (
                <button
                  type="button"
                  onClick={() => handleDeleteRecord('featured', featuredData.identifier, featuredData.title, async () => {
                    setSelectedFeaturedId(null);
                    setFeaturedData({ identifier: '', title: '', file: null, image_url: '' });
                    setFeaturedFilePreview('');
                    await loadFeaturedList();
                  })}
                  className={styles.deleteActionBtn}
                >
                  🗑️ Delete Featured Item
                </button>
              )}
            </div>

            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'featured',
                  { identifier: featuredData.identifier, title: featuredData.title },
                  featuredData.file ? { file: featuredData.file, bucket: 'home', columnName: 'image_url' } : null
                )
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier (Unique Key)</label>
                    {!selectedFeaturedId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setFeaturedData(prev => ({ ...prev, identifier: getNextAutoId('feat', featuredList) }))}
                        title="Auto generate next unique featured ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., feat-1"
                    value={featuredData.identifier || ''}
                    required
                    readOnly={!!selectedFeaturedId}
                    style={selectedFeaturedId ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    onChange={e => setFeaturedData({...featuredData, identifier: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Featured Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The Grand Sangeet Gala"
                    value={featuredData.title || ''}
                    required
                    onChange={e => setFeaturedData({...featuredData, title: e.target.value})}
                  />
                </div>
              </div>

              {/* Preview */}
              {(featuredFilePreview || featuredData.image_url) && (
                <div className={styles.mediaPreviewCard}>
                  <img
                    src={featuredFilePreview || featuredData.image_url}
                    alt="Featured Preview"
                    className={styles.mediaPreviewThumb}
                  />
                  <div className={styles.mediaPreviewText}>
                    <strong>{featuredData.file ? 'Selected New Image' : 'Current Saved Image'}</strong>
                    <span>{featuredData.file ? featuredData.file.name : (featuredData.image_url?.split('/').pop() || '')}</span>
                  </div>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label>Media File {selectedFeaturedId && '(Leave blank to keep existing image)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!selectedFeaturedId && !featuredData.image_url}
                  onChange={e => {
                    const file = e.target.files[0];
                    setFeaturedData({...featuredData, file});
                    if (file) setFeaturedFilePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className={styles.actionButtonGroup}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                  {loading ? 'Saving to Database & R2...' : selectedFeaturedId ? 'Update Featured Item' : 'Save Featured Item'}
                </button>
                {selectedFeaturedId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedFeaturedId(null);
                      setFeaturedData({ identifier: '', title: '', file: null, image_url: '' });
                      setFeaturedFilePreview('');
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* 3. ABOUT US */}
        {(activeTab === 'about' || activeTab === 'all') && (
          <section className={styles.section} id="section-about">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                About Us & Brand Assets
              </h2>
            </div>
            <form onSubmit={(e) => {
              const payload = {
                identifier: aboutData.identifier || 'about_main',
                description: aboutData.description || '',
                ...(aboutData.image_url ? { image_url: aboutData.image_url } : {}),
                ...(aboutData.brochure_url ? { brochure_url: aboutData.brochure_url } : {})
              };
              const imgArg = aboutData.image_file ? { file: aboutData.image_file, bucket: 'about', columnName: 'image_url' } : null;
              const docArg = aboutData.brochure_file ? { file: aboutData.brochure_file, bucket: 'about', columnName: 'brochure_url' } : null;
              handleSubmit(e, 'about_us', payload, imgArg, docArg);
            }}>
              {/* Brand Story Description */}
              <div className={styles.fieldGroup} style={{ marginBottom: '24px' }}>
                <label>Main Brand Story / Description</label>
                <textarea
                  placeholder="Enter the full About Us story describing Raj Hans Events heritage, experience, and bespoke celebrations..."
                  required
                  rows={6}
                  value={aboutData.description || ''}
                  onChange={e => setAboutData({...aboutData, description: e.target.value})}
                />
              </div>

              {/* About Section Image */}
              <div className={styles.fieldGroup} style={{ marginBottom: '24px' }}>
                <label>About Section Story Image</label>
                {aboutImagePreview ? (
                  <div className={styles.mediaPreviewCard}>
                    <img src={aboutImagePreview} alt="Selected About Preview" className={styles.mediaPreviewThumb} />
                    <div className={styles.mediaPreviewText} style={{ flex: 1 }}>
                      <strong>Selected New Image</strong>
                      <span>{aboutData.image_file ? aboutData.image_file.name : 'Image preview'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAboutImagePreview('');
                        setAboutData(prev => ({ ...prev, image_file: null }));
                        const input = document.getElementById('about-image-input');
                        if (input) input.value = '';
                      }}
                      className={styles.deleteBtn}
                      title="Cancel file selection"
                    >
                      ✖ Cancel
                    </button>
                  </div>
                ) : aboutData.image_url ? (
                  <div className={styles.mediaPreviewCard}>
                    <img src={aboutData.image_url} alt="Current About Image" className={styles.mediaPreviewThumb} />
                    <div className={styles.mediaPreviewText} style={{ flex: 1 }}>
                      <strong>Current Saved Image</strong>
                      <a href={aboutData.image_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline' }}>
                        {aboutData.image_url.split('/').pop()}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClearAboutMedia('image_url', 'About Section Image')}
                      className={styles.deleteBtn}
                      style={{ marginLeft: 'auto' }}
                      title="Remove image from DB and storage"
                    >
                      🗑️ Remove About Image
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginBottom: '8px' }}>
                    Using default brand story image. Choose a new photo below to customize it.
                  </div>
                )}
                <input
                  id="about-image-input"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setAboutData(prev => ({ ...prev, image_file: file }));
                    if (file) setAboutImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              {/* Brochure Document File */}
              <div className={styles.fieldGroup} style={{ marginBottom: '24px' }}>
                <label>Company Brochure File (PDF / Document)</label>
                {aboutBrochureName ? (
                  <div className={styles.mediaPreviewCard}>
                    <div style={{ fontSize: '2rem', marginRight: '12px' }}>📄</div>
                    <div className={styles.mediaPreviewText} style={{ flex: 1 }}>
                      <strong>Selected New Brochure</strong>
                      <span>{aboutBrochureName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAboutBrochureName('');
                        setAboutData(prev => ({ ...prev, brochure_file: null }));
                        const input = document.getElementById('about-brochure-input');
                        if (input) input.value = '';
                      }}
                      className={styles.deleteBtn}
                      title="Cancel file selection"
                    >
                      ✖ Cancel
                    </button>
                  </div>
                ) : aboutData.brochure_url ? (
                  <div className={styles.mediaPreviewCard}>
                    <div style={{ fontSize: '2rem', marginRight: '12px' }}>📄</div>
                    <div className={styles.mediaPreviewText} style={{ flex: 1 }}>
                      <strong>Current Active Brochure</strong>
                      <a href={aboutData.brochure_url} target="_blank" rel="noreferrer" style={{ color: '#0055DC', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        {aboutData.brochure_url.split('/').pop()}
                      </a>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href={aboutData.brochure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(218, 165, 32, 0.1)',
                          border: '1px solid #DAA520',
                          borderRadius: '6px',
                          color: '#B8860B',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        👁️ View / Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleClearAboutMedia('brochure_url', 'Brochure File')}
                        className={styles.deleteBtn}
                        title="Remove brochure from DB and storage"
                      >
                        🗑️ Remove Brochure
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginBottom: '8px' }}>
                    Using default brochure (/brochure.pdf). Upload a PDF or DOC to replace it site-wide.
                  </div>
                )}
                <input
                  id="about-brochure-input"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={e => {
                    const file = e.target.files[0];
                    setAboutData(prev => ({ ...prev, brochure_file: file }));
                    if (file) setAboutBrochureName(file.name + ` (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
                  }}
                />
              </div>

              <div className={styles.actionButtonGroup}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                  {loading ? 'Saving to Database...' : 'Save About Us & Media Assets'}
                </button>
                {aboutData.description && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord('about_us', aboutData.identifier || 'about_main', 'About Us Description', async () => {
                      setAboutData(prev => ({ ...prev, identifier: 'about_main', description: '' }));
                      await loadAboutData();
                    })}
                    className={styles.deleteActionBtn}
                  >
                    🗑️ Clear Description
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* 4. SERVICES */}
        {(activeTab === 'services' || activeTab === 'all') && (
          <section className={styles.section} id="section-services">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Services Management
              </h2>
              <span className={styles.badge} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {servicesList.length} Active Service{servicesList.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Service Item Selector */}
            <div className={styles.itemSelectBar}>
              <span className={styles.itemSelectLabel}>Select Service to Edit:</span>
              <select
                className={styles.itemSelect}
                value={selectedServiceId || 'new'}
                onChange={handleSelectService}
              >
                <option value="new">+ Add New Service</option>
                {servicesList.map(s => (
                  <option key={s.identifier} value={s.identifier}>
                    {s.title || s.identifier} ({s.identifier})
                  </option>
                ))}
              </select>
              {selectedServiceId && (
                <button
                  type="button"
                  onClick={() => handleDeleteRecord('services', serviceData.identifier, serviceData.title, async () => {
                    setSelectedServiceId(null);
                    setServiceData({ identifier: '', title: '', tag: '', desc: '', file: null, image_url: '' });
                    setServiceFilePreview('');
                    await loadServicesList();
                  })}
                  className={styles.deleteActionBtn}
                >
                  🗑️ Delete Service
                </button>
              )}
            </div>

            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'services',
                  {
                    identifier: serviceData.identifier,
                    title: serviceData.title,
                    tag: serviceData.tag,
                    desc: serviceData.desc,
                  },
                  serviceData.file ? { file: serviceData.file, bucket: 'services', columnName: 'image_url' } : null
                )
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier</label>
                    {!selectedServiceId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setServiceData(prev => ({ ...prev, identifier: getNextAutoId('srv', servicesList) }))}
                        title="Auto generate next unique service ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., srv-1"
                    value={serviceData.identifier || ''}
                    required
                    readOnly={!!selectedServiceId}
                    style={selectedServiceId ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    onChange={e => setServiceData({...serviceData, identifier: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Service Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Wedding Planning"
                    value={serviceData.title || ''}
                    required
                    onChange={e => setServiceData({...serviceData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Category Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. WEDDING, CORPORATE, BIRTHDAY"
                    value={serviceData.tag || ''}
                    onChange={e => setServiceData({...serviceData, tag: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Cover Image {selectedServiceId && '(Leave blank to keep current cover)'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!selectedServiceId && !serviceData.image_url}
                    onChange={e => {
                      const file = e.target.files[0];
                      setServiceData({...serviceData, file});
                      if (file) setServiceFilePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>

              {/* Cover Photo Preview */}
              {(serviceFilePreview || serviceData.image_url) && (
                <div className={styles.mediaPreviewCard}>
                  <img
                    src={serviceFilePreview || serviceData.image_url}
                    alt="Service Cover Preview"
                    className={styles.mediaPreviewThumb}
                  />
                  <div className={styles.mediaPreviewText}>
                    <strong>{serviceData.file ? 'Selected New Cover Photo' : 'Current Saved Cover Photo'}</strong>
                    <span>{serviceData.file ? serviceData.file.name : (serviceData.image_url?.split('/').pop() || '')}</span>
                  </div>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label>Service Description</label>
                <textarea
                  placeholder="Detailed description of what this service covers..."
                  value={serviceData.desc || ''}
                  rows={4}
                  onChange={e => setServiceData({...serviceData, desc: e.target.value})}
                />
              </div>

              <div className={styles.actionButtonGroup}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                  {loading ? 'Saving to Database & R2...' : selectedServiceId ? 'Update Service' : 'Save Service'}
                </button>
                {selectedServiceId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedServiceId(null);
                      setServiceData({ identifier: '', title: '', tag: '', desc: '', file: null, image_url: '' });
                      setServiceFilePreview('');
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* 5. PACKAGES */}
        {(activeTab === 'packages' || activeTab === 'all') && (
          <section className={styles.section} id="section-packages">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Curated Packages Management
              </h2>
              <span className={styles.badge} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {packagesList.length} Active Package{packagesList.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Package Selector */}
            <div className={styles.itemSelectBar}>
              <span className={styles.itemSelectLabel}>Select Package to Edit:</span>
              <select
                className={styles.itemSelect}
                value={selectedPackageId || 'new'}
                onChange={handleSelectPackage}
              >
                <option value="new">+ Add New Package</option>
                {packagesList.map(p => (
                  <option key={p.identifier} value={p.identifier}>
                    {p.pkg_name || p.identifier} ({p.price || 'Quote'})
                  </option>
                ))}
              </select>
              {selectedPackageId && (
                <button
                  type="button"
                  onClick={() => handleDeleteRecord('packages', packageData.identifier, packageData.pkg_name, async () => {
                    setSelectedPackageId(null);
                    setPackageData({ identifier: '', pkg_name: '', f1: '', f2: '', f3: '', f4: '', price: '' });
                    await loadPackagesList();
                  })}
                  className={styles.deleteActionBtn}
                >
                  🗑️ Delete Package
                </button>
              )}
            </div>

            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(e, 'packages', {
                  identifier: packageData.identifier,
                  pkg_name: packageData.pkg_name,
                  f1: packageData.f1,
                  f2: packageData.f2,
                  f3: packageData.f3,
                  f4: packageData.f4,
                  price: packageData.price,
                })
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier</label>
                    {!selectedPackageId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setPackageData(prev => ({ ...prev, identifier: getNextAutoId('pkg', packagesList) }))}
                        title="Auto generate next unique package ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., pkg-1"
                    value={packageData.identifier || ''}
                    required
                    readOnly={!!selectedPackageId}
                    style={selectedPackageId ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    onChange={e => setPackageData({...packageData, identifier: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Package Name</label>
                  <input
                    type="text"
                    placeholder="e.g. The Imperial Royal Package"
                    value={packageData.pkg_name || ''}
                    required
                    onChange={e => setPackageData({...packageData, pkg_name: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Price Display</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,00,000 / Custom Quote"
                    value={packageData.price || ''}
                    required
                    onChange={e => setPackageData({...packageData, price: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Feature 1</label>
                  <input
                    type="text"
                    placeholder="Feature 1"
                    value={packageData.f1 || ''}
                    onChange={e => setPackageData({...packageData, f1: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Feature 2</label>
                  <input
                    type="text"
                    placeholder="Feature 2"
                    value={packageData.f2 || ''}
                    onChange={e => setPackageData({...packageData, f2: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Feature 3</label>
                  <input
                    type="text"
                    placeholder="Feature 3"
                    value={packageData.f3 || ''}
                    onChange={e => setPackageData({...packageData, f3: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Feature 4</label>
                  <input
                    type="text"
                    placeholder="Feature 4"
                    value={packageData.f4 || ''}
                    onChange={e => setPackageData({...packageData, f4: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.actionButtonGroup}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                  {loading ? 'Saving to Database...' : selectedPackageId ? 'Update Package' : 'Save Package'}
                </button>
                {selectedPackageId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedPackageId(null);
                      setPackageData({ identifier: '', pkg_name: '', f1: '', f2: '', f3: '', f4: '', price: '' });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* 6. PORTFOLIO & LUXURY GALLERY */}
        {(activeTab === 'portfolio' || activeTab === 'all') && (
          <section className={styles.section} id="section-portfolio">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionPill} />
                Portfolio Gallery &amp; Events
              </h2>
            </div>

            {/* Event Selector */}
            <div className={styles.portfolioSelectBar}>
              <span className={styles.portfolioSelectLabel}>Select Event to Edit:</span>
              <select
                className={styles.portfolioSelect}
                value={selectedPortfolioId || 'new'}
                onChange={handleSelectPortfolioEvent}
              >
                <option value="new">+ Create New Event</option>
                {portfolioList.map((p) => (
                  <option key={p.id || p.identifier} value={p.id}>
                    {p.title || p.identifier} ({p.category || 'Event'})
                  </option>
                ))}
              </select>
              {selectedPortfolioId && (
                <button
                  type="button"
                  onClick={handleDeletePortfolioItem}
                  className={styles.deleteBtn}
                  style={{ padding: '7px 14px' }}
                >
                  Delete Event
                </button>
              )}
            </div>

            {/* Event Details Form */}
            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'portfolio',
                  {
                    identifier: portfolioData.identifier,
                    category: portfolioData.category,
                    media_type: portfolioData.media_type,
                    title: portfolioData.title,
                    story: portfolioData.story,
                  },
                  portfolioData.file
                    ? { file: portfolioData.file, bucket: 'portfolio', columnName: 'media_url' }
                    : null
                )
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier (Unique Key)</label>
                    {!selectedPortfolioId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setPortfolioData(prev => ({ ...prev, identifier: getNextAutoId('port', portfolioList) }))}
                        title="Auto generate next unique portfolio event ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., port-1"
                    value={portfolioData.identifier}
                    required
                    onChange={(e) => setPortfolioData({ ...portfolioData, identifier: e.target.value })}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Royal Wedding, TechCorp Summit"
                    value={portfolioData.title}
                    required
                    onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Category</label>
                  <select
                    required
                    value={portfolioData.category}
                    onChange={(e) => setPortfolioData({ ...portfolioData, category: e.target.value })}
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="wedding-planning">Wedding Planning</option>
                    <option value="birthday-anniversary">Birthday &amp; Anniversary</option>
                    <option value="corporate-events">Corporate Events</option>
                    <option value="decor-design">Decor &amp; Design</option>
                    <option value="catering-coordination">Catering Coordination</option>
                    <option value="venue-selection">Venue Selection</option>
                    <option value="entertainment-logistics">Entertainment &amp; Logistics</option>
                    <option value="photography-films">Photography &amp; Films</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label>Media Type</label>
                  <select
                    required
                    value={portfolioData.media_type}
                    onChange={(e) => setPortfolioData({ ...portfolioData, media_type: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Event Story / Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the royal moments, bespoke styling, and vision crafted for this celebration..."
                  value={portfolioData.story}
                  onChange={(e) => setPortfolioData({ ...portfolioData, story: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>
                  Cover / Featured Media File {selectedPortfolioId && '(Leave blank to keep existing cover)'}
                </label>
                {(portfolioFilePreview || portfolioData.media_url) && (
                  <div className={styles.mediaPreviewCard}>
                    {portfolioData.file?.type.startsWith('video/') || portfolioData.media_type === 'video' ? (
                      <video src={portfolioFilePreview || portfolioData.media_url} controls className={styles.mediaPreviewThumb} />
                    ) : (
                      <img src={portfolioFilePreview || portfolioData.media_url} alt="Cover Preview" className={styles.mediaPreviewThumb} />
                    )}
                    <div className={styles.mediaPreviewText}>
                      <strong>{portfolioData.file ? 'Selected New Cover Media' : 'Current Saved Cover Media'}</strong>
                      <span>{portfolioData.file ? portfolioData.file.name : (portfolioData.media_url?.split('/').pop() || '')}</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  required={!selectedPortfolioId && !portfolioData.media_url}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setPortfolioData({ ...portfolioData, file });
                    if (file) setPortfolioFilePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {selectedPortfolioId ? 'Update Event Details' : 'Save New Event'}
              </button>
            </form>

            {/* Gallery Images Manager for Selected Event */}
            {selectedPortfolioId && (
              <div className={styles.gallerySection}>
                <div className={styles.galleryHeader}>
                  <h3 className={styles.galleryTitle}>Multi-Image Gallery for &ldquo;{portfolioData.title || 'Event'}&rdquo;</h3>
                  <p className={styles.gallerySubtitle}>
                    Add at least 5–8+ high-resolution celebration photos. Reorder or remove photos as needed.
                  </p>
                </div>

                {/* Upload Multiple Images */}
                <form className={styles.galleryUploadBox} onSubmit={handleUploadGalleryImages}>
                  <input
                    id="multi-gallery-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setGalleryUploadFiles(Array.from(e.target.files || []))}
                  />
                  <button
                    type="submit"
                    disabled={galleryUploading || galleryUploadFiles.length === 0}
                    className={styles.addBtn}
                  >
                    {galleryUploading
                      ? 'Uploading Photos...'
                      : `Upload ${galleryUploadFiles.length > 0 ? galleryUploadFiles.length : ''} Gallery Photos`}
                  </button>
                </form>

                {/* Gallery Images List */}
                {portfolioGalleryImages.length > 0 ? (
                  <div className={styles.galleryGrid}>
                    {portfolioGalleryImages.map((img, idx) => (
                      <div key={img.id || idx} className={styles.galleryCard}>
                        <div className={styles.galleryCardImgWrapper}>
                          <span className={styles.galleryCardBadge}>#{idx + 1}</span>
                          <img src={img.image_url} alt={img.caption || 'Gallery photo'} className={styles.galleryCardImg} />
                        </div>
                        <div className={styles.galleryCardControls}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleReorderGalleryImage(idx, -1)}
                              className={styles.galleryOrderBtn}
                              title="Move Left"
                            >
                              &larr;
                            </button>
                            <button
                              type="button"
                              disabled={idx === portfolioGalleryImages.length - 1}
                              onClick={() => handleReorderGalleryImage(idx, 1)}
                              className={styles.galleryOrderBtn}
                              title="Move Right"
                            >
                              &rarr;
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            className={styles.galleryDeleteBtn}
                            title="Remove Photo"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.88rem' }}>
                    No gallery images uploaded yet for this event. Upload 5–8 photos above to enrich the luxury modal.
                  </p>
                )}
              </div>
            )}
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
            {/* 1. Client Reviews (Testimonials) */}
            <div className={styles.itemSelectBar}>
              <span className={styles.itemSelectLabel}>Select Review to Edit:</span>
              <select
                className={styles.itemSelect}
                value={selectedTestimonialId || 'new'}
                onChange={handleSelectTestimonial}
              >
                <option value="new">+ Add New Review</option>
                {testimonialsList.map(t => (
                  <option key={t.identifier} value={t.identifier}>
                    {t.name || t.identifier} ({t.stars} Stars)
                  </option>
                ))}
              </select>
              {selectedTestimonialId && (
                <button
                  type="button"
                  onClick={() => handleDeleteRecord('testimonials', testimonialData.identifier, testimonialData.name, async () => {
                    setSelectedTestimonialId(null);
                    setTestimonialData({ identifier: '', name: '', comment: '', stars: 5 });
                    await loadTestimonialsList();
                  })}
                  className={styles.deleteActionBtn}
                >
                  🗑️ Delete Review
                </button>
              )}
            </div>

            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(e, 'testimonials', {
                  identifier: testimonialData.identifier,
                  name: testimonialData.name,
                  comment: testimonialData.comment,
                  stars: testimonialData.stars,
                })
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier</label>
                    {!selectedTestimonialId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setTestimonialData(prev => ({ ...prev, identifier: getNextAutoId('rev', testimonialsList) }))}
                        title="Auto generate next unique review ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., rev-1"
                    value={testimonialData.identifier || ''}
                    required
                    readOnly={!!selectedTestimonialId}
                    style={selectedTestimonialId ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    onChange={e => setTestimonialData({...testimonialData, identifier: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh & Priya Sharma"
                    value={testimonialData.name || ''}
                    required
                    onChange={e => setTestimonialData({...testimonialData, name: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Rating (1 to 5 Stars)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="5"
                    value={testimonialData.stars || 5}
                    required
                    onChange={e => setTestimonialData({...testimonialData, stars: parseInt(e.target.value) || 5})}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Client Review / Comment</label>
                <textarea
                  placeholder="What the client said about their royal celebration experience..."
                  value={testimonialData.comment || ''}
                  rows={4}
                  required
                  onChange={e => setTestimonialData({...testimonialData, comment: e.target.value})}
                />
              </div>

              <div className={styles.actionButtonGroup}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                  {loading ? 'Saving to Database...' : selectedTestimonialId ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
                {selectedTestimonialId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedTestimonialId(null);
                      setTestimonialData({ identifier: '', name: '', comment: '', stars: 5 });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* 2. Client Video Experiences */}
            <h3 className={styles.subSectionTitle}>Client Video Experiences</h3>
            <div className={styles.itemSelectBar}>
              <span className={styles.itemSelectLabel}>Select Video Experience:</span>
              <select
                className={styles.itemSelect}
                value={selectedExperienceId || 'new'}
                onChange={handleSelectExperience}
              >
                <option value="new">+ Add New Video Experience</option>
                {experiencesList.map(ex => (
                  <option key={ex.identifier} value={ex.identifier}>
                    {ex.title || ex.identifier} ({ex.identifier})
                  </option>
                ))}
              </select>
              {selectedExperienceId && (
                <button
                  type="button"
                  onClick={() => handleDeleteRecord('experiences', experienceData.identifier, experienceData.title, async () => {
                    setSelectedExperienceId(null);
                    setExperienceData({ identifier: '', title: '', file: null, video_url: '' });
                    setExperienceFilePreview('');
                    await loadExperiencesList();
                  })}
                  className={styles.deleteActionBtn}
                >
                  🗑️ Delete Experience
                </button>
              )}
            </div>

            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'experiences',
                  { identifier: experienceData.identifier, title: experienceData.title },
                  experienceData.file ? { file: experienceData.file, bucket: 'testimonials', columnName: 'video_url' } : null
                )
              }
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier</label>
                    {!selectedExperienceId && (
                      <button
                        type="button"
                        className={styles.autoIdBtn}
                        onClick={() => setExperienceData(prev => ({ ...prev, identifier: getNextAutoId('exp-video', experiencesList) }))}
                        title="Auto generate next unique video experience ID"
                      >
                        ⚡ Auto ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. exp-video-1"
                    value={experienceData.identifier || ''}
                    required
                    readOnly={!!selectedExperienceId}
                    style={selectedExperienceId ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    onChange={e => setExperienceData({...experienceData, identifier: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Video Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The Royal Ranchi Wedding"
                    value={experienceData.title || ''}
                    required
                    onChange={e => setExperienceData({...experienceData, title: e.target.value})}
                  />
                </div>
              </div>

              {/* Video/Media Preview */}
              {(experienceFilePreview || experienceData.video_url) && (
                <div className={styles.mediaPreviewCard}>
                  {isVideoUrl(experienceFilePreview || experienceData.video_url) ? (
                    <video src={experienceFilePreview || experienceData.video_url} controls className={styles.mediaPreviewThumb} />
                  ) : (
                    <img src={experienceFilePreview || experienceData.video_url} alt="Experience Media" className={styles.mediaPreviewThumb} />
                  )}
                  <div className={styles.mediaPreviewText}>
                    <strong>{experienceData.file ? 'Selected New Media File' : 'Current Saved Media File'}</strong>
                    <span>{experienceData.file ? experienceData.file.name : (experienceData.video_url?.split('/').pop() || '')}</span>
                  </div>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label>Video / Media File {selectedExperienceId && '(Leave blank to keep existing file)'}</label>
                <input
                  type="file"
                  accept="video/*, image/*"
                  required={!selectedExperienceId && !experienceData.video_url}
                  onChange={e => {
                    const file = e.target.files[0];
                    setExperienceData({...experienceData, file});
                    if (file) setExperienceFilePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className={styles.actionButtonGroup}>
                <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
                  {loading ? 'Saving to Database & R2...' : selectedExperienceId ? 'Update Experience Media' : 'Save Experience Media'}
                </button>
                {selectedExperienceId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedExperienceId(null);
                      setExperienceData({ identifier: '', title: '', file: null, video_url: '' });
                      setExperienceFilePreview('');
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* 3. Smiles We Created */}
            <h3 className={styles.subSectionTitle}>Smiles We Created (Images)</h3>

            {/* Existing Smiles Visual Grid with Previews & Delete */}
            {smilesList.length > 0 ? (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: 600, color: '#7b1a28', marginBottom: '10px', fontSize: '0.92rem' }}>
                  Current Smiles ({smilesList.length} Photos in Database &amp; R2)
                </div>
                <div className={styles.galleryGrid}>
                  {smilesList.map((s, idx) => (
                    <div key={s.identifier || idx} className={styles.galleryCard}>
                      <div className={styles.galleryCardImgWrapper}>
                        <span className={styles.galleryCardBadge}>{s.identifier}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image_url} alt={s.identifier} className={styles.galleryCardImg} />
                      </div>
                      <div className={styles.galleryCardControls} style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord('smiles', s.identifier, `Smile "${s.identifier}"`, loadSmilesList)}
                          className={styles.galleryDeleteBtn}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          title="Delete smile photo from DB and R2"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#888', fontStyle: 'italic', margin: '12px 0 20px 0' }}>
                No smiles photos in database yet. Add one below.
              </p>
            )}

            {/* Add Smile Photo Form */}
            <form
              className={styles.group}
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'smiles',
                  { identifier: smileData.identifier },
                  smileData.file ? { file: smileData.file, bucket: 'smiles', columnName: 'image_url' } : null
                )
              }
            >
              <div style={{ fontWeight: 700, color: '#7b1a28', marginBottom: '12px', fontSize: '0.96rem' }}>
                + Add New Smile Photo
              </div>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithAction}>
                    <label style={{ margin: 0 }}>Identifier</label>
                    <button
                      type="button"
                      className={styles.autoIdBtn}
                      onClick={() => setSmileData(prev => ({ ...prev, identifier: getNextAutoId('smile', smilesList) }))}
                      title="Auto generate next unique smile ID"
                    >
                      ⚡ Auto ID
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. smile-1"
                    value={smileData.identifier || ''}
                    required
                    onChange={e => setSmileData({...smileData, identifier: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Photo File</label>
                  <input
                    id="smile-file-input"
                    type="file"
                    accept="image/*"
                    required
                    onChange={e => {
                      const file = e.target.files[0];
                      setSmileData({...smileData, file});
                      if (file) setSmileFilePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>

              {smileFilePreview && (
                <div className={styles.mediaPreviewCard}>
                  <img src={smileFilePreview} alt="Smile Preview" className={styles.mediaPreviewThumb} />
                  <div className={styles.mediaPreviewText}>
                    <strong>Selected Smile Photo</strong>
                    <span>{smileData.file?.name}</span>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Saving to Database & R2...' : 'Save Smile Image'}
              </button>
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
                  <input
                    type="email"
                    placeholder="rajhanshevent@gmail.com"
                    value={contactData.email || ''}
                    onChange={e => setContactData({...contactData, email: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 99050 02293"
                    value={contactData.phone || ''}
                    onChange={e => setContactData({...contactData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Office / Venue Location</label>
                <input
                  type="text"
                  placeholder="Maa Aamdmai Nagar, Kathitand, Ratu, Ranchi, Jharkhand 835222"
                  value={contactData.location || ''}
                  onChange={e => setContactData({...contactData, location: e.target.value})}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Instagram URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/rajhanshevent"
                    value={contactData.insta || ''}
                    onChange={e => setContactData({...contactData, insta: e.target.value})}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Facebook URL</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/rajhanshevent"
                    value={contactData.fb || ''}
                    onChange={e => setContactData({...contactData, fb: e.target.value})}
                  />
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