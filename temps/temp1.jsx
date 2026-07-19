import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Sun,
    Moon,
    User,
    Search,
    Sparkles,
    Info,
    Trash2,
    Plus,
    Minus,
    X,
    ChevronRight,
    Send,
    ShieldCheck,
    Gamepad,
    Smile,
    Home as HomeIcon,
    RotateCcw,
    CloudLightning,
    Play,
    Heart,
    ExternalLink,
    MessageSquare
} from 'lucide-react';

// Replicating products and visuals from image_5ce604.png
const INITIAL_PRODUCTS = [
    {
        id: 'p1',
        title: 'Minecraft',
        subtitle: 'PC',
        price: 12000,
        originalPrice: null,
        extraText: 'Premium customized digital edition with collectible custom card cover artwork.',
        category: 'Uncategorized',
        customGraphic: 'smiley',
        glowColor: 'pink',
        tag: 'UNCATEGORIZED',
        badgeText: 'YASIN STORE'
    },
    {
        id: 'p2',
        title: 'GTA 5',
        subtitle: 'PC +1',
        price: 20000,
        originalPrice: 21000,
        extraText: 'Legacy open world edition featuring unique modular cover card elements.',
        category: 'Uncategorized',
        customGraphic: 'house',
        glowColor: 'amber',
        tag: 'UNCATEGORIZED',
        badgeText: 'YASIN STORE'
    },
    {
        id: 'p3',
        title: 'Elden Ring Definitive',
        subtitle: 'Steam Global Key',
        price: 58000,
        originalPrice: 65000,
        extraText: 'Journey through the Lands Between, a legendary action RPG with customized premium card art.',
        category: 'RPG',
        customGraphic: 'sword',
        glowColor: 'cyan',
        tag: 'HOT RELEASE',
        badgeText: 'TRT EXCLUSIVE'
    },
    {
        id: 'p4',
        title: 'Cyberpunk 2077 Phantom',
        subtitle: 'GOG Activation Key',
        price: 45000,
        originalPrice: null,
        extraText: 'Immerse yourself into a sci-fi open world adventure with dynamic holographic cover styling.',
        category: 'Action',
        customGraphic: 'gamepad',
        glowColor: 'purple',
        tag: 'PREMIUM',
        badgeText: 'NEON CORP'
    }
];

// Render precise SVGs matching image_5ce604.png visuals
const GraphicRenderer = ({ type, badgeText, glowColor }) => {
    const getGlowStyle = () => {
        switch (glowColor) {
            case 'pink': return 'rgba(236, 72, 153, 0.4)';
            case 'cyan': return 'rgba(6, 182, 212, 0.4)';
            case 'amber': return 'rgba(245, 158, 11, 0.4)';
            default: return 'rgba(168, 85, 247, 0.4)';
        }
    };

    if (type === 'smiley') {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#09080d] overflow-hidden">
                {/* Glow behind */}
                <div
                    className="absolute w-36 h-36 rounded-full blur-3xl opacity-30 transition-all duration-300"
                    style={{ backgroundColor: getGlowStyle() }}
                />

                {/* Smiley Decal based strictly on image_5ce604.png */}
                <div className="relative w-28 h-28 flex flex-col justify-center items-center select-none z-10">
                    <div className="flex justify-between items-center w-16 mb-4 px-1">
                        {/* Red + Icon on Left */}
                        <span className="text-red-500 font-extrabold text-2xl select-none">+</span>
                        {/* Red double dots / eyes structure on Right */}
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full translate-x-1.5" />
                        </div>
                    </div>
                    {/* Red smiling mouth curved line */}
                    <div className="w-16 h-5 border-b-4 border-red-500 rounded-b-full" />
                </div>

                {/* Customized Bottom Badge */}
                <div className="absolute bottom-4 text-white font-['Orbitron'] font-black text-[11px] tracking-widest uppercase text-center select-none z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {badgeText || 'YASIN STORE'}
                </div>
            </div>
        );
    }

    if (type === 'house') {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#13111c] overflow-hidden">
                {/* Dynamic shadow glow */}
                <div
                    className="absolute w-36 h-36 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: getGlowStyle() }}
                />

                {/* Precise SVG Graphic from image_5ce604.png */}
                <div className="relative w-32 h-32 flex flex-col justify-center items-center z-10">
                    <svg className="w-24 h-24 drop-shadow-2xl" viewBox="0 0 100 100">
                        {/* Yellow thatched roof styled like original image */}
                        <polygon points="50,15 12,52 88,52" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                        {/* Thatch line strokes to represent individual straws */}
                        <line x1="50" y1="15" x2="35" y2="40" stroke="#ca8a04" strokeWidth="0.8" />
                        <line x1="50" y1="15" x2="65" y2="40" stroke="#ca8a04" strokeWidth="0.8" />
                        <line x1="30" y1="35" x2="25" y2="50" stroke="#ca8a04" strokeWidth="0.8" />
                        <line x1="70" y1="35" x2="75" y2="50" stroke="#ca8a04" strokeWidth="0.8" />
                        {/* Brown/Clay wall block */}
                        <rect x="22" y="52" width="56" height="35" fill="#78350f" rx="2" />
                        {/* Block outlines matching pixel/retro looks */}
                        <line x1="38" y1="52" x2="38" y2="87" stroke="#451a03" strokeWidth="0.8" />
                        <line x1="62" y1="52" x2="62" y2="87" stroke="#451a03" strokeWidth="0.8" />
                        <line x1="22" y1="70" x2="78" y2="70" stroke="#451a03" strokeWidth="0.8" />
                        {/* Doorway */}
                        <rect x="44" y="65" width="12" height="22" fill="#451a03" />
                    </svg>
                </div>

                <div className="absolute bottom-4 text-white font-['Orbitron'] font-black text-[11px] tracking-widest uppercase text-center select-none z-10">
                    {badgeText || 'YASIN STORE'}
                </div>
            </div>
        );
    }

    if (type === 'gamepad') {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#07050a] overflow-hidden">
                <div
                    className="absolute w-36 h-36 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: getGlowStyle() }}
                />
                <div className="relative text-purple-400 p-5 rounded-2xl border border-purple-500/20 bg-brand-900/60 z-10 animate-pulse flex flex-col items-center justify-center">
                    <Gamepad size={48} className="text-purple-500 drop-shadow-neon" />
                </div>
                <div className="absolute bottom-4 text-white font-['Orbitron'] font-black text-[11px] tracking-widest uppercase text-center select-none z-10">
                    {badgeText || 'YASIN STORE'}
                </div>
            </div>
        );
    }

    if (type === 'sword') {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#090b14] overflow-hidden">
                <div
                    className="absolute w-36 h-36 rounded-full blur-3xl opacity-25"
                    style={{ backgroundColor: getGlowStyle() }}
                />
                <div className="relative text-cyan-400 z-10 flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                </div>
                <div className="absolute bottom-4 text-white font-['Orbitron'] font-black text-[11px] tracking-widest uppercase text-center select-none z-10">
                    {badgeText || 'YASIN STORE'}
                </div>
            </div>
        );
    }

    return null;
};

export default function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [activeTab, setActiveTab] = useState('store'); // 'store' or 'studio'
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState('dark');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toasts, setToasts] = useState([]);

    // Modals state
    const [activeModal, setActiveModal] = useState(null); // 'about', 'support', 'profile', 'checkout', 'detail'
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Canva Card Studio State
    const [studioState, setStudioState] = useState({
        badgeText: 'YASIN STORE',
        title: 'Minecraft Custom',
        platform: 'PC Special',
        price: 12000,
        theme: 'purple', // 'purple', 'pink', 'cyan', 'amber'
        decal: 'smiley', // 'smiley', 'house', 'gamepad', 'sword'
        pattern: 'gradient' // 'gradient', 'stars'
    });

    const triggerToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    // Synchronize CSS class with HTML tag for Theme support
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        triggerToast(`Added ${product.title} to your cart!`, 'success');
    };

    const removeFromCart = (productId, decrementOnly = false) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === productId);
            if (!existing) return prevCart;

            if (decrementOnly && existing.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevCart.filter(item => item.id !== productId);
        });
        triggerToast('Cart updated.', 'info');
    };

    const calculateSubtotal = () => {
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return {
            iqd: total,
            usd: (total / 1310).toFixed(2)
        };
    };

    const updateStudioField = (field, value) => {
        setStudioState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePublishCustomCard = () => {
        const newId = 'custom-' + Date.now();
        const customProduct = {
            id: newId,
            title: studioState.title || 'User Custom Artifact',
            subtitle: studioState.platform || 'Custom Plate',
            price: Number(studioState.price) || 15000,
            originalPrice: null,
            extraText: 'Fully custom tailored layout designed inside TRT Canva Card Studio.',
            category: 'Custom',
            customGraphic: studioState.decal,
            glowColor: studioState.theme,
            tag: 'CUSTOM',
            badgeText: studioState.badgeText
        };

        setProducts(prev => [customProduct, ...prev]);
        setActiveCategory('All');
        addToCart(customProduct);
        setActiveTab('store');
        triggerToast('Card published! Added to cart and catalog successfully.', 'success');
    };

    const handleResetStudio = () => {
        setStudioState({
            badgeText: 'YASIN STORE',
            title: 'Minecraft Custom',
            platform: 'PC Special',
            price: 12000,
            theme: 'purple',
            decal: 'smiley',
            pattern: 'gradient'
        });
        triggerToast('Canva Studio canvas reset successfully.', 'info');
    };

    const handleCheckoutSubmit = () => {
        setIsCartOpen(false);
        setActiveModal('checkout');
        setTimeout(() => {
            setActiveModal(null);
            setCart([]);
            triggerToast('Order validated! Instantly delivering licenses to your library.', 'success');
            setActiveModal('profile');
        }, 2400);
    };

    // Filter Catalog
    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#07050a] text-gray-200 transition-colors duration-300 selection:bg-purple-600 selection:text-white dark:bg-[#07050a] light:bg-gray-100">

            {/* Dynamic Toast Container */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`p-4 rounded-xl border pointer-events-auto flex items-center gap-3 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up ${t.type === 'success'
                                ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-300'
                                : 'border-purple-500/30 bg-purple-950/90 text-purple-300'
                            }`}
                    >
                        <Smile size={18} />
                        <div className="text-xs font-semibold">{t.message}</div>
                    </div>
                ))}
            </div>

            {/* Main Header Container matching image_5ce604.png structure */}
            <header className="sticky top-0 z-40 bg-[#07050a]/90 backdrop-blur-md border-b border-purple-950/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Brand Logo in purple gradient */}
                        <a href="#" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] transform group-hover:scale-110 transition duration-300">
                                <Gamepad size={20} />
                            </div>
                            <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-purple-400 font-['Orbitron']">
                                TRT <span className="text-purple-500">STORE</span>
                            </span>
                        </a>

                        {/* Center Navigation Tabs from image_5ce604.png upgraded */}
                        <nav className="hidden md:flex items-center gap-1.5 bg-[#120e1d] p-1.5 rounded-full border border-purple-950/40">
                            <button
                                onClick={() => setActiveTab('store')}
                                className={`px-6 py-2 rounded-full font-bold text-xs transition-all duration-300 flex items-center gap-2 ${activeTab === 'store'
                                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <HomeIcon size={14} /> Home
                            </button>
                            <button
                                onClick={() => setActiveTab('studio')}
                                className={`px-6 py-2 rounded-full font-bold text-xs transition-all duration-300 flex items-center gap-2 ${activeTab === 'studio'
                                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Sparkles size={14} /> Canva Studio
                            </button>
                            <button
                                onClick={() => setActiveModal('about')}
                                className="px-6 py-2 rounded-full font-semibold text-xs text-gray-400 hover:text-white transition"
                            >
                                About
                            </button>
                            <button
                                onClick={() => setActiveModal('support')}
                                className="px-6 py-2 rounded-full font-semibold text-xs text-gray-400 hover:text-white transition"
                            >
                                Support
                            </button>
                        </nav>

                        {/* Quick Actions Panel */}
                        <div className="flex items-center gap-3">

                            {/* Theme toggle */}
                            <button
                                onClick={() => {
                                    setTheme(theme === 'dark' ? 'light' : 'dark');
                                    triggerToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 'info');
                                }}
                                className="w-10 h-10 rounded-full border border-purple-950/30 flex items-center justify-center text-gray-400 hover:text-purple-400 transition hover:bg-purple-950/20"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* Profile button */}
                            <button
                                onClick={() => setActiveModal('profile')}
                                className="w-10 h-10 rounded-full border border-purple-950/30 flex items-center justify-center text-gray-400 hover:text-purple-400 transition hover:bg-purple-950/20"
                                title="Account Order Library"
                            >
                                <User size={18} />
                            </button>

                            {/* Cart Drawer Action Button */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative w-10 h-10 rounded-full border border-purple-950/30 flex items-center justify-center text-gray-400 hover:text-purple-400 transition hover:bg-purple-950/20"
                                title="Shopping Bag"
                            >
                                <ShoppingBag size={18} />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#07050a] animate-scale-up">
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            { }
            <main className="min-h-screen pb-20">

                {/* ======================================= */}
                {/* TAB 1: STORE FRONT VIEW                 */}
                {/* ======================================= */}
                {activeTab === 'store' && (
                    <div>
                        {/* Advanced Responsive Hero Section */}
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d091a] via-[#150f28] to-[#0c0817] border border-purple-950/30 shadow-2xl p-8 md:p-12">

                                {/* Background glows */}
                                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full" />
                                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 opacity-15 blur-3xl rounded-full" />

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                    {/* Left content block */}
                                    <div className="lg:col-span-7 space-y-6">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-400 uppercase tracking-widest rounded-full">
                                            <CloudLightning size={12} /> Live Key Dispatch
                                        </span>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Orbitron'] tracking-tight text-white leading-tight">
                                            Masterpieces of <br />
                                            the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Gaming Realm</span>
                                        </h1>
                                        <p className="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed">
                                            Secure official activation licenses or customize dynamic poster cards using our Canva Gaming Studio. Redesigned with the modern neon UI of <span className="text-purple-400">image_5ce604.png</span>.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <a
                                                href="#marketplace"
                                                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs tracking-wide shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                                            >
                                                Explore Marketplace <ChevronRight size={14} />
                                            </a>
                                            <button
                                                onClick={() => setActiveTab('studio')}
                                                className="px-6 py-3.5 rounded-xl bg-[#1c1435] hover:bg-[#251b47] border border-purple-950/40 text-white font-bold text-xs transition flex items-center gap-2"
                                            >
                                                <Sparkles size={14} className="text-purple-400" /> Card Creator Studio
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right side floating showcase cards */}
                                    <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[300px]">
                                        {/* Minecraft Card floating */}
                                        <div className="relative w-56 h-72 rounded-2xl bg-[#0d091a] border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)] transform -rotate-12 hover:rotate-0 hover:scale-105 duration-500 transition-all p-4 z-20 cursor-pointer">
                                            <div className="h-40 rounded-xl overflow-hidden relative border border-purple-950/20">
                                                <GraphicRenderer type="smiley" badgeText="YASIN STORE" glowColor="pink" />
                                            </div>
                                            <div className="mt-3 space-y-1">
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">PC</span>
                                                <h4 className="text-white font-bold text-xs">Minecraft Special</h4>
                                                <div className="flex justify-between items-center pt-1.5">
                                                    <span className="text-xs text-white font-extrabold">12,000 IQD</span>
                                                    <span className="text-[10px] bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded font-bold uppercase">UNCATEGORIZED</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* GTA 5 card background stacked */}
                                        <div className="absolute w-52 h-64 rounded-2xl bg-[#0d091a] border border-purple-500/20 transform rotate-12 translate-x-20 -translate-y-4 hover:translate-x-14 duration-500 transition-all p-3 z-10 opacity-60 hover:opacity-100 cursor-pointer">
                                            <div className="h-32 rounded-xl overflow-hidden relative border border-purple-950/20">
                                                <GraphicRenderer type="house" badgeText="YASIN STORE" glowColor="amber" />
                                            </div>
                                            <div className="mt-2 space-y-0.5">
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">PC +1</span>
                                                <h4 className="text-white font-bold text-xs">GTA 5</h4>
                                                <span className="text-xs text-white font-extrabold block">20,000 IQD</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Features trust banner */}
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#120e1d] p-6 rounded-2xl border border-purple-950/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <CloudLightning size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Auto Dispatch</h4>
                                        <p className="text-[10px] text-gray-500">Instant code delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Escrow</h4>
                                        <p className="text-[10px] text-gray-500">AsiaCell, FastPay & IQD</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Support</h4>
                                        <p className="text-[10px] text-gray-500">24/7 dedicated desk</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Canva Integrated</h4>
                                        <p className="text-[10px] text-gray-500">Design custom covers</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        { }
                        {/* Search and Filters matches styling from image_5ce604.png */}
                        <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-smooth scroll-mt-24">
                            <div className="bg-[#120e1d] p-5 rounded-2xl border border-purple-950/20 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">

                                {/* Search Bar */}
                                <div className="relative w-full md:w-96">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search masterworks or custom covers..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#07050a] border border-purple-950/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                                    />
                                </div>

                                {/* Categories Capsule Menu matches image_5ce604.png perfectly */}
                                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                    {['All', 'Uncategorized', 'RPG', 'Action', 'Custom'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-5 py-2.5 rounded-full font-bold text-[11px] whitespace-nowrap tracking-wide transition duration-300 ${activeCategory === cat
                                                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                                    : 'bg-[#07050a] text-gray-400 border border-purple-950/20 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                            </div>

                            {/* Grid Header */}
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white font-['Orbitron'] tracking-wider flex items-center gap-3">
                                    <span className="w-2.5 h-6 bg-purple-600 rounded"></span> All Masterpieces
                                </h2>
                                <p className="text-[11px] text-gray-500">
                                    Displaying {filteredProducts.length} items
                                </p>
                            </div>

                            {/* Dynamic Catalog Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(p => {

                                    // Setup dynamic glowing border and tags from database metadata
                                    let borderClass = 'border-purple-950/30';
                                    let tagClass = 'bg-purple-600';
                                    if (p.glowColor === 'pink') {
                                        borderClass = 'border-pink-500/30 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)]';
                                        tagClass = 'bg-pink-600';
                                    } else if (p.glowColor === 'cyan') {
                                        borderClass = 'border-cyan-500/30 hover:border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
                                        tagClass = 'bg-cyan-600';
                                    } else if (p.glowColor === 'amber') {
                                        borderClass = 'border-amber-500/30 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
                                        tagClass = 'bg-amber-600';
                                    } else if (p.glowColor === 'purple') {
                                        borderClass = 'border-purple-600/30 hover:border-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.15)]';
                                        tagClass = 'bg-purple-600';
                                    }

                                    return (
                                        <div
                                            key={p.id}
                                            className={`group rounded-2xl bg-[#120e1d] border ${borderClass} p-4 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative`}
                                        >
                                            {/* Graphics card container */}
                                            <div
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setActiveModal('detail');
                                                }}
                                                className="h-44 rounded-xl overflow-hidden relative bg-[#07050a] border border-purple-950/20 cursor-pointer"
                                            >
                                                <span className={`absolute top-2.5 left-2.5 text-[9px] text-white font-extrabold px-2 py-0.5 rounded tracking-wider z-20 ${tagClass}`}>
                                                    {p.tag}
                                                </span>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-20">
                                                    <span className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[10px] font-bold shadow-lg">
                                                        Configure Display Cover
                                                    </span>
                                                </div>

                                                {/* Custom Graphic component rendering precise canvas styles */}
                                                <GraphicRenderer type={p.customGraphic} badgeText={p.badgeText} glowColor={p.glowColor} />
                                            </div>

                                            {/* Info and price block strictly following image_5ce604.png structure */}
                                            <div className="mt-4 space-y-1 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{p.subtitle}</span>
                                                    <h3 className="text-white font-extrabold text-xs tracking-wider group-hover:text-purple-400 transition">{p.title}</h3>
                                                    <p className="text-[11px] text-gray-500 line-clamp-1">{p.extraText}</p>
                                                </div>

                                                <div className="flex justify-between items-center pt-3 mt-3 border-t border-purple-950/10">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-black text-xs">{p.price.toLocaleString()} IQD</span>
                                                        {p.originalPrice && (
                                                            <span className="text-[9px] text-amber-500 line-through">Asia: {p.originalPrice.toLocaleString()} IQD</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(p)}
                                                        className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center transition hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Testimonials Carousel community feedback section */}
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                            <div className="bg-gradient-to-br from-[#120e1d] to-[#07050a] p-8 md:p-12 rounded-3xl border border-purple-950/20 relative overflow-hidden">
                                <div className="absolute top-4 right-4 p-4 text-purple-600/5 select-none">
                                    <Gamepad size={120} />
                                </div>
                                <div className="relative z-10 max-w-2xl space-y-4">
                                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block">TRT Core Communities</span>
                                    <h3 className="text-xl md:text-2xl font-black text-white font-['Orbitron']">Verified Player Experiences</h3>
                                    <p className="text-xs md:text-sm text-gray-300 italic leading-relaxed">
                                        "I submitted a custom card layout featuring my guild emblem through the Canva Card Studio. Within seconds, I published it and checked out with FastPay - the digital key arrived instantly in my order profile library."
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-xs">Y</div>
                                        <div>
                                            <h5 className="text-xs font-bold text-white">Yasin Al-Kirkuki</h5>
                                            <p className="text-[10px] text-purple-400">Verified Pro Member &bull; Kirkuk, IQ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* ======================================= */}
                {/* TAB 2: CANVA GRAPHIC CARD STUDIO VIEW   */}
                {/* ======================================= */}
                {activeTab === 'studio' && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                        <div className="mb-8 space-y-1">
                            <h1 className="text-3xl font-black font-['Orbitron'] tracking-tight text-white flex items-center gap-2">
                                <Sparkles className="text-purple-500 animate-spin" size={24} /> Canva Gaming Studio
                            </h1>
                            <p className="text-gray-400 text-xs max-w-2xl">
                                Design custom cover art for cards. Pick custom base decals, glowing theme colors, text banners, and instantly inject them into the live storefront marketplace!
                            </p>
                        </div>

                        {/* Design Desk Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* Left Control Sidebar */}
                            <div className="lg:col-span-5 bg-[#120e1d] border border-purple-950/30 rounded-3xl p-6 space-y-6">

                                <div className="flex justify-between items-center border-b border-purple-950/20 pb-3">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Canvas Customizer</span>
                                    <button
                                        onClick={handleResetStudio}
                                        className="text-[10px] text-pink-500 flex items-center gap-1 hover:underline"
                                    >
                                        <RotateCcw size={10} /> Reset Canvas
                                    </button>
                                </div>

                                {/* Input Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Bottom Badge Text</label>
                                        <input
                                            type="text"
                                            value={studioState.badgeText}
                                            onChange={(e) => updateStudioField('badgeText', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#07050a] border border-purple-950/30 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Card Title / Game Name</label>
                                        <input
                                            type="text"
                                            value={studioState.title}
                                            onChange={(e) => updateStudioField('title', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#07050a] border border-purple-950/30 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Sub-title / Device Platform</label>
                                        <input
                                            type="text"
                                            value={studioState.platform}
                                            onChange={(e) => updateStudioField('platform', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#07050a] border border-purple-950/30 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Custom Price Point (IQD)</label>
                                        <input
                                            type="number"
                                            value={studioState.price}
                                            onChange={(e) => updateStudioField('price', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#07050a] border border-purple-950/30 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                                        />
                                    </div>
                                </div>

                                {/* Theme Custom glows Selector */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Card Border Frame Glow Theme</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 'purple', label: 'Purple', bg: 'bg-purple-600' },
                                            { id: 'pink', label: 'Pink', bg: 'bg-pink-600' },
                                            { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-600' },
                                            { id: 'amber', label: 'Amber', bg: 'bg-amber-600' }
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => updateStudioField('theme', t.id)}
                                                className={`py-2 rounded-lg text-[10px] font-bold text-white transition-all ${t.bg} ${studioState.theme === t.id ? 'ring-2 ring-white ring-offset-1 ring-offset-[#07050a]' : 'opacity-80'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Base Decal Graphics selection */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Center Vector Illustration</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 'smiley', label: 'Smiley Frame', icon: 'fa-regular fa-face-smile' },
                                            { id: 'house', label: 'Cozy Cottage', icon: 'fa-solid fa-house' },
                                            { id: 'gamepad', label: 'Arcade Stick', icon: 'fa-solid fa-gamepad' },
                                            { id: 'sword', label: 'Guild Sigil', icon: 'fa-solid fa-shield-halved' }
                                        ].map(dec => (
                                            <button
                                                key={dec.id}
                                                onClick={() => updateStudioField('decal', dec.id)}
                                                className={`p-3 rounded-xl bg-[#07050a] border text-white hover:border-purple-600 transition flex flex-col items-center justify-center gap-1 ${studioState.decal === dec.id ? 'border-purple-600 ring-1 ring-purple-600' : 'border-purple-950/20'
                                                    }`}
                                            >
                                                <i className={`${dec.icon} text-sm mb-1`}></i>
                                                <span className="text-[8px] uppercase tracking-wider block leading-none">{dec.id}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Layout Backgrounds */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Backdrop Canvas Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => updateStudioField('pattern', 'gradient')}
                                            className={`py-2 px-3 text-xs font-semibold rounded-xl border text-white transition ${studioState.pattern === 'gradient' ? 'bg-purple-950/40 border-purple-600' : 'bg-[#07050a] border-purple-950/20'
                                                }`}
                                        >
                                            Linear Space
                                        </button>
                                        <button
                                            onClick={() => updateStudioField('pattern', 'stars')}
                                            className={`py-2 px-3 text-xs font-semibold rounded-xl border text-white transition ${studioState.pattern === 'stars' ? 'bg-purple-950/40 border-purple-600' : 'bg-[#07050a] border-purple-950/20'
                                                }`}
                                        >
                                            Deep Cosmos Grid
                                        </button>
                                    </div>
                                </div>

                                {/* Publish Action Button */}
                                <div className="pt-4 border-t border-purple-950/20">
                                    <button
                                        onClick={handlePublishCustomCard}
                                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95 duration-200"
                                    >
                                        Publish to Catalog & Add to Basket
                                    </button>
                                </div>

                            </div>

                            {/* Right Interactive Customizer Preview Card */}
                            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#07050a] border border-purple-950/30 rounded-3xl p-8 relative min-h-[500px]">

                                {/* Visual Guidelines tag */}
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider select-none">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Live Canva Custom View
                                </div>

                                {/* Custom layout representation of the active state parameters */}
                                <div
                                    className={`relative w-72 h-96 rounded-2xl bg-[#120e1d] border-2 p-4 flex flex-col justify-between transition-all duration-300 ${studioState.theme === 'purple' ? 'border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]' :
                                            studioState.theme === 'pink' ? 'border-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.3)]' :
                                                studioState.theme === 'cyan' ? 'border-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]' :
                                                    'border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                        }`}
                                >

                                    {/* Canvas graphic inner frame */}
                                    <div className="h-44 rounded-xl overflow-hidden relative border border-purple-950/20 bg-[#07050a]">
                                        <span className={`absolute top-2.5 left-2.5 text-[9px] text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider z-20 ${studioState.theme === 'purple' ? 'bg-purple-600' :
                                                studioState.theme === 'pink' ? 'bg-pink-600' :
                                                    studioState.theme === 'cyan' ? 'bg-cyan-600' :
                                                        'bg-amber-600'
                                            }`}>
                                            CUSTOM DESIGN
                                        </span>

                                        {/* Accurate SVG renderer updates live inside active canvas wrapper */}
                                        <GraphicRenderer type={studioState.decal} badgeText={studioState.badgeText} glowColor={studioState.theme} />
                                    </div>

                                    {/* Text details metadata live update view */}
                                    <div className="mt-4 space-y-1 flex-grow flex flex-col justify-between">
                                        <div>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">{studioState.platform || 'PC Device'}</span>
                                            <h3 className="text-white font-black text-xs tracking-wider uppercase">{studioState.title || 'Untitled Core Poster'}</h3>
                                            <p className="text-[10px] text-gray-500">Premium dynamic customized display card artifact.</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2.5 border-t border-purple-950/15">
                                            <span className="text-white font-black text-xs">{(Number(studioState.price) || 0).toLocaleString()} IQD</span>
                                            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                                                <Plus size={12} />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-6 text-[10px] text-gray-500 flex items-center gap-2">
                                    <Info size={12} className="text-purple-500" /> Dynamic card design updates in real time.
                                </div>

                            </div>

                        </div>
                    </section>
                )}

            </main>

            { }
            <footer className="bg-[#050307] border-t border-purple-950/20 py-12 text-gray-500 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                        {/* Logo details and text */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-black">
                                    <Gamepad size={14} />
                                </div>
                                <span className="text-base font-bold text-white font-['Orbitron'] tracking-wider">
                                    TRT <span className="text-purple-500">STORE</span>
                                </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-gray-500">
                                Premium specialized gaming marketplace delivering secure keys, custom card posters, and exceptional game collectibles. Rebuilt using React from <span className="text-purple-400">image_5ce604.png</span>.
                            </p>
                        </div>

                        {/* Quick Navigation links */}
                        <div>
                            <h5 className="text-white text-[10px] font-bold uppercase tracking-wider mb-3">Explore Hub</h5>
                            <ul className="space-y-2 text-[11px]">
                                <li><button onClick={() => setActiveTab('store')} className="hover:text-white transition">Catalog Marketplace</button></li>
                                <li><button onClick={() => setActiveTab('studio')} className="hover:text-white transition">Canva Poster Studio</button></li>
                                <li><button onClick={() => setActiveModal('about')} className="hover:text-white transition">Our Design Mission</button></li>
                            </ul>
                        </div>

                        {/* Support queries and operations */}
                        <div>
                            <h5 className="text-white text-[10px] font-bold uppercase tracking-wider mb-3">Service Helpdesk</h5>
                            <ul className="space-y-2 text-[11px]">
                                <li><button onClick={() => setActiveModal('support')} className="hover:text-white transition">Submit Digital Ticket</button></li>
                                <li><button onClick={() => triggerToast('License policy updated.', 'info')} className="hover:text-white transition">Digital Terms & Returns</button></li>
                                <li><button onClick={() => triggerToast('Core Privacy Policy loaded.', 'info')} className="hover:text-white transition">Privacy Guidelines</button></li>
                            </ul>
                        </div>

                        {/* Newsletter element */}
                        <div>
                            <h5 className="text-white text-[10px] font-bold uppercase tracking-wider mb-3">Keep in Touch</h5>
                            <p className="text-[11px] text-gray-500 mb-3">Subscribe for promotional game updates.</p>
                            <div className="flex gap-1.5">
                                <input
                                    type="email"
                                    placeholder="gamer@trt.com"
                                    className="px-3 py-2 bg-[#0c0817] border border-purple-950/30 text-[11px] text-white rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-purple-600"
                                />
                                <button
                                    onClick={() => triggerToast('Subscribed successfully!', 'success')}
                                    className="px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 text-[11px] font-semibold transition"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="border-t border-purple-950/10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-600">
                        <p>&copy; 2026 TRT STORE Digital. Inspired directly by "image_5ce604.png". All Rights Reserved.</p>
                        <div className="flex items-center gap-1 text-purple-600">
                            <Gamepad size={14} />
                            <span className="font-bold text-gray-500 font-['Orbitron']">TRT STORE</span>
                        </div>
                    </div>

                </div>
            </footer>

            {/* ======================================= */}
            {/* SHOPPING CART SLIDE-OUT DRAWER VIEW      */}
            {/* ======================================= */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsCartOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    />

                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md bg-[#0d091a] border-l border-purple-950/40 shadow-2xl flex flex-col justify-between animate-slide-left text-xs">

                            {/* Header */}
                            <div className="p-6 border-b border-purple-950/20 flex items-center justify-between">
                                <h3 className="text-sm font-bold font-['Orbitron'] tracking-wider text-white flex items-center gap-2">
                                    <ShoppingBag className="text-purple-500" size={16} /> Shopping Basket
                                </h3>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-8 h-8 rounded-full border border-purple-950/20 flex items-center justify-center text-gray-400 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="flex-grow p-6 overflow-y-auto space-y-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-24 text-gray-500 space-y-3">
                                        <ShoppingBag size={48} className="text-purple-950/60 animate-pulse" />
                                        <p className="font-bold text-gray-400">Your basket is currently empty</p>
                                        <p className="text-[11px] text-gray-600">Add masterpiece items from catalog grid</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 bg-[#120e1d] p-3 rounded-xl border border-purple-950/10"
                                        >
                                            {/* Left visual representation */}
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#07050a] flex-shrink-0 relative border border-purple-950/20">
                                                <GraphicRenderer type={item.customGraphic} badgeText={item.badgeText} glowColor={item.glowColor} />
                                            </div>

                                            {/* Content metadata */}
                                            <div className="flex-grow min-w-0">
                                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{item.subtitle}</span>
                                                <h4 className="text-white font-bold text-xs truncate leading-snug">{item.title}</h4>
                                                <span className="text-purple-400 font-bold block mt-0.5">{item.price.toLocaleString()} IQD</span>
                                            </div>

                                            {/* Quantities logic */}
                                            <div className="flex flex-col items-end gap-2">
                                                <button
                                                    onClick={() => removeFromCart(item.id, false)}
                                                    className="text-gray-500 hover:text-pink-500 transition"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <div className="flex items-center bg-[#07050a] border border-purple-950/20 rounded py-0.5 px-1.5 gap-2">
                                                    <button
                                                        onClick={() => removeFromCart(item.id, true)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="text-[10px] text-white font-bold select-none">{item.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer Calculations */}
                            {cart.length > 0 && (
                                <div className="p-6 border-t border-purple-950/20 bg-[#120e1d] space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-gray-400 text-[11px]">
                                            <span>Total pieces</span>
                                            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} units</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1 border-t border-purple-950/5">
                                            <span className="text-white font-bold">Estimated Subtotal</span>
                                            <span className="text-purple-400 text-sm font-black font-['Orbitron']">
                                                {calculateSubtotal().iqd.toLocaleString()} IQD
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-500">
                                            <span>US Dollar conversion</span>
                                            <span className="font-bold">${calculateSubtotal().usd} USD</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckoutSubmit}
                                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-purple-500/10 active:scale-95 duration-200 transition"
                                    >
                                        Proceed to Secure Checkout <ChevronRight className="inline" size={14} />
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* ======================================= */}
            {/* INTERACTIVE COMPONENT MODALS DIALOGS   */}
            {/* ======================================= */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Modal Backdrop */}
                    <div
                        onClick={() => setActiveModal(null)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                    />

                    {/* About Modal */}
                    {activeModal === 'about' && (
                        <div className="relative bg-[#120e1d] border border-purple-950/40 rounded-3xl p-6 max-w-md w-full text-xs text-gray-300 space-y-4 animate-scale-up">
                            <div className="flex justify-between items-center border-b border-purple-950/20 pb-3">
                                <h4 className="text-sm font-bold font-['Orbitron'] text-white flex items-center gap-2">
                                    <Info size={16} className="text-purple-500" /> About TRT Store
                                </h4>
                                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                            <p className="leading-relaxed text-gray-400">
                                **TRT Store** is a specialized conceptual gaming portal built to deliver verified digital game keys and customized canvas covers.
                            </p>
                            <p className="leading-relaxed text-gray-400">
                                This redesigned application converts the visual layouts of **image_5ce604.png** into modular, reactive elements. It features highly customized inline SVG illustrations replicating original flat cards perfectly.
                            </p>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[11px]"
                            >
                                Got it
                            </button>
                        </div>
                    )}

                    {/* Support Modal */}
                    {activeModal === 'support' && (
                        <div className="relative bg-[#120e1d] border border-purple-950/40 rounded-3xl p-6 max-w-md w-full text-xs text-gray-300 space-y-4 animate-scale-up">
                            <div className="flex justify-between items-center border-b border-purple-950/20 pb-3">
                                <h4 className="text-sm font-bold font-['Orbitron'] text-white flex items-center gap-2">
                                    <Smile size={16} className="text-purple-500" /> TRT Support Helpdesk
                                </h4>
                                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                            <p className="text-gray-400">
                                Have trouble with keys, custom creations, or checkout verification? Submit a ticket below:
                            </p>
                            <div className="p-3 bg-[#07050a] border border-purple-950/20 rounded-xl space-y-1">
                                <p className="font-bold text-white text-[10px] uppercase text-purple-400">Kirkuk Office Hours</p>
                                <p className="text-[10px] text-gray-500">Saturday - Thursday: 9:00 AM - 11:00 PM (GMT+3)</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase text-gray-500 font-bold block">Describe your inquiry</label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter details here..."
                                    className="w-full p-3 bg-[#07050a] border border-purple-950/30 text-xs text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setActiveModal(null);
                                    triggerToast('Support ticket registered! We will respond shortly.', 'success');
                                }}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[11px]"
                            >
                                Submit Ticket
                            </button>
                        </div>
                    )}

                    {/* Account/Profile Library Modal */}
                    {activeModal === 'profile' && (
                        <div className="relative bg-[#120e1d] border border-purple-950/40 rounded-3xl p-6 max-w-md w-full text-xs text-gray-300 space-y-4 animate-scale-up">
                            <div className="flex justify-between items-center border-b border-purple-950/20 pb-3">
                                <h4 className="text-sm font-bold font-['Orbitron'] text-white flex items-center gap-2">
                                    <User size={16} className="text-purple-500" /> Account Order Library
                                </h4>
                                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[#07050a] border border-purple-950/10 rounded-2xl">
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-xs">U</div>
                                <div>
                                    <h4 className="font-bold text-white">Yasin Store Member</h4>
                                    <p className="text-[10px] text-gray-500">ID: #99320-TRT</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block">Delivered Keys</h5>
                                <div className="p-3 bg-[#07050a] border border-purple-950/10 rounded-xl text-[11px] text-gray-400 space-y-1">
                                    <p className="text-white font-bold flex items-center gap-1.5">
                                        <Gamepad size={12} className="text-purple-500" /> Minecraft Premium Digital Code
                                    </p>
                                    <p className="text-[10px]">Delivered &bull; Checked Out (FastPay)</p>
                                    <p className="p-1.5 bg-[#0d091a] border border-purple-950/20 rounded text-[9px] text-purple-400 font-mono tracking-widest uppercase mt-2">
                                        TRT-REDEEM-MINECRAFT-99320-IQD
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[11px]"
                            >
                                Close Library
                            </button>
                        </div>
                    )}

                    {/* Secure pipeline Checkout Simulator modal */}
                    {activeModal === 'checkout' && (
                        <div className="relative bg-[#120e1d] border border-purple-950/40 rounded-3xl p-8 max-w-md w-full text-center space-y-6 animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-purple-500/15 text-purple-500 flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <CloudLightning size={28} className="animate-bounce" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-white font-['Orbitron'] tracking-wider">Securing Transaction Pipeline</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Establishing instantaneous secure code delivery protocol and validating Iraqi escrow networks...
                                </p>
                            </div>
                            <div className="w-full bg-[#07050a] rounded-full h-1.5 overflow-hidden border border-purple-950/15">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full w-4/5 animate-loading-bar" />
                            </div>
                        </div>
                    )}

                    {/* Product Detail specifications modal */}
                    {activeModal === 'detail' && selectedProduct && (
                        <div className="relative bg-[#120e1d] border border-purple-950/40 rounded-3xl p-6 max-w-xl w-full text-xs text-gray-300 animate-scale-up">
                            <div className="flex justify-between items-center border-b border-purple-950/20 pb-4 mb-4">
                                <h4 className="text-sm font-bold font-['Orbitron'] text-white">Masterpiece Product Details</h4>
                                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                                {/* Visual rendering inside Detail preview frame */}
                                <div className="h-48 rounded-xl bg-[#07050a] border border-purple-950/20 overflow-hidden relative">
                                    <GraphicRenderer
                                        type={selectedProduct.customGraphic}
                                        badgeText={selectedProduct.badgeText}
                                        glowColor={selectedProduct.glowColor}
                                    />
                                </div>

                                {/* Detail text details */}
                                <div className="space-y-4">
                                    <span className="text-[9px] text-white bg-purple-600 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                                        {selectedProduct.category}
                                    </span>
                                    <div className="space-y-1">
                                        <h3 className="text-white font-extrabold text-sm">{selectedProduct.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-[11px]">
                                            {selectedProduct.extraText} Instant secure code delivery dispatched automatically to your order library upon receipt of verified payments.
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">PRICE IN DINAR</span>
                                        <span className="text-lg font-black text-white">{selectedProduct.price.toLocaleString()} IQD</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                addToCart(selectedProduct);
                                                setActiveModal(null);
                                            }}
                                            className="flex-grow py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[11px]"
                                        >
                                            Add To Basket
                                        </button>
                                        <button
                                            onClick={() => setActiveModal(null)}
                                            className="px-4 py-2.5 border border-purple-950/20 hover:bg-[#07050a] hover:text-white text-gray-400 rounded-xl transition"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}