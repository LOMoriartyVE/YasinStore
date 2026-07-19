'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './admin.module.css';
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
  Loader2
} from 'lucide-react';

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

  // Admin Contact Details state
  const [whatsapp, setWhatsapp] = useState('+964 770 000 0000');
  const [instagram, setInstagram] = useState('trt.store');
  const [telegram, setTelegram] = useState('trt_store');
  const [facebook, setFacebook] = useState('https://www.facebook.com/TRTstore1');
  const [zainCash, setZainCash] = useState('0770 000 0000');
  const [asiacell, setAsiacell] = useState('0770 000 0000');
  const [qiCard, setQiCard] = useState('Available upon request');
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
        if (res.data.whatsapp) setWhatsapp(res.data.whatsapp);
        if (res.data.instagram) setInstagram(res.data.instagram);
        if (res.data.telegram) setTelegram(res.data.telegram);
        if (res.data.facebook) setFacebook(res.data.facebook);
        if (res.data.zain_cash) setZainCash(res.data.zain_cash);
        if (res.data.asiacell) setAsiacell(res.data.asiacell);
        if (res.data.qi_card) setQiCard(res.data.qi_card);
      } else if (res && res.tableDoesNotExist) {
        setTableError(true);
        // Fallback to local storage
        const savedContact = localStorage.getItem('yasin-store-contact-info');
        if (savedContact) {
          try {
            const parsed = JSON.parse(savedContact);
            if (parsed.whatsapp) setWhatsapp(parsed.whatsapp);
            if (parsed.instagram) setInstagram(parsed.instagram);
            if (parsed.telegram) setTelegram(parsed.telegram);
            if (parsed.facebook) setFacebook(parsed.facebook);
            if (parsed.zainCash) setZainCash(parsed.zainCash);
            if (parsed.asiacell) setAsiacell(parsed.asiacell);
            if (parsed.qiCard) setQiCard(parsed.qiCard);
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
        {/* Left Side: Add Product Form */}
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
                      <Image 
                        src={posterFile} 
                        alt="Preview cover" 
                        fill 
                        sizes="50px"
                        style={{ objectFit: 'cover' }}
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

        {/* Contact & Payment Info Settings Card */}
        <section className={styles.panelCard} style={{ marginTop: '24px' }}>
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

            <button type="submit" className={styles.submitBtn} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              Save Contact Details
            </button>
          </form>
        </section>

        {/* Right Side: Current Catalog List */}
        <section className={styles.panelCard}>
          <h2 className={styles.panelTitle}>
            <Database size={20} className={styles.titlePurple} /> Current Catalog ({products.length})
          </h2>
          <div className={styles.catalogList}>
            {products.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                Catalog is empty. Add products using the form.
              </p>
            ) : (
              products.map((product) => (
                <div key={product.name} className={styles.catalogItem}>
                  <div className={styles.itemImgWrapper}>
                    <Image 
                      src={product.image_url || DEFAULT_LOGO_POSTER} 
                      alt={product.name} 
                      fill 
                      sizes="50px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{product.name}</h3>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemPrice}>{product.Price.toLocaleString()} IQD</span>
                      {product.asia_price != null && product.asia_price > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginLeft: '8px' }}>Asia: {product.asia_price.toLocaleString()} IQD</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>{getPlatformLabel(product.platform)}</span>
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
