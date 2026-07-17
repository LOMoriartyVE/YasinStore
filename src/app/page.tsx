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
  TrendingUp
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
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('yasin-store-cart');
      setCartOpen(false);
      setCheckoutSuccess(false);
    }, 2500);
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
            <li>
              <Link href="/admin" className={styles.navLink}>
                Admin
              </Link>
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
        onClick={() => setCartOpen(false)}
      ></div>

      {/* Cart Drawer */}
      <div className={`${styles.drawer} ${cartOpen ? styles.drawerActive : ''}`}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            <ShoppingBag size={24} className={styles.logoRed} /> Shopping Cart
          </h2>
          <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {checkoutSuccess ? (
            <div className={styles.emptyCart}>
              <CheckCircle2 size={64} color="var(--color-red)" className="red-glow-effect" style={{ borderRadius: '50%' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>ORDER SECURED</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Preparing your download keys. Enjoy your gaming sessions!</p>
            </div>
          ) : cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <Gamepad2 size={64} className={styles.emptyCartIcon} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>YOUR CART IS EMPTY</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Explore our catalog and add some premium games to start playing.</p>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`} 
                onClick={() => setCartOpen(false)}
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

        {cart.length > 0 && !checkoutSuccess && (
          <div className={styles.drawerFooter}>
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
