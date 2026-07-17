'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './store.module.css';
import { 
  Gamepad2, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Search, 
  Star, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Copy,
  Check
} from 'lucide-react';
import { Game, staticGames } from './gamesData';

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
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Manual payment & contact states
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState('');
  const [contactInfo, setContactInfo] = useState({
    whatsapp: '+964 770 000 0000',
    instagram: 'yasin.store',
    telegram: 'yasin_store',
    zainCash: '0770 000 0000',
    asiacell: '0770 000 0000',
    qiCard: 'Available upon request'
  });

  // Load theme and games from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Load games from localStorage
    const savedGames = localStorage.getItem('yasin-store-games');
    if (savedGames) {
      try {
        setAllGames(JSON.parse(savedGames));
      } catch (e) {
        setAllGames(staticGames);
      }
    } else {
      setAllGames(staticGames);
      localStorage.setItem('yasin-store-games', JSON.stringify(staticGames));
    }

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
  }, [genre, search, allGames]);

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

  const handleCheckout = () => {
    const reqId = 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setActiveRequestId(reqId);
    
    // Save request to localStorage so admin can see it
    const newRequest = {
      id: reqId,
      games: cart.map(item => ({ id: item.id, title: item.title, price: item.price })),
      totalPrice: cartTotal,
      status: 'Pending',
      createdAt: new Date().toLocaleString()
    };
    
    const existing = localStorage.getItem('yasin-store-requests');
    let requestsList = [];
    if (existing) {
      try {
        requestsList = JSON.parse(existing);
      } catch (e) {
        console.error('Failed to parse requests', e);
      }
    }
    requestsList = [newRequest, ...requestsList];
    localStorage.setItem('yasin-store-requests', JSON.stringify(requestsList));
    
    setShowPayment(true);
  };

  const closeCartDrawer = () => {
    setCartOpen(false);
    setShowPayment(false);
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('yasin-store-cart');
    closeCartDrawer();
  };

  const getOrderSummaryText = () => {
    const itemsText = cart.map(item => item.title).join(', ');
    return `Hello Yasin Store! My Request ID is ${activeRequestId}. Games: ${itemsText} (Total: ${cartTotal.toLocaleString()} IQD). Please confirm my order!`;
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(getOrderSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                className={`${styles.pill} ${genre === 'All' && !search ? styles.pillActive : ''}`}
                onClick={() => { setGenre('All'); setSearch(''); }}
              >
                Home
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

        {/* Catalog Header & Filters */}
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
                      <span className={styles.price}>{game.price.toLocaleString()} IQD</span>
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
          {showPayment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '16px', backgroundColor: 'rgba(255,46,77,0.05)', border: '1px solid rgba(255,46,77,0.15)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-red)', marginBottom: '8px' }}>Manual Payment Instructions</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Yasin Store catalog operates via manual balance transfers. Send payment using one of the methods below and contact the administrator with your order details.
                </p>
              </div>

              {/* Payment details list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Zain Cash Wallet</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{contactInfo.zainCash}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Asiacell Transfer</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{contactInfo.asiacell}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>QI Card Service</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{contactInfo.qiCard}</div>
                </div>
              </div>

              {/* Order Message Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Order Message Template</span>
                <div style={{ position: 'relative', padding: '16px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', fontStyle: 'italic' }}>
                  {getOrderSummaryText()}
                  <button 
                    onClick={handleCopyOrder}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Chat Platforms Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Contact Admin to Verify & Receive Game</span>
                
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.btn}
                  style={{ backgroundColor: '#25D366', color: '#ffffff', textDecoration: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.013-5.101-2.859-6.95C16.63 1.953 14.16 1.9 11.537 1.9c-5.442 0-9.87 4.42-9.874 9.855-.001 1.77.472 3.498 1.368 5.03l-.974 3.565 3.655-.959zM17.47 14.65c-.32-.16-1.89-.93-2.18-1.04-.3-.1-.51-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.39.24-.71.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.64-.52-.55-.72-.56l-.61-.01c-.2 0-.53.07-.8.37-.28.3-1.07 1.04-1.07 2.54s1.09 2.95 1.24 3.15c.15.2 2.14 3.27 5.19 4.58.72.31 1.29.5 1.73.64.73.23 1.39.2 1.92.12.59-.09 1.89-.77 2.15-1.52.27-.75.27-1.4.19-1.52-.08-.12-.3-.19-.62-.35z"/></svg>
                  Message on WhatsApp
                </a>

                <a 
                  href={getTelegramLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.btn}
                  style={{ backgroundColor: '#0088cc', color: '#ffffff', textDecoration: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.97 9.28c-.15.65-.53.81-1.08.5L11.5 15.7l-1.45 1.4c-.16.16-.3.3-.61.3l.21-3.08 5.61-5.07c.24-.22-.05-.34-.38-.13L7.82 13.5l-3-1c-.65-.2-1-.65.05-1.1l11.75-4.5c.54-.2 1 .1.84.78z"/></svg>
                  Message on Telegram
                </a>

                <a 
                  href={getInstagramLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.btn}
                  style={{ backgroundColor: '#E1306C', color: '#ffffff', textDecoration: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Message on Instagram
                </a>
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
                >
                  Secure Checkout <ArrowRight size={18} />
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
