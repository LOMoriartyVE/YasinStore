'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './store.module.css';
import { 
  Gamepad2, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Search, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Game, productToGame, DEFAULT_LOGO_POSTER, getPlatformLabel } from './gamesData';
import { supabase } from '../lib/supabase';
import { submitCheckout } from './actions/checkout';

export default function Home() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [cart, setCart] = useState<Game[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Tab State
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'about' | 'support'>('home');
  const [libraryGames, setLibraryGames] = useState<Game[]>([]);

  // Manual payment & contact states
  const [showPayment, setShowPayment] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutToast, setCheckoutToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);
  const [contactInfo, setContactInfo] = useState({
    whatsapp: '+964 770 000 0000',
    instagram: 'yasin.store',
    telegram: 'yasin_store',
    zainCash: '0770 000 0000',
    asiacell: '0770 000 0000',
    qiCard: 'Available upon request'
  });

  // Load theme, products from Supabase, cart and contacts on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Load products from Supabase
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (!error && data) {
        setAllGames(data.map(productToGame));
      }
      setLoading(false);
    };
    fetchProducts();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('yasin-store-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    // Load contact information from localStorage
    const savedContact = localStorage.getItem('yasin-store-contact-info');
    if (savedContact) {
      try {
        setContactInfo(JSON.parse(savedContact));
      } catch (e) {
        console.error('Failed to parse contact info', e);
      }
    }
  }, []);

  // Filter games locally when search, genre, or allGames list changes
  useEffect(() => {
    setLoading(true);
    let filtered = [...allGames];

    if (genre !== 'All') {
      filtered = filtered.filter(g => 
        g.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    if (search) {
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setGames(filtered);
    setLoading(false);
  }, [search, genre, allGames]);

  // Load library games from completed requests
  useEffect(() => {
    if (activeTab === 'library') {
      const savedRequests = localStorage.getItem('yasin-store-requests');
      if (savedRequests) {
        try {
          const parsedRequests = JSON.parse(savedRequests);
          const completed = parsedRequests.filter((r: any) => r.status === 'Completed');
          const gamesList: Game[] = [];
          const seenIds = new Set();
          
          completed.forEach((req: any) => {
            req.games.forEach((game: any) => {
              if (!seenIds.has(game.id)) {
                seenIds.add(game.id);
                const fullDetails = allGames.find(g => g.id === game.id);
                if (fullDetails) {
                  gamesList.push(fullDetails);
                } else {
                  gamesList.push({
                    id: game.id,
                    title: game.title,
                    genre: 'Unlocked Game',
                    description: 'Purchased game key ready for activation.',
                    price: game.price,
                    asiaPrice: null,
                    released: 'N/A',
                    poster: '/logo.png',
                    platforms: ['PC'],
                    platform: 1,
                  });
                }
              }
            });
          });
          setLibraryGames(gamesList);
        } catch (e) {
          console.error('Failed to load library games', e);
        }
      } else {
        setLibraryGames([]);
      }
    }
  }, [activeTab, allGames]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('yasin-store-theme', nextTheme);
  };

  const addToCart = (game: Game, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent opening modal when clicking buy card button
    }
    
    // Check if game is already in cart
    if (cart.some(item => item.id === game.id)) {
      setCartOpen(true);
      return;
    }

    const updatedCart = [...cart, game];
    setCart(updatedCart);
    localStorage.setItem('yasin-store-cart', JSON.stringify(updatedCart));
    setCartOpen(true);
  };

  const removeFromCart = (gameId: string) => {
    const updatedCart = cart.filter(item => item.id !== gameId);
    setCart(updatedCart);
    localStorage.setItem('yasin-store-cart', JSON.stringify(updatedCart));
    // If cart becomes empty, exit payment screen
    if (updatedCart.length === 0) {
      setShowPayment(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutToast({ message: 'Submitting your order to the database...', type: 'loading' });

    const result = await submitCheckout(
      cart.map((item) => ({ title: item.title, price: item.price, asiaPrice: item.asiaPrice, platform: item.platform })),
      cartTotal
    );

    if (!result.success) {
      console.error('Checkout failed:', result.error);
      setCheckoutToast({
        message: `Checkout failed: ${result.error || 'Unknown error'}. Please try again.`,
        type: 'error',
      });
      setCheckoutLoading(false);
      return;
    }

    setActiveRequestId(result.requestId!);
    setShowPayment(true);
    setCheckoutToast({
      message: `Order ${result.requestId} submitted successfully! Contact admin to complete payment.`,
      type: 'success',
    });
    setCheckoutLoading(false);
  };

  const closeCartDrawer = () => {
    setCartOpen(false);
    setShowPayment(false);
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('yasin-store-cart');
    setCheckoutToast(null);
    closeCartDrawer();
  };

  const getOrderSummaryText = () => {
    const itemsText = cart.map(item => item.title).join(', ');
    return `Hello Yasin Store! My Request ID is ${activeRequestId}. Games: ${itemsText} (Total: ${cartTotal.toLocaleString()} IQD). Please confirm my order!`;
  };

  const getWhatsAppLink = () => {
    const cleanNum = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(getOrderSummaryText())}`;
  };

  const getTelegramLink = () => {
    const cleanTag = contactInfo.telegram.replace('@', '').trim();
    return `https://t.me/${cleanTag}`;
  };

  const getInstagramLink = () => {
    const cleanUser = contactInfo.instagram.replace('@', '').trim();
    return `https://instagram.com/${cleanUser}`;
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const checkoutToastStyles = checkoutToast
    ? {
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor:
          checkoutToast.type === 'success'
            ? 'rgba(16,185,129,0.1)'
            : checkoutToast.type === 'error'
              ? 'rgba(255,46,77,0.1)'
              : 'rgba(245,158,11,0.1)',
        border: `1px solid ${
          checkoutToast.type === 'success'
            ? '#10b981'
            : checkoutToast.type === 'error'
              ? 'var(--color-red)'
              : '#f59e0b'
        }`,
        color:
          checkoutToast.type === 'success'
            ? '#10b981'
            : checkoutToast.type === 'error'
              ? 'var(--color-red)'
              : '#f59e0b',
        fontSize: '0.85rem',
        fontWeight: '600',
      }
    : null;

  // Dynamically extract unique genres from the catalog database
  const genres = ['All', ...Array.from(new Set(allGames.map(g => g.genre))).filter(Boolean)];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.nav} container`}>
          <div className={styles.logo} onClick={() => { setGenre('All'); setSearch(''); }}>
            <span className={styles.logoIcon}>
              <Gamepad2 size={32} strokeWidth={2.5} />
            </span>
            <span>YASIN <span className={styles.logoRed}>STORE</span></span>
          </div>

          <ul className={styles.navLinks}>
            <li>
              <button 
                className={`${styles.pill} ${activeTab === 'home' ? styles.pillActive : ''}`}
                onClick={() => { setActiveTab('home'); setGenre('All'); setSearch(''); }}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`${styles.pill} ${activeTab === 'library' ? styles.pillActive : ''}`}
                onClick={() => setActiveTab('library')}
              >
                Library
              </button>
            </li>
            <li>
              <button 
                className={`${styles.pill} ${activeTab === 'about' ? styles.pillActive : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </li>
            <li>
              <button 
                className={`${styles.pill} ${activeTab === 'support' ? styles.pillActive : ''}`}
                onClick={() => setActiveTab('support')}
              >
                Support
              </button>
            </li>
          </ul>

          <div className={styles.actions}>
            {/* Theme Toggle */}
            <button 
              className={styles.actionBtn} 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart Button */}
            <div className={styles.cartBtnContainer}>
              <button 
                className={styles.actionBtn}
                onClick={() => setCartOpen(true)}
                aria-label="Shopping Cart"
                title="View Shopping Cart"
              >
                <ShoppingBag size={20} />
              </button>
              {cart.length > 0 && (
                <span className={styles.cartBadge}>{cart.length}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flexGrow: 1, paddingTop: '40px' }}>

        {/* Tab 1: Home Catalog */}
        {activeTab === 'home' && (
          <section className={styles.catalogHeader}>
            <div className={styles.filterSection}>
              <div className={styles.filterControls}>
                {/* Search */}
                <div className={styles.searchWrapper}>
                  <Search size={18} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Search masterpieces..." 
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Genre Pills */}
                <div className={styles.pillsContainer}>
                  {genres.map((g) => (
                    <button
                      key={g}
                      className={`${styles.pill} ${genre === g ? styles.pillActive : ''}`}
                      onClick={() => setGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>
              {genre === 'All' ? 'All Masterpieces' : `${genre} Games`} {search && `matching "${search}"`}
            </h2>

            {/* Loading State */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: 'var(--color-red)' }}>
                <span className="red-glow-effect" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                  LOADING DIRECTORY...
                </span>
              </div>
            ) : games.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No games match your criteria.</p>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setGenre('All'); setSearch(''); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Games Grid */
              <div className={styles.gamesGrid}>
                {games.map((game) => (
                  <div 
                    key={game.id} 
                    className={styles.gameCard}
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className={styles.cardImgWrapper}>
                      <span className={styles.cardTag}>{game.genre.split(' ')[0]}</span>
                      <Image 
                        src={game.poster}
                        alt={game.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.cardImg}
                        priority={game.id === 'neon-syndicate'}
                      />
                      <div className={styles.cardOverlay}>
                        <span className={styles.cardQuickView}>
                          <Gamepad2 size={16} /> View Details
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.cardHeaderInfo}>
                        <span className={styles.cardMeta}>
                          {game.platforms[0]}{game.platforms.length > 1 && ` +${game.platforms.length - 1}`}
                        </span>
                      </div>

                      <h3 className={styles.cardTitle}>{game.title}</h3>
                      <p className={styles.cardDesc}>{game.description}</p>

                      <div className={styles.cardFooter}>
                        <div>
                          <span className={styles.price}>{game.price.toLocaleString()} IQD</span>
                          {game.asiaPrice != null && game.asiaPrice > 0 && (
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>Asia: {game.asiaPrice.toLocaleString()} IQD</span>
                          )}
                        </div>
                        <button 
                          className={styles.cardBtn}
                          onClick={(e) => addToCart(game, e)}
                          title="Add to Cart"
                          aria-label={`Add ${game.title} to cart`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Library */}
        {activeTab === 'library' && (
          <section className={styles.catalogHeader}>
            {libraryGames.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)' }}>
                <Gamepad2 size={48} style={{ color: 'var(--color-red)', marginBottom: '16px', opacity: 0.8 }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Your Library is Empty</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
                  Once you select games, checkout, and send your Request ID to the admin, the admin will verify your payment and mark it as completed. Verified games will unlock here automatically!
                </p>
                <button className={styles.btn} onClick={() => setActiveTab('home')} style={{ backgroundColor: 'var(--color-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}>
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>
                  Your Collection ({libraryGames.length})
                </h2>
                <div className={styles.gamesGrid}>
                  {libraryGames.map((game) => (
                    <div key={game.id} className={styles.gameCard} style={{ cursor: 'default' }}>
                      <div className={styles.cardImgWrapper}>
                        <span className={styles.cardTag} style={{ backgroundColor: '#10b981' }}>Unlocked</span>
                        <Image 
                          src={game.poster}
                          alt={game.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={styles.cardImg}
                        />
                      </div>
                      <div className={styles.cardContent}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 'bold' }}>Ready to Download</span>
                        <h3 className={styles.cardTitle} style={{ marginTop: '4px' }}>{game.title}</h3>
                        <p className={styles.cardDesc}>{game.description}</p>
                        <button 
                          className={styles.btn} 
                          onClick={() => alert(`Retrieving license key for "${game.title}"...\nKey status: ACTIVE\nKey: YASN-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`)}
                          style={{ 
                            marginTop: '12px', 
                            width: '100%', 
                            backgroundColor: '#10b981', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 0', 
                            borderRadius: 'var(--radius-md)', 
                            fontWeight: 'bold', 
                            cursor: 'pointer' 
                          }}
                        >
                          Get Key
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: About */}
        {activeTab === 'about' && (
          <section className={styles.catalogHeader}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
                  ABOUT YASIN <span style={{ color: 'var(--color-red)' }}>STORE</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  The ultimate hub for premium gaming catalogs, built to show game collections and provide direct key deliveries.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-red)', marginBottom: '8px' }}>🚀 Our Mission</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Yasin Store offers an immersive, interactive gaming directory showing game descriptions, specs, and local price conversions in Iraqi Dinars (IQD). We connect users to game codes and digital keys through a convenient manual validation process.
                  </p>
                </div>

                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-red)', marginBottom: '12px' }}>🛠️ How it Works</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.1)', color: 'var(--color-red)', fontWeight: 'bold' }}>1</span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Browse and Stage</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select your favorite titles from our database and add them to the cart.</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.1)', color: 'var(--color-red)', fontWeight: 'bold' }}>2</span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Secure Checkout ID</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Click Checkout to log the purchase request locally and generate your Unique Request ID.</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.1)', color: 'var(--color-red)', fontWeight: 'bold' }}>3</span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Submit to Admin</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Send the request summary or code to our official handles (WhatsApp, Telegram, or Instagram).</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.1)', color: 'var(--color-red)', fontWeight: 'bold' }}>4</span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Key Unlock</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Once payment is confirmed by the admin, the games unlock in your Library.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: Support */}
        {activeTab === 'support' && (
          <section className={styles.catalogHeader}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
                  CUSTOMER <span style={{ color: 'var(--color-red)' }}>SUPPORT</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  Need help with your purchase request or payment transfer? Contact our team directly.
                </p>
              </div>

              {/* Contact Channels */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '16px' }}>Direct Support Channels</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <span style={{ display: 'flex', padding: '10px', backgroundColor: 'rgba(37,211,102,0.1)', color: '#25d366', borderRadius: '50%', fontSize: '1.2rem' }}>
                        💬
                      </span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>WhatsApp Chat</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{contactInfo.whatsapp}</span>
                      </div>
                    </div>
                  </a>
                  <a href={getTelegramLink()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <span style={{ display: 'flex', padding: '10px', backgroundColor: 'rgba(0,136,204,0.1)', color: '#0088cc', borderRadius: '50%', fontSize: '1.2rem' }}>
                        ✈️
                      </span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Telegram Channel</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>@{contactInfo.telegram}</span>
                      </div>
                    </div>
                  </a>
                  <a href={getInstagramLink()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <span style={{ display: 'flex', padding: '10px', backgroundColor: 'rgba(225,48,108,0.1)', color: '#e1306c', borderRadius: '50%', fontSize: '1.2rem' }}>
                        📸
                      </span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Instagram DM</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>@{contactInfo.instagram}</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Payment Methods Card - Icons Only */}
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-red)', marginBottom: '16px' }}>💳 Accepted Payment Networks</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', padding: '12px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,46,77,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>💳</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Zain Cash</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,46,77,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📱</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Asiacell</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,46,77,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🏦</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>QI Card</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Cart Drawer Overlay */}
      <div 
        className={`${styles.drawerOverlay} ${cartOpen ? styles.drawerOverlayActive : ''}`}
        onClick={closeCartDrawer}
      ></div>

      {/* Cart Drawer */}
      <div className={`${styles.drawer} ${cartOpen ? styles.drawerActive : ''}`}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            <ShoppingBag size={24} className={styles.logoRed} /> {showPayment ? 'Manual Checkout' : 'Shopping Cart'}
          </h2>
          <button className={styles.closeBtn} onClick={closeCartDrawer}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {checkoutToast && checkoutToastStyles && (
            <div style={{ ...checkoutToastStyles, marginBottom: '16px' }}>
              {checkoutToast.type === 'success' ? (
                <CheckCircle2 size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              ) : checkoutToast.type === 'error' ? (
                <X size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              ) : (
                <Loader2 size={16} className="spin-animation" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              )}
              {checkoutToast.message}
            </div>
          )}

          {showPayment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Request ID Badge */}
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '8px' }}>Your Request ID</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', fontFamily: 'var(--font-heading)', color: 'var(--color-red)', letterSpacing: '2px' }}>{activeRequestId}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Send this ID to the admin via any channel below</p>
              </div>

              {/* Payment Methods - Icons Only */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '12px 0' }}>
                <div
                  title="Zain Cash"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}
                >
                  💳
                </div>
                <div
                  title="Asiacell"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}
                >
                  📱
                </div>
                <div
                  title="QI Card"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,46,77,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}
                >
                  🏦
                </div>
              </div>

              {/* Contact Admin Links - Compact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'center' }}>Contact Admin to Confirm</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a 
                    href={getWhatsAppLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: '#25D366', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24z"/></svg>
                    WhatsApp
                  </a>
                  <a 
                    href={getTelegramLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: '#0088cc', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.97 9.28c-.15.65-.53.81-1.08.5L11.5 15.7l-1.45 1.4c-.16.16-.3.3-.61.3l.21-3.08 5.61-5.07c.24-.22-.05-.34-.38-.13L7.82 13.5l-3-1c-.65-.2-1-.65.05-1.1l11.75-4.5c.54-.2 1 .1.84.78z"/></svg>
                    Telegram
                  </a>
                  <a 
                    href={getInstagramLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: '#E1306C', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <Gamepad2 size={64} className={styles.emptyCartIcon} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>YOUR CART IS EMPTY</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Explore our catalog and add some premium games to start playing.</p>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`} 
                onClick={closeCartDrawer}
                style={{ marginTop: '12px' }}
              >
                Back to Catalog
              </button>
            </div>
          ) : (
            <div className={styles.cartItemsList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemImgWrapper}>
                    <Image 
                      src={item.poster} 
                      alt={item.title} 
                      fill 
                      sizes="60px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.cartItemInfo}>
                    <h4 className={styles.cartItemTitle}>{item.title}</h4>
                    <span className={styles.cartItemGenre}>{item.genre}</span>
                    <span className={styles.cartItemPrice}>{item.price.toLocaleString()} IQD</span>
                    {item.asiaPrice != null && item.asiaPrice > 0 && (
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Asia: {item.asiaPrice.toLocaleString()} IQD</span>
                    )}
                  </div>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    title="Remove from Cart"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.drawerFooter}>
            {showPayment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`} 
                  onClick={handleClearCart}
                  style={{ width: '100%' }}
                >
                  Clear Cart & Close Console
                </button>
                <button 
                  className={`${styles.btn} ${styles.btnSecondary}`} 
                  onClick={() => setShowPayment(false)}
                  style={{ width: '100%' }}
                >
                  Back to Shopping Cart
                </button>
              </div>
            ) : (
              <>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Subtotal</span>
                  <span className={styles.totalPrice}>{cartTotal.toLocaleString()} IQD</span>
                </div>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.checkoutBtn}`}
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <><Loader2 size={18} className="spin-animation" /> Processing...</>
                  ) : (
                    <>Secure Checkout <ArrowRight size={18} /></>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Game Details Modal Overlay */}
      <div 
        className={`${styles.modalOverlay} ${selectedGame ? styles.modalOverlayActive : ''}`}
        onClick={() => setSelectedGame(null)}
      >
        {/* Game Details Modal */}
        {selectedGame && (
          <div 
            className={`${styles.modal} ${selectedGame ? styles.modalActive : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalCloseBtn} onClick={() => setSelectedGame(null)}>
              <X size={20} />
            </button>

            <div className={styles.modalBody}>
              <div className={styles.modalImgWrapper}>
                <Image 
                  src={selectedGame.poster} 
                  alt={selectedGame.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={styles.modalImg}
                />
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalMeta}>
                  <span className={styles.modalGenre}>{selectedGame.genre}</span>
                </div>

                <h2 className={styles.modalTitle}>{selectedGame.title}</h2>
                <p className={styles.modalDesc}>{selectedGame.description}</p>

                <div className={styles.modalInfoGrid}>
                  <div className={styles.modalInfoItem}>
                    <span className={styles.modalInfoLabel}>Platforms</span>
                    <span className={styles.modalInfoValue}>{selectedGame.platforms.join(', ')}</span>
                  </div>
                  <div className={styles.modalInfoItem}>
                    <span className={styles.modalInfoLabel}>Released</span>
                    <span className={styles.modalInfoValue}>{selectedGame.released}</span>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <div className={styles.modalPrice}>
                    <span className={styles.modalPriceLabel}>Instant Access</span>
                    <span className={styles.modalPriceVal}>{selectedGame.price.toLocaleString()} IQD</span>
                    {selectedGame.asiaPrice != null && selectedGame.asiaPrice > 0 && (
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>Asia Price: {selectedGame.asiaPrice.toLocaleString()} IQD</span>
                    )}
                  </div>
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.modalBtn}`}
                    onClick={() => {
                      addToCart(selectedGame);
                      setSelectedGame(null);
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.footerContent} container`}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <Gamepad2 size={24} />
            </span>
            <span>YASIN <span className={styles.logoRed}>STORE</span></span>
          </div>
          <ul className={styles.footerLinks}>
            <li><a href="#" className={styles.footerLink} onClick={(e) => { e.preventDefault(); setGenre('All'); }}>Store</a></li>
            <li><a href="#" className={styles.footerLink} onClick={(e) => { e.preventDefault(); alert("Library is empty! Acquire some games first."); }}>Library</a></li>
            <li><a href="#" className={styles.footerLink} onClick={(e) => { e.preventDefault(); alert("Yasin Store - A next-gen game library experience."); }}>About</a></li>
            <li><a href="#" className={styles.footerLink} onClick={(e) => { e.preventDefault(); alert("Contact: support@yasinstore.com"); }}>Support</a></li>
          </ul>
          <p className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} Yasin Store. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
