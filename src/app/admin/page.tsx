'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './admin.module.css';
import { Game, staticGames } from '../gamesData';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle,
  Database,
  Lock,
  Upload,
  Gamepad2,
  Monitor,
  Smartphone,
  Tv
} from 'lucide-react';

const DEFAULT_LOGO_POSTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260" fill="none"><rect width="200" height="260" fill="%230c0c0e"/><rect x="2" y="2" width="196" height="256" rx="10" stroke="%23ff2e4d" stroke-width="2" stroke-opacity="0.4"/><path d="M50 110H70M60 100V120" stroke="%23ff2e4d" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="105" r="6" fill="%23ff2e4d"/><circle cx="145" cy="118" r="6" fill="%23ff2e4d"/><path d="M60 155C75 170 125 170 140 155" stroke="%23ff2e4d" stroke-width="4" stroke-linecap="round"/><text x="100" y="220" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1" text-anchor="middle">YASIN STORE</text></svg>`;

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Password Lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Dark Fantasy RPG');
  const [genresList, setGenresList] = useState<string[]>([
    'Dark Fantasy RPG', 
    'Racing Simulation', 
    'Sci-Fi Exploration', 
    'Tactical Stealth',
    'Action Adventure',
    'First-Person Shooter'
  ]);
  const [newGenreInput, setNewGenreInput] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [posterFile, setPosterFile] = useState<string | null>(null);
  const [posterFileName, setPosterFileName] = useState('');
  const [released, setReleased] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['PC']);

  // Load games, theme, and authentication
  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const savedGames = localStorage.getItem('yasin-store-games');
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (e) {
        setGames(staticGames);
      }
    } else {
      setGames(staticGames);
      localStorage.setItem('yasin-store-games', JSON.stringify(staticGames));
    }

    // Check if authenticated in session
    const isAuthed = sessionStorage.getItem('yasin-store-admin-authed');
    if (isAuthed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = 'Rt92Lm#847pqX5@9012Zk';

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('yasin-store-admin-authed', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Convert uploaded image file to Base64 data url
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPosterFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleAddGenre = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newGenreInput.trim();
    if (trimmed) {
      if (!genresList.includes(trimmed)) {
        setGenresList([...genresList, trimmed]);
      }
      setGenre(trimmed);
      setNewGenreInput('');
      showToast(`Genre "${trimmed}" added and selected.`);
    }
  };

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !released || selectedPlatforms.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create unique slug ID
    const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (games.some(g => g.id === newId)) {
      alert('A game with this title already exists in the catalog.');
      return;
    }

    const finalPoster = posterFile || DEFAULT_LOGO_POSTER;

    const newGame: Game = {
      id: newId,
      title,
      genre,
      description: description || 'No description provided.',
      price: parseFloat(parseFloat(price).toFixed(2)),
      poster: finalPoster,
      released,
      platforms: selectedPlatforms
    };

    const updatedGames = [newGame, ...games];
    setGames(updatedGames);
    localStorage.setItem('yasin-store-games', JSON.stringify(updatedGames));

    // Reset Form
    setTitle('');
    setDescription('');
    setPrice('');
    setPosterFile(null);
    setPosterFileName('');
    setSelectedPlatforms(['PC']);
    setReleased(new Date().toISOString().split('T')[0]);

    showToast(`"${title}" added successfully!`);
  };

  const handleDeleteGame = (id: string, gameTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${gameTitle}" from the store catalog?`)) {
      return;
    }

    const updatedGames = games.filter(g => g.id !== id);
    setGames(updatedGames);
    localStorage.setItem('yasin-store-games', JSON.stringify(updatedGames));
    showToast(`"${gameTitle}" removed.`);
  };

  const platformsList = [
    { name: 'PC', icon: <Monitor size={14} /> },
    { name: 'PS5', icon: <Tv size={14} /> },
    { name: 'Xbox Series X', icon: <Gamepad2 size={14} /> },
    { name: 'Switch', icon: <Smartphone size={14} /> }
  ];

  if (!isAuthenticated) {
    return (
      <div className={styles.lockScreen}>
        <div className={styles.lockCard}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-red)' }}>
            <Lock size={48} className="red-glow-effect" style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(255,46,77,0.1)' }} />
          </div>
          <h1 className={styles.lockTitle}>Admin Access</h1>
          <p className={styles.lockDesc}>Enter the cryptographic console key to access the Yasin Store catalog database.</p>
          <form onSubmit={handlePasswordSubmit} className={styles.lockForm}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              className={styles.input}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
            {loginError && (
              <span className={styles.lockError}>Invalid key password. Access Denied.</span>
            )}
            <button type="submit" className={styles.submitBtn}>
              Grant Access
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
            YASIN <span className={styles.titleRed}>STORE</span> Admin
          </h1>
          <span className={styles.subtitle}>Manage gaming products and inventory catalog</span>
        </div>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </header>

      {/* Main Console */}
      <main className={`${styles.dashboardGrid} container`}>
        {/* Left Side: Add Product Form */}
        <section className={styles.panelCard}>
          <h2 className={styles.panelTitle}>
            <Plus size={20} className={styles.titleRed} /> Add New Game
          </h2>
          <form className={styles.form} onSubmit={handleAddGame}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Game Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Grand Theft Auto VI" 
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Genre *</label>
              <div className={styles.platformsGrid} style={{ marginBottom: '8px' }}>
                {genresList.map((g) => {
                  const isActive = genre === g;
                  return (
                    <button
                      type="button"
                      key={g}
                      className={`${styles.platformBtn} ${isActive ? styles.platformBtnActive : ''}`}
                      onClick={() => setGenre(g)}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Or type a custom genre..." 
                  className={styles.input}
                  value={newGenreInput}
                  onChange={(e) => setNewGenreInput(e.target.value)}
                />
                <button 
                  type="button" 
                  className={styles.backBtn}
                  style={{ whiteSpace: 'nowrap', padding: '0 16px' }}
                  onClick={handleAddGenre}
                >
                  Add Genre
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea 
                placeholder="Write a game synopsis (optional)..." 
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Release Date *</label>
              <input 
                type="date" 
                className={styles.input}
                value={released}
                onChange={(e) => setReleased(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Platforms *</label>
              <div className={styles.platformsGrid}>
                {platformsList.map((platform) => {
                  const isActive = selectedPlatforms.includes(platform.name);
                  return (
                    <button
                      type="button"
                      key={platform.name}
                      className={`${styles.platformBtn} ${isActive ? styles.platformBtnActive : ''}`}
                      onClick={() => togglePlatform(platform.name)}
                    >
                      {platform.icon} {platform.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <Plus size={18} /> Add Game to Catalog
            </button>
          </form>
        </section>

        {/* Right Side: Current Catalog List */}
        <section className={styles.panelCard}>
          <h2 className={styles.panelTitle}>
            <Database size={20} className={styles.titleRed} /> Current Catalog ({games.length})
          </h2>
          <div className={styles.catalogList}>
            {games.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                Catalog is empty. Add games using the form.
              </p>
            ) : (
              games.map((game) => (
                <div key={game.id} className={styles.catalogItem}>
                  <div className={styles.itemImgWrapper}>
                    <Image 
                      src={game.poster} 
                      alt={game.title} 
                      fill 
                      sizes="50px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{game.title}</h3>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemGenre}>{game.genre}</span>
                      <span className={styles.itemPrice}>{game.price.toLocaleString()} IQD</span>
                    </div>
                  </div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteGame(game.id, game.title)}
                    title="Remove Game"
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
