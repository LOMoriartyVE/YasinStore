'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './admin.module.css';
import storeStyles from '../store.module.css';
import { Product, DEFAULT_LOGO_POSTER, PLATFORM_OPTIONS, getPlatformLabel, hasPlatformBit, togglePlatformBit } from '../gamesData';
import { getProducts, addProduct, deleteProduct, verifyAdminPassword, getStoreConfig, updateStoreConfig } from './actions';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle,
  Database,
  Lock,
  Upload,
  Loader2,
  Gamepad2,
  Gamepad
} from 'lucide-react';

// GraphicRenderer to render custom procedural card vectors in admin preview
interface GraphicRendererProps {
  type: string | null | undefined;
  badgeText: string | null | undefined;
  glowColor: string | null | undefined;
}

function GraphicRenderer({ type, badgeText, glowColor }: GraphicRendererProps) {
  const getGlowColor = () => {
    switch (glowColor) {
      case 'pink': return 'rgba(236, 72, 153, 0.4)';
      case 'cyan': return 'rgba(6, 182, 212, 0.4)';
      case 'amber': return 'rgba(245, 158, 11, 0.4)';
      default: return 'rgba(168, 85, 247, 0.4)';
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    userSelect: 'none',
  };

  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.3,
    backgroundColor: getGlowColor(),
    zIndex: 1,
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '12px',
    color: '#ffffff',
    fontFamily: 'var(--font-heading), monospace',
    fontWeight: 900,
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'center',
    zIndex: 10,
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
  };

  if (type === 'smiley') {
    return (
      <div style={{ ...containerStyle, backgroundColor: '#09080d' }}>
        <div style={glowStyle} />
        <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50px', marginBottom: '10px', padding: '0 2px' }}>
            <span style={{ color: '#ef4444', fontWeight: 950, fontSize: '20px', lineHeight: 1 }}>+</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
              <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', transform: 'translateX(5px)' }} />
            </div>
          </div>
          <div style={{ width: '50px', height: '16px', borderBottom: '3px solid #ef4444', borderRadius: '0 0 25px 25px' }} />
        </div>
        <div style={badgeStyle}>{badgeText || 'TRT STORE'}</div>
      </div>
    );
  }

  if (type === 'house') {
    return (
      <div style={{ ...containerStyle, backgroundColor: '#13111c' }}>
        <div style={glowStyle} />
        <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <svg style={{ width: '70px', height: '70px', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.5))' }} viewBox="0 0 100 100">
            <polygon points="50,15 12,52 88,52" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <line x1="50" y1="15" x2="35" y2="40" stroke="#ca8a04" strokeWidth="0.8" />
            <line x1="50" y1="15" x2="65" y2="40" stroke="#ca8a04" strokeWidth="0.8" />
            <line x1="30" y1="35" x2="25" y2="50" stroke="#ca8a04" strokeWidth="0.8" />
            <line x1="70" y1="35" x2="75" y2="50" stroke="#ca8a04" strokeWidth="0.8" />
            <rect x="22" y="52" width="56" height="35" fill="#78350f" rx="2" />
            <line x1="38" y1="52" x2="38" y2="87" stroke="#451a03" strokeWidth="0.8" />
            <line x1="62" y1="52" x2="62" y2="87" stroke="#451a03" strokeWidth="0.8" />
            <line x1="22" y1="70" x2="78" y2="70" stroke="#451a03" strokeWidth="0.8" />
            <rect x="44" y="65" width="12" height="22" fill="#451a03" />
          </svg>
        </div>
        <div style={badgeStyle}>{badgeText || 'TRT STORE'}</div>
      </div>
    );
  }

  if (type === 'gamepad') {
    return (
      <div style={{ ...containerStyle, backgroundColor: '#07050a' }}>
        <div style={glowStyle} />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.2)', backgroundColor: 'rgba(24,18,48,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gamepad size={36} className="logoPurple" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.6))' }} />
          </div>
        </div>
        <div style={badgeStyle}>{badgeText || 'TRT STORE'}</div>
      </div>
    );
  }

  if (type === 'sword') {
    return (
      <div style={{ ...containerStyle, backgroundColor: '#090b14' }}>
        <div style={glowStyle} />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.2)', backgroundColor: 'rgba(10,24,36,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.6))' }}>⚔️</span>
          </div>
        </div>
        <div style={badgeStyle}>{badgeText || 'TRT STORE'}</div>
      </div>
    );
  }

  return null;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [asiaPrice, setAsiaPrice] = useState('');
  const [posterFile, setPosterFile] = useState<string | null>(null);
  const [posterFileName, setPosterFileName] = useState('');
  const [platform, setPlatform] = useState(1); // bitmask — default PC
  const [glowColor, setGlowColor] = useState('');
  const [customGraphic, setCustomGraphic] = useState('');
  const [tag, setTag] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountAsiaPrice, setDiscountAsiaPrice] = useState('');
  const [discountUntil, setDiscountUntil] = useState('');

  // Admin Contact Details state
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [zainCash, setZainCash] = useState('');
  const [asiacell, setAsiacell] = useState('');
  const [qiCard, setQiCard] = useState('');
  const [tableError, setTableError] = useState(false);

  // Load products from Supabase, theme, and authentication
  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Fetch store config from Supabase
    const fetchConfig = async () => {
      const res = await getStoreConfig();
      if (res && res.data) {
        setWhatsapp(res.data.whatsapp || '');
        setInstagram(res.data.instagram || '');
        setTelegram(res.data.telegram || '');
        setFacebook(res.data.facebook || '');
        setZainCash(res.data.zain_cash || '');
        setAsiacell(res.data.asiacell || '');
        setQiCard(res.data.qi_card || '');
      } else if (res && res.tableDoesNotExist) {
        setTableError(true);
        // Fallback to local storage
        const savedContact = localStorage.getItem('yasin-store-contact-info');
        if (savedContact) {
          try {
            const parsed = JSON.parse(savedContact);
            setWhatsapp(parsed.whatsapp || '');
            setInstagram(parsed.instagram || '');
            setTelegram(parsed.telegram || '');
            setFacebook(parsed.facebook || '');
            setZainCash(parsed.zainCash || '');
            setAsiacell(parsed.asiacell || '');
            setQiCard(parsed.qiCard || '');
          } catch (e) {
            console.error('Failed to parse contact info fallback', e);
          }
        }
      }
    };
    fetchConfig();

    // Check if authenticated in session
    const isAuthed = sessionStorage.getItem('yasin-store-admin-authed');
    if (isAuthed === 'true') {
      setIsAuthenticated(true);
    }

    // Fetch products from Supabase
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await getProducts();

    if (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products from database.');
    } else {
      setProducts(data || []);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(false);

    const { success } = await verifyAdminPassword(passwordInput);

    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('yasin-store-admin-authed', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
    setLoginLoading(false);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Convert uploaded image file to WebP format (Base64 data URL) client-side
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Change filename extension to .webp for UI display
    const dotIndex = file.name.lastIndexOf('.');
    const cleanName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
    setPosterFileName(cleanName + '.webp');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to webp with 0.85 quality
          const webpBase64 = canvas.toDataURL('image/webp', 0.85);
          setPosterFile(webpBase64);
        } else {
          setPosterFile(reader.result as string);
        }
      };
      img.onerror = () => {
        setPosterFile(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleTogglePlatform = (bit: number) => {
    setPlatform(prev => togglePlatformBit(prev, bit));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      alert('Please fill in name and price.');
      return;
    }

    if (platform === 0) {
      alert('Please select at least one platform.');
      return;
    }

    setIsSubmitting(true);

    const newProduct: Product = {
      name,
      Price: parseFloat(parseFloat(price).toFixed(2)),
      asia_price: asiaPrice ? parseFloat(parseFloat(asiaPrice).toFixed(2)) : null,
      description: description || null,
      image_url: posterFile || null,
      platform,
      glow_color: glowColor || null,
      custom_graphic: customGraphic || null,
      tag: tag || null,
      badge_text: badgeText || null,
      discount_price: discountPrice ? parseFloat(parseFloat(discountPrice).toFixed(2)) : null,
      discount_asia_price: discountAsiaPrice ? parseFloat(parseFloat(discountAsiaPrice).toFixed(2)) : null,
      discount_until: discountUntil || null,
    };

    const { success, error } = await addProduct(newProduct);

    if (!success) {
      console.error('Error adding product:', error);
      showToast(`Failed to add "${name}": ${error}`);
      setIsSubmitting(false);
      return;
    }

    // Reset Form
    setName('');
    setDescription('');
    setPrice('');
    setAsiaPrice('');
    setPosterFile(null);
    setPosterFileName('');
    setPlatform(1);
    setGlowColor('');
    setCustomGraphic('');
    setTag('');
    setBadgeText('');
    setDiscountPrice('');
    setDiscountAsiaPrice('');
    setDiscountUntil('');

    showToast(`"${name}" added to database!`);
    setIsSubmitting(false);

    // Refresh product list
    fetchProducts();
  };

  const handleDeleteProduct = async (productName: string) => {
    if (!confirm(`Are you sure you want to remove "${productName}" from the store catalog?`)) {
      return;
    }

    const { success, error } = await deleteProduct(productName);

    if (!success) {
      console.error('Error deleting product:', error);
      showToast(`Failed to delete "${productName}": ${error}`);
      return;
    }

    showToast(`"${productName}" removed from database.`);
    fetchProducts();
  };

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const configData = {
      whatsapp,
      instagram,
      telegram,
      facebook,
      zain_cash: zainCash,
      asiacell,
      qi_card: qiCard
    };
    
    const res = await updateStoreConfig(configData);
    
    // Always update local storage for instant sync in dev/fallback mode
    localStorage.setItem('yasin-store-contact-info', JSON.stringify({
      whatsapp,
      instagram,
      telegram,
      facebook,
      zainCash,
      asiacell,
      qiCard
    }));

    if (res.success) {
      setTableError(false);
      showToast('Store settings synced and saved in database!');
    } else {
      if (res.tableDoesNotExist) {
        setTableError(true);
        showToast('Settings saved locally. Supabase table needs setup!');
      } else {
        showToast(`Sync Error: ${res.error}`);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.lockScreen}>
        <div className={styles.lockCard}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-purple)' }}>
            <Lock size={48} className="purple-glow-effect" style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(168,85,247,0.1)' }} />
          </div>
          <h1 className={styles.lockTitle}>Admin Access</h1>
          <p className={styles.lockDesc}>Enter the cryptographic console key to access the TRT STORE catalog database.</p>
          <form onSubmit={handlePasswordSubmit} className={styles.lockForm}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              className={styles.input}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              disabled={loginLoading}
            />
            {loginError && (
              <span className={styles.lockError}>Invalid key password. Access Denied.</span>
            )}
            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
              {loginLoading ? (
                <><Loader2 size={18} className="spin-animation" /> Verifying...</>
              ) : (
                'Grant Access'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      {/* Admin Header */}
      <header className={`${styles.header} container`}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            TRT <span className={styles.titlePurple}>STORE</span> Admin
          </h1>
          <span className={styles.subtitle}>Manage gaming products and inventory catalog</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/requests" className={styles.backBtn}>
            View User Requests
          </Link>
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </header>

      {/* Main Console */}
      <main className={`${styles.dashboardGrid} container`}>
        {/* Row 1: Split Form & Live Preview */}
        <div className={styles.twoColumnRow}>
          {/* Add Product Form */}
          <section className={styles.panelCard}>
            <h2 className={styles.panelTitle}>
              <Plus size={20} className={styles.titlePurple} /> Add New Product
            </h2>
            <form className={styles.form} onSubmit={handleAddProduct}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Grand Theft Auto VI" 
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea 
                  placeholder="Write a product synopsis (optional)..." 
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price (IQD) *</label>
                <input 
                  type="number" 
                  step="500" 
                  min="0"
                  placeholder="e.g. 75000" 
                  className={styles.input}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Asia Price (IQD)</label>
                <input 
                  type="number" 
                  step="500" 
                  min="0"
                  placeholder="e.g. 65000 (optional)" 
                  className={styles.input}
                  value={asiaPrice}
                  onChange={(e) => setAsiaPrice(e.target.value)}
                />
              </div>

              {/* Discount Pricing Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', border: '1px dashed var(--border-color)', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏷️ Discount Pricing (Optional)
                  </h4>
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>Discount Price (IQD)</label>
                  <input 
                    type="number" 
                    step="500" 
                    min="0"
                    placeholder="e.g. 70000" 
                    className={styles.input}
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>Discount Asia Price (IQD)</label>
                  <input 
                    type="number" 
                    step="500" 
                    min="0"
                    placeholder="e.g. 60000" 
                    className={styles.input}
                    value={discountAsiaPrice}
                    onChange={(e) => setDiscountAsiaPrice(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2', margin: 0 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>Discount Valid Until</label>
                  <input 
                    type="datetime-local" 
                    className={styles.input}
                    value={discountUntil}
                    onChange={(e) => setDiscountUntil(e.target.value)}
                  />
                </div>
              </div>

              {/* Platform Multi-Select Icons */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Platforms * <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(click to toggle)</span></label>
                <div className={styles.platformsGrid}>
                  {PLATFORM_OPTIONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`${styles.platformBtn} ${hasPlatformBit(platform, p.value) ? styles.platformBtnActive : ''}`}
                      onClick={() => handleTogglePlatform(p.value)}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Poster Cover Art</label>
                <div className={styles.uploadWrapper}>
                  <input 
                    type="file" 
                    id="posterUpload"
                    accept="image/*" 
                    className={styles.fileInput}
                    onChange={handleImageUpload}
                  />
                  
                  {!posterFile ? (
                    <label htmlFor="posterUpload" className={styles.uploadTrigger}>
                      <Upload size={24} className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Click to upload custom poster cover</span>
                      <span className={styles.uploadSubtext}>Supports PNG, JPG, WebP. If empty, website logo is used.</span>
                    </label>
                  ) : (
                    <div className={styles.previewBox}>
                      <div className={styles.previewThumb}>
                        <img 
                          src={posterFile} 
                          alt="Preview cover" 
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.previewInfo}>
                        <span className={styles.previewName}>{posterFileName || 'Uploaded Cover'}</span>
                        <button 
                          type="button" 
                          className={styles.removeUploadBtn}
                          onClick={() => {
                            setPosterFile(null);
                            setPosterFileName('');
                          }}
                        >
                          Remove and use Website Logo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Glow Color Selector */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Glow Color Theme</label>
                <select 
                  className={styles.input} 
                  value={glowColor} 
                  onChange={(e) => setGlowColor(e.target.value)}
                >
                  <option value="">None (Standard Outline)</option>
                  <option value="pink">Neon Pink</option>
                  <option value="cyan">Neon Cyan</option>
                  <option value="amber">Neon Amber</option>
                  <option value="purple">Neon Purple</option>
                </select>
              </div>

              {/* Custom Graphic Selector */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Custom Card Artwork / Graphic (Backdrop Canvas)</label>
                <select 
                  className={styles.input} 
                  value={customGraphic} 
                  onChange={(e) => setCustomGraphic(e.target.value)}
                >
                  <option value="">None (Uses Cover Photo Above)</option>
                  <option value="smiley">Smiley Decal Canvas</option>
                  <option value="house">House Vector Canvas</option>
                  <option value="gamepad">Gamepad Neon Glow Canvas</option>
                  <option value="sword">Sword Cyberpunk Canvas</option>
                </select>
              </div>

              {/* Custom Tag Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Badge Tag Text</label>
                <input 
                  type="text" 
                  placeholder="e.g. HOT RELEASE, PC, PROMO (optional)" 
                  className={styles.input}
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>

              {/* Custom Badge/Publisher Text Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Card Center Subtitle / Badge Publisher</label>
                <input 
                  type="text" 
                  placeholder="e.g. TRT STORE, EA, UBISOFT (optional)" 
                  className={styles.input}
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 size={18} className="spin-animation" /> Saving to Database...</>
                ) : (
                  <><Plus size={18} /> Add Product to Database</>
                )}
              </button>
            </form>
          </section>

          {/* Live Card Preview Section */}
          <section className={styles.panelCard}>
            <h2 className={styles.panelTitle}>
              <Gamepad2 size={20} className={styles.titlePurple} /> Storefront Live Card Preview
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              This shows how the product card is formatted and rendered in real-time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              <div style={{ width: '280px' }}>
                {(() => {
                  let glowClass = '';
                  if (glowColor === 'pink') glowClass = storeStyles.cardPink;
                  else if (glowColor === 'cyan') glowClass = storeStyles.cardCyan;
                  else if (glowColor === 'amber') glowClass = storeStyles.cardAmber;
                  else if (glowColor === 'purple') glowClass = storeStyles.cardPurple;

                  const now = new Date();
                  const isDiscountActive = discountPrice !== '' && 
                    (discountUntil === '' || new Date(discountUntil) > now);

                  return (
                    <div className={`${storeStyles.gameCard} ${glowClass}`} style={{ pointerEvents: 'none' }}>
                      <div className={storeStyles.cardImgWrapper}>
                        <span className={storeStyles.cardTag}>
                          {isDiscountActive ? (discountUntil ? 'SALE' : 'PROMO') : (tag || 'GENRE')}
                        </span>
                        {customGraphic ? (
                          <GraphicRenderer type={customGraphic} badgeText={badgeText} glowColor={glowColor} />
                        ) : (
                          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '370px' }}>
                            <img 
                              src={posterFile || DEFAULT_LOGO_POSTER}
                              alt={name || 'Preview'}
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div className={storeStyles.cardOverlay}>
                          <span className={storeStyles.cardQuickView}>
                            <Gamepad2 size={16} /> View Details
                          </span>
                        </div>
                      </div>

                      <div className={storeStyles.cardContent}>
                        <div className={storeStyles.cardHeaderInfo}>
                          <span className={storeStyles.cardMeta}>
                            {getPlatformLabel(platform)}
                          </span>
                        </div>

                        <h3 className={storeStyles.cardTitle}>{name || 'Product Title'}</h3>
                        <p className={storeStyles.cardDesc}>{description || 'Product description will appear here...'}</p>

                        <div className={storeStyles.cardFooter}>
                          <div>
                            {isDiscountActive ? (
                              <>
                                <span className={storeStyles.price} style={{ color: '#ef4444' }}>
                                  {(parseFloat(discountPrice) || 0).toLocaleString()} IQD
                                </span>
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginLeft: '8px' }}>
                                  {(parseFloat(price) || 0).toLocaleString()} IQD
                                </span>
                                {discountAsiaPrice !== '' && parseFloat(discountAsiaPrice) > 0 ? (
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>
                                    Asia Sale: {(parseFloat(discountAsiaPrice) || 0).toLocaleString()} IQD
                                  </span>
                                ) : asiaPrice !== '' && parseFloat(asiaPrice) > 0 ? (
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>
                                    Asia: {(parseFloat(asiaPrice) || 0).toLocaleString()} IQD
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <span className={storeStyles.price}>{(parseFloat(price) || 0).toLocaleString()} IQD</span>
                                {asiaPrice !== '' && parseFloat(asiaPrice) > 0 && (
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>
                                    Asia: {(parseFloat(asiaPrice) || 0).toLocaleString()} IQD
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <button 
                            className={storeStyles.cardBtn}
                            type="button"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>
        </div>

        {/* Row 2: Catalog list shown in grid (Full Width) */}
        <section className={styles.panelCard}>
          <h2 className={styles.panelTitle}>
            <Database size={20} className={styles.titlePurple} /> Current Catalog ({products.length})
          </h2>
          <div className={styles.catalogGrid}>
            {products.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0', gridColumn: '1 / -1' }}>
                Catalog is empty. Add products using the form.
              </p>
            ) : (
              products.map((product) => (
                <div key={product.name} className={styles.catalogItem}>
                  <div className={styles.itemImgWrapper}>
                    <img 
                      src={product.image_url || DEFAULT_LOGO_POSTER} 
                      alt={product.name} 
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{product.name}</h3>
                    <div className={styles.itemMeta}>
                      {(() => {
                        const now = new Date();
                        const isDiscountActive = product.discount_price != null && 
                          (product.discount_until == null || new Date(product.discount_until) > now);
                        if (isDiscountActive) {
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className={styles.itemPrice} style={{ color: '#ef4444' }}>
                                  {product.discount_price!.toLocaleString()} IQD
                                </span>
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                  {product.Price.toLocaleString()} IQD
                                </span>
                              </div>
                              {product.discount_asia_price != null && product.discount_asia_price > 0 ? (
                                <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Asia Sale: {product.discount_asia_price.toLocaleString()} IQD</span>
                              ) : product.asia_price != null && product.asia_price > 0 ? (
                                <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Asia: {product.asia_price.toLocaleString()} IQD</span>
                              ) : null}
                            </div>
                          );
                        }
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className={styles.itemPrice}>{product.Price.toLocaleString()} IQD</span>
                            {product.asia_price != null && product.asia_price > 0 && (
                              <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Asia: {product.asia_price.toLocaleString()} IQD</span>
                            )}
                          </div>
                        );
                      })()}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', height: 'fit-content' }}>{getPlatformLabel(product.platform)}</span>
                    </div>
                  </div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteProduct(product.name)}
                    title="Remove Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Row 3: Store Contact & Payment Info (Full Width) */}
        <section className={styles.panelCard}>
          <h2 className={styles.panelTitle}>
            <Database size={20} className={styles.titlePurple} /> Store Contact & Payment Info
          </h2>
          {tableError && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid #f59e0b', borderRadius: 'var(--radius-md)', color: '#f59e0b', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <strong style={{ display: 'block', marginBottom: '6px' }}>⚠️ Supabase Database Table Pending</strong>
              To save these settings permanently in the database, create the config table in your Supabase project. Go to <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query</strong>, paste the following SQL, and click <strong>Run</strong>:
              <pre style={{ margin: '10px 0 0 0', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontFamily: 'monospace', overflowX: 'auto', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
{`CREATE TABLE IF NOT EXISTS public.store_config (
  id int PRIMARY KEY DEFAULT 1,
  whatsapp text,
  instagram text,
  telegram text,
  facebook text,
  zain_cash text,
  asiacell text,
  qi_card text
);

INSERT INTO public.store_config (id, whatsapp, instagram, telegram, facebook, zain_cash, asiacell, qi_card)
VALUES (1, '+964 770 000 0000', 'trt.store', 'trt_store', 'https://www.facebook.com/TRTstore1', '0770 000 0000', '0770 000 0000', 'Available upon request')
ON CONFLICT (id) DO NOTHING;`}
              </pre>
            </div>
          )}
          <form className={styles.form} onSubmit={handleSaveContactInfo}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>WhatsApp Number</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)} 
                  placeholder="+964 770 000 0000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Instagram Username</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={instagram} 
                  onChange={(e) => setInstagram(e.target.value)} 
                  placeholder="trt.store"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Telegram Tag</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={telegram} 
                  onChange={(e) => setTelegram(e.target.value)} 
                  placeholder="trt_store"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Facebook Link</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={facebook} 
                  onChange={(e) => setFacebook(e.target.value)} 
                  placeholder="https://www.facebook.com/TRTstore1"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Zain Cash Number</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={zainCash} 
                  onChange={(e) => setZainCash(e.target.value)} 
                  placeholder="0770 000 0000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Asiacell Number</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={asiacell} 
                  onChange={(e) => setAsiacell(e.target.value)} 
                  placeholder="0770 000 0000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>QI Card Details</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={qiCard} 
                  onChange={(e) => setQiCard(e.target.value)} 
                  placeholder="Available upon request"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} style={{ marginTop: '20px', width: 'fit-content', padding: '14px 28px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              Save Contact Details
            </button>
          </form>
        </section>
      </main>

      {/* Success Toast */}
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle size={18} /> {toastMessage}
        </div>
      )}
    </div>
  );
}
