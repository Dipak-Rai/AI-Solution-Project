import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const photoMap = import.meta.glob('../photo/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const TABS = [
  { key: 'contacts', label: 'Contacts', icon: 'users' },
  { key: 'articles', label: 'Articles', icon: 'document' },
  { key: 'events', label: 'Events', icon: 'calendar' },
  { key: 'gallery', label: 'Gallery', icon: 'photo' },
  { key: 'feedback', label: 'Feedback', icon: 'chat' },
  { key: 'chatlogs', label: 'Chatbot Sessions', icon: 'chat' },
  { key: 'demos', label: 'Demos', icon: 'rocket' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

const iconMap = {
  users: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
  photo: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <path d="m21 15-5-5L9 18" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18a8 8 0 0 1-2-2l-4 4 4-4a8 8 0 0 1 2-2" />
      <path d="M22 2 11 13" />
      <path d="m22 2-4 4" />
      <path d="M16 8 6 18" />
      <path d="M7 22h4" />
      <path d="M11 18h4" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.27 16.38l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.67 0 1.24-.42 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 2.27A2 2 0 1 1 7.12.94l.06.06A1.65 1.65 0 0 0 9 1.33c.27.58.84 1 1.51 1H12a2 2 0 1 1 0 4h-.09c-.67 0-1.24.42-1.51 1a1.65 1.65 0 0 0 .33 1.82l.06.06A2 2 0 1 1 16.88 7.06l-.06-.06a1.65 1.65 0 0 0 .33 1.82c.27.58.84 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.67 0-1.24.42-1.51 1z" />
    </svg>
  ),
};

const SECTION_CONFIG = {
  contacts: {
    label: 'Contacts',
    endpoint: '/contact',
    tableHeaders: [
      { label: 'Name', key: 'fullName' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Company', key: 'company' },
      { label: 'Country', key: 'country' },
      { label: 'Job title', key: 'jobTitle' },
      { label: 'Date', key: 'createdAt' },
    ],
    formFields: [
      { name: 'fullName', label: 'Full name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'country', label: 'Country', type: 'text' },
      { name: 'jobTitle', label: 'Job title', type: 'text' },
      { name: 'jobDetails', label: 'Job details', type: 'textarea' },
    ],
  },
  articles: {
    label: 'Articles',
    endpoint: '/articles',
    tableHeaders: [
      { label: 'Title', key: 'title' },
      { label: 'Author', key: 'author' },
      { label: 'Content', key: 'content' },
      { label: 'Document', key: 'fileName' },
      { label: 'Date', key: 'createdAt' },
    ],
    formFields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'content', label: 'Content', type: 'textarea' },
      { name: 'createdAt', label: 'Date', type: 'date' },
    ],
  },
  events: {
    label: 'Events',
    endpoint: '/events',
    tableHeaders: [
      { label: 'Name', key: 'name' },
      { label: 'Organizer', key: 'email' },
      { label: 'Date', key: 'createdAt' },
    ],
    formFields: [
      { name: 'name', label: 'Event name', type: 'text' },
      { name: 'email', label: 'Organizer email', type: 'email' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'text' },
    ],
  },
  gallery: {
    label: 'Gallery',
    endpoint: '/gallery',
    tableHeaders: [
      { label: 'Title', key: 'title' },
      { label: 'Category', key: 'category' },
      { label: 'Date', key: 'eventDate' },
      { label: 'Description', key: 'description' },
    ],
    formFields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
      {
        name: 'category', label: 'Category', type: 'select', options: [
          { value: 'latest', label: 'Latest' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'general', label: 'General' },
        ]
      },
      { name: 'eventDate', label: 'Event Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  feedback: {
    label: 'Feedback',
    endpoint: '/feedback',
    tableHeaders: [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Comment', key: 'comment' },
    ],
    formFields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'comment', label: 'Comment', type: 'textarea' },
    ],
  },
  chatlogs: {
    label: 'Chatbot Sessions',
    endpoint: '/chatbot',
    tableHeaders: [
      { label: 'User message', key: 'userMessage' },
      { label: 'Bot response', key: 'botResponse' },
      { label: 'Timestamp', key: 'createdAt' },
    ],
    formFields: [],
  },
  demos: {
    label: 'Demos',
    endpoint: '/demo',
    tableHeaders: [
      { label: 'Title', key: 'title' },
      { label: 'Email', key: 'email' },
      { label: 'Date', key: 'createdAt' },
    ],
    formFields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'comment', label: 'Notes', type: 'textarea' },
    ],
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contacts');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('admin_theme', theme); } catch (e) { }
  }, [theme]);

  const [contacts, setContacts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [demos, setDemos] = useState([]);
  const [chatlogs, setChatlogs] = useState([]);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [selectedGalleryItems, setSelectedGalleryItems] = useState(new Set());
  const [galleryViewMode, setGalleryViewMode] = useState('grid');
  const [galleryLightboxItem, setGalleryLightboxItem] = useState(null);
  const [gallerySortBy, setGallerySortBy] = useState('recent');

  const [galleryCategory, setGalleryCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [viewingChatSession, setViewingChatSession] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoadingData(true);
    setError('');
    try {
      const endpoints = ['contact', 'articles', 'events', 'gallery', 'feedback', 'demo', 'chatbot'];
      const results = await Promise.allSettled(endpoints.map((path) => api.get(`/${path}`)));

      const responseMap = results.reduce((acc, result, index) => {
        const key = endpoints[index];
        if (result.status === 'fulfilled') {
          if (key === 'gallery') {
            acc[key] = Array.isArray(result.value?.data?.items) ? result.value.data.items : [];
          } else {
            acc[key] = result.value?.data || [];
          }
        } else {
          console.error(`Failed to load ${key}`, result.reason);
          acc[key] = [];
        }
        return acc;
      }, {});

      setContacts(responseMap.contact);
      setArticles(responseMap.articles);
      setEvents(responseMap.events);
      setGallery(responseMap.gallery);
      setFeedback(responseMap.feedback);
      setDemos(responseMap.demo);
      setChatlogs(Array.isArray(responseMap.chatbot) ? responseMap.chatbot : []);

      // If gallery failed initially, attempt a single retry with a longer timeout
      try {
        const galleryIndex = endpoints.indexOf('gallery');
        if (results[galleryIndex] && results[galleryIndex].status === 'rejected') {
          const retryResp = await api.get('/gallery', { timeout: 120000 });
          const items = Array.isArray(retryResp.data.items) ? retryResp.data.items : [];
          setGallery(items);
          // clear gallery from failed list if retry succeeded
        }
      } catch (retryErr) {
        console.error('Gallery retry failed', retryErr);
      }

      const failedSections = results
        .map((result, index) => (result.status === 'rejected' ? endpoints[index] : null))
        .filter(Boolean);
      if (failedSections.length) {
        setError(`Failed to load: ${failedSections.join(', ')}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
      setError('Logout failed');
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    // if editing an article, try to load a draft
    if (activeTab === 'articles' && item && item._id) {
      try {
        const draft = JSON.parse(localStorage.getItem(`article-draft-${item._id}`) || 'null');
        setFormData(draft || item || {});
      } catch (e) {
        setFormData(item || {});
      }
      setAutoSaveEnabled(false);
    } else {
      setFormData(item || {});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      // Client-side validation for articles
      if (activeTab === 'articles') {
        if (!formData.title || !formData.author || !formData.content) {
          setError('Title, author and content are required for articles');
          return;
        }
      }

      // Prepare data for submission
      let dataToSubmit = { ...formData };

      // For gallery items, map fileUrl to imageUrl if fileUrl exists
      if (activeTab === 'gallery' && dataToSubmit.fileUrl && !dataToSubmit.imageUrl) {
        dataToSubmit.imageUrl = dataToSubmit.fileUrl;
        delete dataToSubmit.fileUrl; // Remove fileUrl since backend expects imageUrl
      }

      const method = editingItem ? 'put' : 'post';
      const activeSection = SECTION_CONFIG[activeTab] || SECTION_CONFIG.contacts;
      const endpoint = `${activeSection.endpoint}${editingItem ? `/${editingItem._id}` : ''}`;
      if (method === 'put') await api.put(endpoint, dataToSubmit);
      else await api.post(endpoint, dataToSubmit);

      setSuccess('Saved successfully');
      setTimeout(() => setSuccess(''), 2500);
      closeModal();
      loadAllData();

      // clear any saved draft for this article
      if (activeTab === 'articles' && editingItem) {
        try { localStorage.removeItem(`article-draft-${editingItem._id}`); } catch (e) { }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const openReplyModal = (contact) => {
    setReplyTarget(contact);
    setReplySubject(`Re: ${contact?.fullName || 'your inquiry'}`);
    setReplyBody('');
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyTarget(null);
    setReplySubject('');
    setReplyBody('');
  };

  const handleSendReply = () => {
    if (!replyTarget?.email) return;
    const mailto = `mailto:${encodeURIComponent(replyTarget.email)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
    window.location.href = mailto;
    closeReplyModal();
  };

  // File upload / editor helpers for articles
  const readFileAsDataUrl = (file, onProgress) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read error'));
    reader.onprogress = (evt) => {
      if (evt.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    };
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const handleFileInput = async (file) => {

    if (!file) return;

    try {

      setIsUploading(true);

      setUploadProgress(30);

      const form =
        new FormData();

      form.append(
        'file',
        file
      );

      const res =
        await api.post(
          '/upload',
          form,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      setUploadProgress(100);

      if (
        activeTab === 'gallery'
      ) {

        setFormData(
          (p) => ({
            ...p,

            imageUrl:
              res.data.fileUrl,

            fileName:
              file.name,
          })
        );

      }

      else {

        setFormData(
          (p) => ({
            ...p,

            fileUrl:
              res.data.fileUrl,

            fileName:
              file.name,
          })
        );

      }

    }

    catch (err) {

      console.error(
        'Upload failed',
        err
      );

      setError(
        'File upload failed'
      );

    }

    finally {

      setIsUploading(
        false
      );

      setTimeout(
        () =>
          setUploadProgress(
            0
          ),
        400
      );

    }

  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const form = new FormData();

    form.append('file', file);

    try {

      const res =
        await api.post(
          '/upload',
          form,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      setFormData((prev) => ({
        ...prev,

        fileUrl:
          res.data.fileUrl,

        fileName:
          file.name,
      }));

    } catch (err) {

      console.error(
        'Upload failed',
        err
      );

    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileInput(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      const endpoint = `${SECTION_CONFIG[type]?.endpoint || SECTION_CONFIG.contacts.endpoint}/${id}`;
      await api.delete(endpoint);
      setSuccess('Deleted successfully');
      setTimeout(() => setSuccess(''), 2000);
      loadAllData();
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    }
  };

  const dataMap = { contacts, articles, events, gallery, feedback, demos, chatlogs };

  const getRawData = () => {
    if (activeTab === 'gallery') {
      const list = galleryCategory === 'all' ? gallery : gallery.filter((item) => item.category === galleryCategory);
      return list;
    }
    return dataMap[activeTab] || [];
  };

  const filtered = useMemo(() => {
    const s = (searchQuery || '').toLowerCase().trim();
    const items = getRawData();
    return items.filter((item) => {
      if (!s) return true;
      return Object.values(item || {}).some((v) => String(v || '').toLowerCase().includes(s));
    });
  }, [activeTab, searchQuery, contacts, articles, events, gallery, feedback, demos, galleryCategory]);

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = String(a[sortConfig.key] ?? '').toLowerCase();
      const B = String(b[sortConfig.key] ?? '').toLowerCase();
      return sortConfig.direction === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
    return arr;
  }, [filtered, sortConfig]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const activeSection = SECTION_CONFIG[activeTab] || SECTION_CONFIG.contacts;

  // autosave drafts for articles when enabled
  useEffect(() => {
    if (activeTab === 'articles' && autoSaveEnabled && editingItem && editingItem._id) {
      try {
        localStorage.setItem(`article-draft-${editingItem._id}`, JSON.stringify(formData || {}));
      } catch (e) {
        console.warn('Unable to save draft', e);
      }
    }
  }, [formData, autoSaveEnabled]);

  const stats = useMemo(() => Object.keys(dataMap).map((key) => ({
    label: SECTION_CONFIG[key]?.label || key,
    value: dataMap[key].length,
    change: '',
  })), [contacts, articles, events, gallery, feedback, demos]);

  const tableHeaders = activeSection.tableHeaders;

  const renderCellValue = (item, key) => {
    const value = item[key];
    if (value === undefined || value === null || value === '') return '—';
    if (key === 'createdAt' || key === 'date') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
    }
    if (key === 'content') {
      const text = String(value).replace(/<[^>]*>/g, '');
      return text.length > 140 ? `${text.slice(0, 140).trim()}…` : text;
    }
    return String(value);
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleImageLoad = (id) => {
    setImageLoadStates((prev) => ({ ...prev, [id]: 'loaded' }));
  };

  const handleImageError = (id) => {
    setImageLoadStates((prev) => ({ ...prev, [id]: 'error' }));
  };

  const adminGetAssetUrl = (fileName) => {
    if (!fileName) return null;
    return photoMap[`../photo/${fileName}`] || null;
  };

  const toggleGalleryItemSelection = (id) => {
    const newSet = new Set(selectedGalleryItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedGalleryItems(newSet);
  };

  const toggleAllGallerySelection = () => {
    if (selectedGalleryItems.size === paged.length) {
      setSelectedGalleryItems(new Set());
    } else {
      const newSet = new Set(paged.map((item) => item._id || item.id));
      setSelectedGalleryItems(newSet);
    }
  };

  const handleBulkDeleteGallery = async () => {
    if (selectedGalleryItems.size === 0) return;
    if (!window.confirm(`Delete ${selectedGalleryItems.size} items?`)) return;

    try {
      const itemsToDelete = Array.from(selectedGalleryItems);
      await Promise.all(
        itemsToDelete.map((id) =>
          api.delete(`${SECTION_CONFIG.gallery.endpoint}/${id}`).catch((err) => {
            console.error(`Failed to delete ${id}:`, err);
          })
        )
      );
      setSuccess(`Deleted ${itemsToDelete.length} items`);
      setTimeout(() => setSuccess(''), 2500);
      setSelectedGalleryItems(new Set());
      loadAllData();
    } catch (err) {
      console.error(err);
      setError('Bulk delete failed');
    }
  };

  const getGalleryStats = useMemo(() => {
    const items = gallery;
    return {
      total: items.length,
      latest: items.filter((i) => i.category === 'latest').length,
      upcoming: items.filter((i) => i.category === 'upcoming').length,
      general: items.filter((i) => i.category === 'general').length,
    };
  }, [gallery]);

  const getSortedGalleryItems = (items) => {
    const sorted = [...items];
    if (gallerySortBy === 'recent') {
      sorted.sort((a, b) => new Date(b.eventDate || b.createdAt) - new Date(a.eventDate || a.createdAt));
    } else if (gallerySortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.eventDate || a.createdAt) - new Date(b.eventDate || b.createdAt));
    } else if (gallerySortBy === 'alphabetical') {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return sorted;
  };

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-50 text-slate-900'}>
      <div className="flex min-h-screen">
        <aside className={`transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-slate-100 border-r border-slate-800`}>
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
                  <span className="text-lg font-semibold">AI</span>
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Ai Solutions</p>
                    <p className="text-lg font-semibold">Admin Console</p>
                  </div>
                )}
              </div>

              <nav className="space-y-1">
                {TABS.map((tab) => {
                  const active = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => { if (tab.key === 'settings') { navigate('/admin/settings'); } else { setActiveTab(tab.key); setCurrentPage(1); } }}
                      className={`group flex w-full items-center gap-3 rounded-3xl px-3 py-3 text-left text-sm transition ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'}`}
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-800 text-cyan-300">{iconMap[tab.icon]}</span>
                      {!sidebarCollapsed && <span>{tab.label}</span>}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4">
                <button onClick={() => navigate('/admin/analytics')} className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-slate-800 hover:bg-slate-800">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v4H3z" /><path d="M7 13h10v8H7z" /></svg>
                  {!sidebarCollapsed && <span className="text-gray-200">Analytics</span>}
                </button>
              </div>

            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSidebarCollapsed((value) => !value)}
                className="flex w-full items-center justify-between rounded-3xl border border-slate-700/70 bg-slate-800/90 px-3 py-3 text-sm text-slate-300 hover:bg-slate-700"
              >
                <span>{sidebarCollapsed ? 'Expand' : 'Collapse'}</span>
                <span className="text-cyan-300">⟷</span>
              </button>
              <button
                onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}
                className="flex w-full items-center justify-between rounded-3xl border border-slate-700/70 bg-slate-800/90 px-3 py-3 text-sm text-slate-300 hover:bg-slate-700"
              >
                <span>Mode</span>
                <span className="text-cyan-300">{theme === 'dark' ? '🌙' : '☀️'}</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">Executive control</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">AI Solutions Admin</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">A premium operations workspace designed for content, service, and performance management.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={loadAllData} className="rounded-3xl border border-slate-300/10 bg-white/95 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-cyan-50">
                Refresh data
              </button>
              <button onClick={handleLogout} className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-105">
                Logout
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          )}
          <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{stat.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                    <span className="rounded-2xl bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-600 dark:text-cyan-300">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/90">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Performance pulse</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Monthly engagement</h2>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">Live</div>
              </div>

              <div className="mt-6 h-40 overflow-hidden rounded-3xl bg-slate-950/5 p-4 dark:bg-slate-800/80">
                <svg viewBox="0 0 320 140" className="h-full w-full">
                  <path d="M10 110 C60 80 110 50 160 70 C210 90 260 40 310 65" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="10" cy="110" r="4" fill="#06b6d4" />
                  <circle cx="160" cy="70" r="4" fill="#06b6d4" />
                  <circle cx="310" cy="65" r="4" fill="#06b6d4" />
                </svg>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Reach</p>
                  <p className="mt-2 text-lg font-semibold">{Math.max(1200, contacts.length * 3)}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Feedback</p>
                  <p className="mt-2 text-lg font-semibold">{feedback.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Campaigns</p>
                  <p className="mt-2 text-lg font-semibold">{events.length}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/90">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Content management</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setSearchQuery('')} className="rounded-full border bg-cyan-600 border-slate-200 px-4 py-2 text-sm text-slate-950 transition hover:bg-slate-100 dark:border-slate-700/80 dark:text-slate-200 dark:hover:bg-slate-800">
                    Clear search
                  </button>
                  <button onClick={() => openModal()} className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-cyan-500/20 hover:bg-cyan-500">
                    Add new item
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Active tab</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{activeTab}</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Total items</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{getRawData().length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Search query</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{searchQuery || 'None'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-950/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Current page</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{currentPage}</p>
                </div>
              </div>
            </div>

          </section>

          <section className="mt-5 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/95">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Data table</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{TABS.find((tab) => tab.key === activeTab)?.label} overview</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700/80 dark:text-slate-300">
                  <span>Page size</span>
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="bg-transparent outline-none">
                    {[5, 8, 12].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </label>
                <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder={`Search ${TABS.find((tab) => tab.key === activeTab)?.label}`} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100" />
              </div>
            </div>

            <div className="space-y-4">
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Gallery Statistics */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">Total Images</p>
                      <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{getGalleryStats.total}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-4 dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">Latest</p>
                      <p className="mt-2 text-2xl font-bold text-cyan-600 dark:text-cyan-400">{getGalleryStats.latest}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">Upcoming</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{getGalleryStats.upcoming}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">General</p>
                      <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{getGalleryStats.general}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">Selected</p>
                      <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">{selectedGalleryItems.size}</p>
                    </div>
                  </div>

                  {/* Gallery Controls */}
                  <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-700/80 dark:bg-slate-950/90">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-2">
                        {['all', 'latest', 'upcoming', 'general'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setGalleryCategory(cat);
                              setCurrentPage(1);
                              setSelectedGalleryItems(new Set());
                            }}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${galleryCategory === cat
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-800'
                              }`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        ))}
                      </div>

                      {/* View Mode & Sort */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 p-1 dark:border-slate-700/80">
                          <button
                            onClick={() => setGalleryViewMode('grid')}
                            className={`rounded-full px-3 py-2 text-sm font-medium transition ${galleryViewMode === 'grid'
                              ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                              }`}
                          >
                            ⊞ Grid
                          </button>
                          <button
                            onClick={() => setGalleryViewMode('list')}
                            className={`rounded-full px-3 py-2 text-sm font-medium transition ${galleryViewMode === 'list'
                              ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                              }`}
                          >
                            ≡ List
                          </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                          value={gallerySortBy}
                          onChange={(e) => setGallerySortBy(e.target.value)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="recent">Recent first</option>
                          <option value="oldest">Oldest first</option>
                          <option value="alphabetical">A-Z</option>
                        </select>

                        {/* Bulk Delete Button */}
                        {selectedGalleryItems.size > 0 && (
                          <button
                            onClick={handleBulkDeleteGallery}
                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                          >
                            Delete ({selectedGalleryItems.size})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gallery Content */}
                  {paged.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200/80 border-dashed bg-white/90 p-16 text-center shadow-sm dark:border-slate-700/80 dark:bg-slate-950/90">
                      <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-lg font-semibold text-slate-500 dark:text-slate-400">No gallery items found</p>
                      <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters or add new images</p>
                    </div>
                  ) : galleryViewMode === 'grid' ? (
                    <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
                      {getSortedGalleryItems(paged).map((item) => {
                        const id = item._id || item.id;
                        const isSelected = selectedGalleryItems.has(id);
                        const loadState = imageLoadStates[id] || 'loading';
                        return (
                          <div
                            key={id}
                            className={`group relative overflow-hidden rounded-3xl border transition duration-300 ${isSelected
                              ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                              : 'border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80'
                              } bg-white/90 dark:bg-slate-950/90`}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleGalleryItemSelection(id)}
                              className={`absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-lg border-2 transition ${isSelected
                                ? 'border-cyan-500 bg-cyan-500'
                                : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                                }`}
                            >
                              {isSelected && <span className="text-sm font-bold text-white">✓</span>}
                            </button>

                            {/* Image Container */}
                            <button
                              onClick={() => setGalleryLightboxItem(item)}
                              className="relative block h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-900"
                            >
                              {(() => {
                                const src = item.imageUrl || item.fileUrl || adminGetAssetUrl(item.fileName) || null;
                                const isLoadingImage = src && loadState === 'loading';
                                return (
                                  <>
                                    {isLoadingImage && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                                        <div className="text-center">
                                          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-cyan-500 dark:border-slate-700 dark:border-t-cyan-400" />
                                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Loading...</p>
                                        </div>
                                      </div>
                                    )}
                                    {src ? (
                                      <img
                                        src={src}
                                        alt={item.title}
                                        onLoad={() => handleImageLoad(id)}
                                        onError={() => handleImageError(id)}
                                        className={`h-full w-full object-cover transition duration-500 group-hover:scale-110 ${loadState === 'loaded' ? 'opacity-100' : 'opacity-0'
                                          }`}
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                        <p className="text-sm text-slate-500">No preview</p>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}

                              {/* Category Badge */}
                              <span className={`absolute left-3 top-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${item.category === 'latest' ? 'bg-blue-600' :
                                item.category === 'upcoming' ? 'bg-emerald-600' :
                                  'bg-slate-600'
                                }`}>
                                {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
                              </span>

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
                                <span className="text-white opacity-0 transition duration-300 group-hover:opacity-100 text-sm font-semibold">🔍 Preview</span>
                              </div>
                            </button>

                            {/* Content */}
                            <div className="p-4">
                              <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2 text-sm">{item.title}</h4>
                              <div className="mt-3 flex items-center justify-between">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {item.eventDate ? new Date(item.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                                </p>
                              </div>
                              {item.description && (
                                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="border-t border-slate-200/80 px-4 py-3 dark:border-slate-700/80">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openModal(item)}
                                  className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(id, activeTab)}
                                  className="flex-1 rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getSortedGalleryItems(paged).map((item) => {
                        const id = item._id || item.id;
                        const isSelected = selectedGalleryItems.has(id);
                        const loadState = imageLoadStates[id] || 'loading';
                        return (
                          <div
                            key={id}
                            className={`group flex gap-4 overflow-hidden rounded-3xl border p-4 transition ${isSelected
                              ? 'border-cyan-500 bg-cyan-50/30 shadow-lg shadow-cyan-500/10'
                              : 'border-slate-200/80 bg-white/90 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-950/90'
                              }`}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleGalleryItemSelection(id)}
                              className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${isSelected
                                ? 'border-cyan-500 bg-cyan-500'
                                : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                                }`}
                            >
                              {isSelected && <span className="text-xs font-bold text-white">✓</span>}
                            </button>

                            {/* Thumbnail */}
                            <button
                              onClick={() => setGalleryLightboxItem(item)}
                              className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900"
                            >
                              {(() => {
                                const src = item.imageUrl || item.fileUrl || adminGetAssetUrl(item.fileName) || null;
                                return src ? (
                                  <img src={src} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-110" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No img</div>
                                );
                              })()}
                            </button>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>
                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    <span className={`inline-flex rounded-full px-2 py-1 font-medium text-white ${item.category === 'latest' ? 'bg-blue-600' :
                                      item.category === 'upcoming' ? 'bg-emerald-600' :
                                        'bg-slate-600'
                                      }`}>
                                      {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
                                    </span>
                                    <span>{item.eventDate ? new Date(item.eventDate).toLocaleDateString() : 'No date'}</span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openModal(item)}
                                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(id, activeTab)}
                                    className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {paged.length > 0 && (
                    <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700/80 dark:bg-slate-950/90 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{paged.length}</span> of <span className="font-semibold">{sorted.length}</span> items in <span className="font-semibold">{galleryCategory}</span> category
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          ← Prev
                        </button>
                        <span className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-700">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chatlogs' && (
                <div className="grid gap-4 lg:hidden">
                  {paged.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-center text-slate-500 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/90 dark:text-slate-400">
                      No chatbot sessions found.
                    </div>
                  ) : (
                    paged.map((item) => (
                      <div key={item._id || item.id} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-950/90">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Chat Session</p>
                              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{item.userMessage || 'User'} → Bot</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'No timestamp'}
                            </span>
                          </div>
                          <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">User message</p>
                              <p className="mt-2 text-sm leading-6">{item.userMessage}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Bot response</p>
                              <p className="mt-2 text-sm leading-6 text-slate-900 dark:text-white">{item.botResponse}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setViewingChatSession(item)}
                            className="rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
                          >
                            View full log
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Article mobile view is currently not rendered here */}
              <div className="hidden lg:block overflow-x-auto rounded-3xl border border-slate-200/80 bg-slate-50 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80">
                {activeTab !== 'gallery' ? (
                  <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300">
                      <tr>
                        {tableHeaders.map((header) => (
                          <th key={header.key} className="px-5 py-4 font-medium uppercase tracking-[0.2em]">
                            <button onClick={() => handleSort(header.key)} className="flex items-center gap-2">
                              {header.label}
                              {sortConfig.key === header.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                            </button>
                          </th>
                        ))}
                        <th className="px-5 py-4 text-right font-medium uppercase tracking-[0.2em]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.length === 0 ? (
                        <tr>
                          <td colSpan={tableHeaders.length + 1} className="px-5 py-8 text-center text-slate-500">No items found.</td>
                        </tr>
                      ) : (
                        paged.map((item) => (
                          <tr key={item._id || item.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/80">
                            {tableHeaders.map((header) => (
                              <td key={header.key} className="px-5 py-4 align-top text-slate-600 dark:text-slate-300">
                                {renderCellValue(item, header.key)}
                              </td>
                            ))}
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex flex-wrap justify-end gap-2">
                                {activeTab === 'contacts' ? (
                                  <button onClick={() => openReplyModal(item)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">Reply</button>
                                ) : activeTab === 'feedback' ? null : (
                                  <button onClick={() => openModal(item)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">Edit</button>
                                )}
                                <button onClick={() => handleDelete(item._id || item.id, activeTab)} className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400">
              {activeTab !== 'gallery' && (
                <>
                  <span>Showing {paged.length} of {sorted.length} results</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">Prev</button>
                    <span>{currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">Next</button>
                  </div>
                </>
              )}
            </div>
          </section>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
              <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Editor</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{editingItem ? 'Edit' : 'Create'} {TABS.find((tab) => tab.key === activeTab)?.label}</h2>
                  </div>
                  <button onClick={closeModal} className="rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Close</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeTab === 'articles' ? (
                    <>
                      <input
                        name="title"
                        value={formData.title || ''}
                        onChange={handleFormChange}
                        placeholder="Article title"
                        className="sm:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <input
                        name="author"
                        value={formData.author || ''}
                        onChange={handleFormChange}
                        placeholder="Author name"
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <input
                        name="createdAt"
                        type="date"
                        value={formData.createdAt ? (new Date(formData.createdAt)).toISOString().slice(0, 10) : ''}
                        onChange={(e) => setFormData(p => ({ ...p, createdAt: e.target.value }))}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea
                          name="content"
                          value={formData.content || ''}
                          onChange={handleFormChange}
                          placeholder="Write the article description here..."
                          className="min-h-[180px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm text-slate-600">Upload document (PDF, DOC, DOCX, images)</label>
                        <div onDrop={handleDrop} onDragOver={handleDragOver} className="rounded-2xl border-dashed border-2 border-slate-200 p-6 text-center bg-slate-50 dark:bg-slate-900">
                          <p className="text-sm text-slate-600 mb-3">Drag & drop a file here, or</p>
                          <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} />
                          {formData.fileName && <p className="mt-3 text-sm text-slate-700">Selected file: {formData.fileName}</p>}
                          {isUploading || uploadProgress > 0 ? (
                            <div className="mt-3 h-2 w-full rounded bg-slate-200 overflow-hidden">
                              <div style={{ width: `${uploadProgress}%` }} className="h-full bg-cyan-500 transition-all" />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.target.checked)} />
                          <span>Auto-save draft</span>
                        </label>
                        <button type="button" onClick={() => setPreviewArticle(formData)} className="ml-auto rounded-full border px-4 py-2 text-sm">Preview</button>
                      </div>
                    </>
                  ) : activeTab === 'gallery' ? (
                    <>
                      {/* Image Preview */}
                      {formData.imageUrl && (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Preview</label>
                          <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
                            <img src={formData.imageUrl} alt="preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      )}

                      <input
                        name="title"
                        value={formData.title || ''}
                        onChange={handleFormChange}
                        placeholder="Gallery title"
                        className="sm:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <input
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleFormChange}
                        placeholder="Image URL"
                        className="sm:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <select
                        name="category"
                        value={formData.category || ''}
                        onChange={handleFormChange}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select category</option>
                        <option value="latest">Latest</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="general">General</option>
                      </select>

                      <input
                        name="eventDate"
                        type="date"
                        value={formData.eventDate ? (new Date(formData.eventDate)).toISOString().slice(0, 10) : ''}
                        onChange={(e) => setFormData(p => ({ ...p, eventDate: e.target.value }))}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleFormChange}
                        placeholder="Image description"
                        className="sm:col-span-2 h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />

                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Upload image (JPG, PNG, WebP)</label>
                        <div onDrop={handleDrop} onDragOver={handleDragOver} className="rounded-2xl border-dashed border-2 border-slate-200 p-6 text-center bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-cyan-400 transition">
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Drag & drop image here, or click to browse</p>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="galleryFile" />
                          <label htmlFor="galleryFile" className="cursor-pointer">
                            <span className="inline-block rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500">Choose Image</span>
                          </label>
                          {formData.fileName && <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Selected: {formData.fileName}</p>}
                          {isUploading || uploadProgress > 0 ? (
                            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden dark:bg-slate-700">
                              <div style={{ width: `${uploadProgress}%` }} className="h-full bg-cyan-500 transition-all" />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </>
                  ) : (
                    activeSection.formFields.map((field) => (
                      field.type === 'textarea' ? (
                        <textarea
                          key={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleFormChange}
                          placeholder={field.label}
                          className="sm:col-span-2 h-36 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          key={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleFormChange}
                          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          key={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={handleFormChange}
                          placeholder={field.label}
                          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                      )
                    ))
                  )}
                </div>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button onClick={closeModal} className="rounded-3xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                  <button onClick={handleSave} className="rounded-3xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">Save changes</button>
                </div>
              </div>
            </div>
          )}

          {isReplyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
              <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Reply to contact</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Reply by email</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Send an email response directly from the admin panel using your default mail client.</p>
                  </div>
                  <button onClick={closeReplyModal} className="rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Close</button>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm text-slate-500 dark:text-slate-400">To</p>
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">{replyTarget?.email || 'No email available'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{replyTarget?.fullName}</p>
                  </div>

                  <input
                    name="replySubject"
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />

                  <textarea
                    name="replyBody"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write your reply"
                    rows={6}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button onClick={closeReplyModal} className="rounded-3xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                    <button onClick={handleSendReply} className="rounded-3xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">Open mail client</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
              <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Preview</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{previewArticle.title || 'Untitled'}</h3>
                    <p className="text-sm text-slate-500">By {previewArticle.author || 'Unknown'} • {previewArticle.createdAt ? new Date(previewArticle.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <button onClick={() => setPreviewArticle(null)} className="rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300">Close</button>
                </div>
                <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: previewArticle.content || '<p>No content</p>' }} />
              </div>
            </div>
          )}

          {viewingChatSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
              <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Chatbot session</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Session details</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{viewingChatSession.createdAt ? new Date(viewingChatSession.createdAt).toLocaleString() : 'Timestamp unavailable'}</p>
                  </div>
                  <button onClick={() => setViewingChatSession(null)} className="rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300">Close</button>
                </div>
                <div className="space-y-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                  <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">User message</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{viewingChatSession.userMessage}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Bot response</p>
                    <p className="mt-3 text-sm leading-7">{viewingChatSession.botResponse}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Lightbox Modal */}
          {galleryLightboxItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
              <button
                onClick={() => setGalleryLightboxItem(null)}
                className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50"
              >
                <span className="text-2xl">✕</span>
              </button>

              <div className="w-full max-w-4xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{galleryLightboxItem.title}</h2>
                </div>

                {/* Main Image */}
                <div className="relative mb-6 overflow-hidden rounded-3xl bg-black">
                  <img
                    src={galleryLightboxItem.imageUrl || galleryLightboxItem.fileUrl || adminGetAssetUrl(galleryLightboxItem.fileName)}
                    alt={galleryLightboxItem.title}
                    className="h-auto w-full object-contain max-h-[70vh]"
                  />
                </div>

                {/* Details */}
                <div className="grid gap-4 rounded-3xl bg-white/10 p-6 backdrop-blur-sm dark:bg-slate-800/50">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-300">Category</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {galleryLightboxItem.category?.charAt(0).toUpperCase() + galleryLightboxItem.category?.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-300">Date</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {galleryLightboxItem.eventDate
                          ? new Date(galleryLightboxItem.eventDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : 'No date'}
                      </p>
                    </div>
                  </div>

                  {galleryLightboxItem.description && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-300">Description</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-200">{galleryLightboxItem.description}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
                    <button
                      onClick={() => {
                        openModal(galleryLightboxItem);
                        setGalleryLightboxItem(null);
                      }}
                      className="rounded-full bg-cyan-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                    >
                      Edit Image
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(galleryLightboxItem._id || galleryLightboxItem.id, 'gallery');
                        setGalleryLightboxItem(null);
                      }}
                      className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                      Delete Image
                    </button>
                    <button
                      onClick={() => setGalleryLightboxItem(null)}
                      className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-200">{error}</div>}
          {success && <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-200">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
