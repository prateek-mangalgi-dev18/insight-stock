import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Shield, Zap, Globe, Cpu, ChevronDown, CheckCircle, Smartphone, Database, Server, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarketSnapshot from '../components/MarketSnapshot';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon Issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PremiumDashboard = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = (e.clientX - rect.left) / width - 0.5;
        const mouseYFromCenter = (e.clientY - rect.top) / height - 0.5;

        x.set(mouseXFromCenter);
        y.set(mouseYFromCenter);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-[500px] flex items-center justify-center perspective-1000 cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative z-10 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-md border-t-white/20"
            >
                {/* Glassmorphism Highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />

                {/* Simulated Dashboard UI */}
                <div className="relative z-20">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 flex items-center">
                            <Zap className="w-3 h-3 mr-1 text-neon-blue" />
                            REAL-TIME CONNECTION
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Header Stats */}
                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 backdrop-blur-md">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-neon-blue font-bold border border-neon-blue/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 tracking-wider">MARKET PULSE</div>
                                    <div className="text-sm font-bold text-white flex items-center">
                                        $4,290.55
                                        <span className="ml-2 text-neon-green text-[10px] bg-neon-green/10 px-1.5 py-0.5 rounded border border-neon-green/20">+18.5%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Chart Area */}
                        <div className="h-48 bg-[#0a0c10] rounded-lg border border-gray-800 relative overflow-hidden group shadow-inner">
                            {/* Grid Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none" />

                            {/* Moving Scanline */}
                            <motion.div
                                className="absolute left-0 right-0 h-12 bg-gradient-to-b from-neon-blue/0 via-neon-blue/10 to-neon-blue/0 pointer-events-none z-10"
                                animate={{ top: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Grid */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-10 pointer-events-none">
                                {[...Array(24)].map((_, i) => <div key={i} className="border-r border-b border-gray-600"></div>)}
                            </div>

                            {/* SVG Chart */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <linearGradient id="chartGradientNew" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Ghost Line */}
                                <motion.path
                                    d="M0 150 C 50 145, 100 110, 150 120 S 250 60, 300 70 S 400 100, 500 50"
                                    fill="none"
                                    stroke="#00f3ff"
                                    strokeWidth="2"
                                    strokeOpacity="0.3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: 0.2 }}
                                />
                                {/* Main Line */}
                                <motion.path
                                    d="M0 150 C 50 140, 100 100, 150 110 S 250 50, 300 60 S 400 90, 500 40"
                                    fill="url(#chartGradientNew)"
                                    stroke="none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                />
                                <motion.path
                                    d="M0 150 C 50 140, 100 100, 150 110 S 250 50, 300 60 S 400 90, 500 40"
                                    fill="none"
                                    stroke="#00f3ff"
                                    strokeWidth="3"
                                    filter="url(#glow)"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                                {/* Volume Bars */}
                                <motion.g opacity="0.3">
                                    {[20, 35, 25, 45, 30, 55, 40, 60, 35, 50, 45, 65, 50, 70, 60].map((h, i) => (
                                        <motion.rect
                                            key={i}
                                            x={i * 35}
                                            y={150 - h}
                                            width="20"
                                            height={h}
                                            fill="#00f3ff"
                                            initial={{ height: 0 }}
                                            animate={{ height: h }}
                                            transition={{ duration: 1.5, delay: 0.5 + i * 0.05 }}
                                        />
                                    ))}
                                </motion.g>
                            </svg>

                            {/* Floating Tooltip */}
                            <motion.div
                                className="absolute top-[20%] right-[30%] bg-black/80 backdrop-blur text-[10px] px-2 py-1 rounded border border-neon-blue/50 text-neon-blue shadow-lg z-20"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                ATH $480.2
                            </motion.div>
                        </div>

                        {/* Interactive Bottom Panels */}
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="bg-gray-900/40 p-2 rounded-lg border border-white/5 cursor-pointer backdrop-blur-sm hover:border-purple-500/50 transition-colors"
                            >
                                <div className="text-white mb-1 font-bold">VOL</div>
                                <div className="text-purple-400 font-bold tracking-wider">2.4M</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="bg-gray-900/40 p-2 rounded-lg border border-white/5 cursor-pointer backdrop-blur-sm hover:border-orange-400/50 transition-colors"
                            >
                                <div className="text-white mb-1 font-bold">RSI</div>
                                <div className="text-orange-400 font-bold tracking-wider">64.2</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="bg-neon-blue/10 p-2 rounded-lg border border-neon-blue/30 cursor-pointer backdrop-blur-sm flex items-center justify-center hover:bg-neon-blue/20 hover:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                            >
                                <span className="text-neon-blue font-bold tracking-wider">TRADE</span>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements with Physics */}
                <motion.div
                    style={{ transformStyle: "preserve-3d", translateZ: 50 }}
                    animate={{ y: [-10, 10], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-16 -right-4 bg-[#1c1f26]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-30 w-40"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-neon-emerald/20 rounded-lg">
                            <Shield className="w-5 h-5 text-neon-emerald" />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Risk Level</div>
                            <div className="font-bold text-neon-emerald text-sm">LOW RISK</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ transformStyle: "preserve-3d", translateZ: 60 }}
                    animate={{ y: [10, -10], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-16 -left-4 bg-[#1c1f26]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-30 w-48"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-neon-purple/20 rounded-lg">
                            <Cpu className="w-5 h-5 text-neon-purple" />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">AI Insight</div>
                            <div className="font-bold text-white text-sm">Validating Breakout</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13161b] via-[#050505] to-black text-white overflow-hidden font-sans selection:bg-neon-blue selection:text-black">

            {/* 3D Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px]"
                />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold font-mono tracking-tighter flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-md flex items-center justify-center">
                            <Activity className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold font-mono tracking-tighter flex items-center">Insight<span className="text-neon-blue">Stock</span></span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#feedback" className="hover:text-white transition-colors">Feedback</a>
                        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-full hover:bg-neon-blue hover:text-black transition-all duration-300"
                        >
                            Launch Terminal
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-xs font-mono text-neon-blue">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                            </span>
                            <span>AI-POWERED MARKET INTELLIGENCE</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Analyze Stocks with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple overflow-hidden whitespace-nowrap border-r-4 border-neon-blue animate-typewriter-loop inline-block align-bottom pb-2">
                                InsightStock
                            </span>
                        </h1>

                        <p className="text-lg text-gray-400 mb-4 max-w-xl leading-relaxed">
                            Stop manually reading annualized reports. Our AI reads thousands of data points, news, and fundamentals in seconds to give you institutional-grade insights.
                        </p>

                        <p className="text-xs text-gray-500 mb-8 max-w-xl border-l-2 border-neon-blue/30 pl-3">
                            <span className="text-red-400 font-bold">Disclaimer:</span> Content is for educational purposes only. Not financial advice.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="group w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                            >
                                <span>Start Analysis</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                        </div>
                    </motion.div>

                    {/* 3D Visual Rep */}
                    <PremiumDashboard />
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-6 h-6 text-gray-500" />
                </div>
            </section>

            {/* Market Snapshot Section */}
            <section className="py-20 px-6 bg-[#0a0c10] border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 mb-6 text-xs font-mono text-neon-blue">
                            <Activity className="w-3 h-3" />
                            <span>LIVE MARKET DATA</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Pulse of the Market <br />
                            <span className="text-gray-500">at a Glance.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Stay ahead with real-time tracking of top gainers, losers, and most active stocks.
                            Our algorithms filter the noise to show you where the money is moving right now.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {['Top Gainers & Losers', 'Volume Analysis', 'Real-time Updates', 'NSE 50 Coverage'].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-neon-purple" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <MarketSnapshot />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-black/40 border-t border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Institutional Tools for Everyone</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We combine traditional technical analysis with modern LLM intelligence to give you the complete picture.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Cpu, title: "AI-Powered Analysis", desc: "Our agents read news, earnings reports, and charts so you don't have to." },
                            { icon: Globe, title: "Real-Time Global Data", desc: "Access live market data for thousands of tickers across global exchanges." },
                            { icon: Shield, title: "Risk & Volatility Guard", desc: "Advance quantitative models assess risk levels instantly." }
                        ].map((feature, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                key={i}
                                className="group p-8 rounded-2xl bg-[#0a0c10] border border-gray-800 hover:border-neon-blue/50 hover:bg-[#13161b] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-[50px] group-hover:bg-neon-blue/10 transition-colors"></div>
                                <feature.icon className="w-10 h-10 text-neon-blue mb-6" />
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section id="feedback" className="py-20 px-6 bg-[#050505] border-b border-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block p-4 rounded-full bg-neon-purple/10 border border-neon-purple/20 mb-6">
                        <Smartphone className="w-8 h-8 text-neon-purple" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">We Value Your Feedback</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Help us shape the future of InsightStock. Fill out the form below to report bugs or request features.
                    </p>

                    {/* Feedback Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-8"
                    >
                        <button
                            onClick={() => setShowFeedback(true)}
                            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <span>Give Feedback</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Contact Details Section */}
            <section id="contact" className="py-20 px-6 bg-[#020202]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Need enterprise solutions or have specific inquiries? Our team is ready to assist you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-900 rounded-lg">
                                        <Globe className="w-6 h-6 text-neon-blue" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Headquarters</h4>
                                        <p className="text-gray-500">123 Innovation Drive, Tech City, TC 90210</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-900 rounded-lg">
                                        <Cpu className="w-6 h-6 text-neon-blue" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Email Us</h4>
                                        <p className="text-gray-500">support@stockai.terminal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leaflet Map */}
                        <div className="h-[350px] w-full bg-[#13161b] rounded-2xl border border-gray-800 relative overflow-hidden group shadow-2xl z-0">
                            <MapContainer
                                center={[12.8252, 77.5140]}
                                zoom={15}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                                className="z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                <Marker position={[12.8252, 77.5140]}>
                                    <Popup>
                                        <div className="text-black font-sans text-sm">
                                            <b>Dayananda Sagar Academy</b><br />
                                            Kanakapura Main Rd, Bangalore
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>

                            <div className="absolute top-4 right-4 pointer-events-none z-[400]">
                                <div className="px-3 py-1 bg-black/80 backdrop-blur border border-neon-blue/30 rounded-full text-[10px] font-mono text-neon-blue flex items-center shadow-lg">
                                    <div className="w-2 h-2 bg-neon-blue rounded-full mr-2 animate-pulse"></div>
                                    LIVE SERVER NODE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-900 bg-[#020202]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-bold font-mono tracking-tighter mb-4">
                            Insight<span className="text-neon-blue">Stock</span>
                        </div>
                        <p className="text-gray-500 max-w-sm">
                            Reinventing how retail investors analyze the market. Built with ❤️ for the future of finance.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-500 text-sm">
                            <li><a href="#features" className="hover:text-neon-blue transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-neon-blue transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-neon-blue transition-colors">Roadmap</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-500 text-sm">
                            <li>
                                <button onClick={() => setShowAbout(true)} className="hover:text-neon-blue transition-colors text-left">
                                    About Us
                                </button>
                            </li>
                            <li><a href="#contact" className="hover:text-neon-blue transition-colors">Contact</a></li>
                            <li>
                                <button onClick={() => setShowPrivacy(true)} className="hover:text-neon-blue transition-colors text-left">
                                    Privacy Policy
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
                    <p>© {new Date().getFullYear()} InsightStock. All rights reserved.</p>
                    <p className="mt-2 text-xs text-gray-700">Content is for educational purposes only. Not financial advice.</p>
                </div>
            </footer>

            {/* Feedback Modal */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowFeedback(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#13161b] border border-gray-700/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col custom-scrollbar"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0c10]">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-neon-purple" />
                                    Send Feedback
                                </h3>
                                <button
                                    onClick={() => setShowFeedback(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Form Content */}
                            <div className="p-8">
                                <form className="space-y-6 text-left" onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const btn = form.querySelector('button[type="submit"]');
                                    const originalText = btn.innerHTML; // Capture original HTML (icon + text)

                                    // Manual extraction to match previous implementation logic
                                    const nameInput = form.querySelector('input[type="text"]');
                                    const emailInput = form.querySelector('input[type="email"]');
                                    const typeInput = form.querySelector('input[name="type"]:checked');
                                    const messageInput = form.querySelector('textarea');

                                    const finalPayload = {
                                        name: nameInput.value,
                                        email: emailInput.value,
                                        type: typeInput ? typeInput.parentNode.textContent.trim() : 'General',
                                        message: messageInput.value
                                    };

                                    btn.innerHTML = 'Sending...';

                                    try {
                                        // Use port 8001 as verified in backend config
                                        const response = await fetch('http://localhost:8001/api/feedback', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(finalPayload)
                                        });

                                        if (response.ok) {
                                            btn.innerHTML = 'Saved to Database! 💾';
                                            btn.classList.remove('bg-neon-purple', 'text-black');
                                            btn.classList.add('bg-green-500', 'text-white');
                                            form.reset();
                                            setTimeout(() => {
                                                // Reset button state
                                                btn.innerHTML = originalText;
                                                btn.classList.add('bg-neon-purple', 'text-black');
                                                btn.classList.remove('bg-green-500', 'text-white');
                                                setShowFeedback(false); // Close modal on success
                                            }, 2000);
                                        } else {
                                            const errorData = await response.json();
                                            throw new Error(errorData.detail || 'Failed to submit');
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        btn.innerHTML = 'Error Saving ❌';
                                        btn.classList.add('bg-red-500', 'text-white');
                                        setTimeout(() => {
                                            btn.innerHTML = originalText;
                                            btn.classList.remove('bg-red-500', 'text-white');
                                        }, 3000);
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="John Doe"
                                                className="w-full bg-[#0a0c10] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Email</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                className="w-full bg-[#0a0c10] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Feedback Type</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Bug Report', 'Feature Request', 'General'].map((type) => (
                                                <label key={type} className="cursor-pointer">
                                                    <input type="radio" name="type" className="peer sr-only" required />
                                                    <div className="text-center py-2 rounded-lg border border-gray-800 text-gray-400 peer-checked:bg-neon-purple/20 peer-checked:border-neon-purple peer-checked:text-neon-purple transition-all text-sm hover:bg-gray-800">
                                                        {type}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Message</label>
                                        <textarea
                                            required
                                            rows="4"
                                            placeholder="Tell us what you think..."
                                            className="w-full bg-[#0a0c10] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple transition-colors placeholder:text-gray-600 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-neon-purple text-black font-bold py-4 rounded-lg hover:bg-[#b026ff] transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(189,0,255,0.3)] flex items-center justify-center space-x-2"
                                    >
                                        <span>Send Feedback</span>
                                        <Zap className="w-4 h-4 fill-current" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Privacy Policy Modal */}
            <AnimatePresence>
                {showPrivacy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowPrivacy(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#13161b] border border-gray-700/50 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0c10]">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-neon-blue" />
                                    Privacy Policy
                                </h3>
                                <button
                                    onClick={() => setShowPrivacy(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 overflow-y-auto space-y-6 text-gray-300 text-sm leading-relaxed custom-scrollbar">
                                <p>
                                    <strong>Effective Date:</strong> January 1, 2026
                                </p>
                                <p>
                                    At <strong>InsightStock</strong>, we value your privacy. This policy outlines how we handle your data.
                                    We do not sell your personal information to third parties.
                                </p>

                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-base">1. Data Collection</h4>
                                    <p>
                                        We collect minimal data necessary for operations, including your name, email (if provided),
                                        and usage data to improve our AI models.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-base">2. AI Analysis Data</h4>
                                    <p>
                                        Financial data submitted for analysis is processed temporarily by our AI agents and is not stored permanently
                                        unless explicitly saved by you (e.g., in Feedback).
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-base">3. Security</h4>
                                    <p>
                                        We use industry-standard encryption (TLS/SSL) to protect your connection. Access to databases is restricted
                                        to authorized personnel only.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-base">4. Contact</h4>
                                    <p>
                                        If you have questions, reach out to us at <span className="text-neon-blue">privacy@stockai.terminal</span>.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-800 bg-[#0a0c10] flex justify-end">
                                <button
                                    onClick={() => setShowPrivacy(false)}
                                    className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* About Us Modal */}
            <AnimatePresence>
                {showAbout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowAbout(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#13161b] border border-gray-700/50 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0c10]">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-neon-blue" />
                                    About InsightStock
                                </h3>
                                <button
                                    onClick={() => setShowAbout(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="space-y-8">
                                    {/* Mission */}
                                    <section>
                                        <h4 className="text-2xl font-bold text-white mb-4">Democratizing Institutional Intelligence</h4>
                                        <p className="text-gray-400 leading-relaxed text-lg">
                                            InsightStock was born from a simple frustration: retail investors are always the last to know. While hedge funds
                                            use million-dollar algorithms to trade on news before it hits the wire, individual traders are left reading
                                            yesterday's headlines. <br /><br />
                                            We are changing that. By leveraging advanced Large Language Models (LLMs) and real-time market data,
                                            we provide the same level of deep analysis that was once reserved for Wall Street's elite.
                                        </p>
                                    </section>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                                            <div className="text-3xl font-bold text-neon-blue mb-1">24/7</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Market Watch</div>
                                        </div>
                                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                                            <div className="text-3xl font-bold text-neon-purple mb-1">100k+</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Data Points/Sec</div>
                                        </div>
                                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                                            <div className="text-3xl font-bold text-green-400 mb-1">AI</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Driven Analysis</div>
                                        </div>
                                    </div>

                                    {/* The Tech */}
                                    <section>
                                        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Cpu className="w-5 h-5 text-neon-purple" />
                                            Our Technology
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            Our platform runs on a proprietary blend of agentic workflows. We don't just "summarize" news;
                                            our agents actively <strong>debate</strong> market direction, <strong>backtest</strong> strategies against historical data,
                                            and <strong>simulate</strong> future scenarios to give you a weighted probability of success.
                                        </p>
                                    </section>
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="p-6 border-t border-gray-800 bg-[#0a0c10]">
                                <button
                                    onClick={() => {
                                        setShowAbout(false);
                                        navigate('/dashboard');
                                    }}
                                    className="w-full py-3 bg-neon-blue text-black font-bold rounded-lg hover:bg-[#33cfff] transition-all"
                                >
                                    Start Analyzing Now
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;
