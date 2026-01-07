import React from 'react';
import { TrendingUp, AlertTriangle, Newspaper, Activity, Shield, Clock, BarChart2, ArrowUpRight, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar } from 'recharts';
import Chart from 'react-apexcharts';
import axios from 'axios';

const Card = ({ children, className = "" }) => (
    <div className={`bg-[#13161b] border border-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ icon: Icon, title, className = "" }) => (
    <div className={`flex items-center space-x-3 mb-4 border-b border-gray-800 pb-3 ${className}`}>
        <Icon className="w-5 h-5 text-neon-blue" />
        <h2 className="text-sm font-bold font-sans tracking-wider text-gray-300 uppercase">{title}</h2>
    </div>
);

const formatText = (str) => {
    if (!str) return null;
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="font-bold text-white tracking-wide">{part.slice(2, -2)}</span>;
        }
        return part;
    });
};

const renderContent = (text, highlightColor = "text-gray-200") => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = (keyPrefix) => {
        if (currentList.length > 0) {
            elements.push(
                <ul key={`${keyPrefix}-list`} className="list-disc list-outside ml-5 space-y-2 mb-4">
                    {currentList.map((item, i) => (
                        <li key={i} className={`pl-1 marker:${highlightColor.replace('text-', 'text-')} text-gray-400 leading-relaxed`}>
                            {formatText(item)}
                        </li>
                    ))}
                </ul>
            );
            currentList = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.startsWith('- ')) {
            currentList.push(trimmed.substring(2));
        } else {
            flushList(index);
            if (trimmed.startsWith('## ')) {
                elements.push(
                    <h3 key={`header-${index}`} className={`text-base font-bold mt-6 mb-3 ${highlightColor}`}>
                        {trimmed.substring(3).replace(/\*\*/g, '')}
                    </h3>
                );
            } else {
                elements.push(
                    <p key={`p-${index}`} className="mb-3 text-gray-400 leading-7 font-sans">
                        {formatText(trimmed)}
                    </p>
                );
            }
        }
    });

    flushList("end");
    return elements;
};

const Dashboard = ({ data, period, onPeriodChange }) => {
    if (!data) return null;

    const { market_data, fundamentals, risk, news, summary, critique } = data;

    // Check for high/low/med risk for signal colors
    const isHighRisk = risk.risk_assessment.toLowerCase().includes("high");
    const isLowRisk = risk.risk_assessment.toLowerCase().includes("low");
    const riskColor = isHighRisk ? "text-signal-red" : isLowRisk ? "text-signal-emerald" : "text-signal-amber";
    const riskBorder = isHighRisk ? "border-signal-red/20" : isLowRisk ? "border-signal-emerald/20" : "border-signal-amber/20";

    // Determine Currency Symbol
    const isIndian = market_data.symbol.toLowerCase().endsWith('.ns') || market_data.symbol.toLowerCase().endsWith('.bo');
    const currencySymbol = isIndian ? "₹" : "$";

    const periods = [
        { label: '5D', value: '5d' },
        { label: '1M', value: '1mo' },
        { label: '6M', value: '6mo' },
        { label: '1Y', value: '1y' },
        { label: '5Y', value: '5y' },
    ];

    const handleDownloadPDF = async () => {
        try {
            // Pass the entire data object to avoid re-fetching on backend
            const response = await axios.post('http://localhost:8001/api/report/pdf', data, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${market_data.symbol}_Report.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download PDF report.");
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 pb-12 font-sans text-gray-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between py-6 border-b border-gray-800/50 mb-8">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white mb-2">
                        {market_data.name}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start space-x-4">
                        <span className="text-2xl text-neon-blue font-mono tracking-widest">{market_data.symbol}</span>
                        <span className="px-3 py-1 bg-gray-900 rounded text-xs text-gray-500 font-mono border border-gray-800">{market_data.exchange}</span>

                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center space-x-2 px-3 py-1 bg-neon-blue/10 text-neon-blue rounded hover:bg-neon-blue/20 transition-colors border border-neon-blue/20"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">PDF Report</span>
                        </button>
                    </div>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                    <div className="text-5xl font-bold text-white tracking-tight">{currencySymbol}{market_data.price.toFixed(2)}</div>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                        {market_data.is_market_open ? (
                            <span className="flex items-center text-signal-emerald text-sm font-bold bg-signal-emerald/10 px-2 py-0.5 rounded">
                                <Activity className="w-3 h-3 mr-1" /> LIVE MARKET
                            </span>
                        ) : (
                            <span className="flex items-center text-gray-400 text-sm font-bold bg-gray-800/30 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3 mr-1" /> MARKET CLOSED
                            </span>
                        )}
                        <span className="text-gray-500 text-xs font-mono">{new Date(market_data.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* 1. AI Summary & Stats (Left - 5 cols) */}
                <Card className="lg:col-span-5 flex flex-col h-[600px]">
                    <SectionHeader icon={TrendingUp} title="AI Executive Summary" />

                    {/* Key Stats Row */}
                    <div className="grid grid-cols-5 gap-2 mb-6 p-4 bg-black/40 rounded-lg border border-gray-800">
                        <div className="text-center">
                            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Open</div>
                            <div className="text-sm font-bold text-white">{currencySymbol}{market_data.ohlc.open.toFixed(1)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">High</div>
                            <div className="text-sm font-bold text-white">{currencySymbol}{market_data.ohlc.high.toFixed(1)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Low</div>
                            <div className="text-sm font-bold text-white">{currencySymbol}{market_data.ohlc.low.toFixed(1)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Vol</div>
                            <div className="text-sm font-bold text-white">{(market_data.ohlc.volume / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">P/E</div>
                            <div className="text-sm font-bold text-neon-blue">{market_data.peRatio ? market_data.peRatio.toFixed(2) : '-'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={`p-4 rounded-lg bg-black/20 border ${riskBorder}`}>
                            <div className="text-gray-500 text-xs font-mono uppercase mb-1">Risk Level</div>
                            <div className={`text-lg font-bold leading-tight ${riskColor}`}>
                                {risk.risk_assessment.split(':')[0]}
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/20 border border-gray-800">
                            <div className="text-gray-500 text-xs font-mono uppercase mb-1">Volatility</div>
                            <div className="text-lg font-bold text-neon-blue">{(risk.volatility * 100).toFixed(2)}%</div>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        <div className="prose prose-invert prose-sm max-w-none text-justify font-sans text-gray-400">
                            {renderContent(summary, "text-neon-blue")}
                        </div>
                    </div>
                </Card>

                {/* 2. Main Chart (Right - 7 cols) */}
                <Card className="lg:col-span-7 flex flex-col h-[600px] relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-gray-800 pb-4">
                        <div className="flex items-center space-x-2">
                            <BarChart2 className="w-5 h-5 text-neon-blue" />
                            <h2 className="text-sm font-bold font-sans tracking-wider text-gray-300 uppercase">Price Action</h2>
                        </div>
                        <div className="flex space-x-1 mt-2 sm:mt-0 bg-black/40 p-1 rounded-lg border border-gray-800">
                            {/* Ensure onPeriodChange is passed and functionality is hooked up */}
                            {periods.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => onPeriodChange && onPeriodChange(p.value)}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-all duration-200 ${period === p.value
                                        ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-grow w-full min-h-0 bg-[#0a0c10] rounded-lg border border-gray-800/50 relative">
                        <Chart
                            options={{
                                chart: {
                                    type: 'candlestick',
                                    height: '100%',
                                    background: 'transparent',
                                    toolbar: { show: false },
                                    animations: { enabled: false }
                                },
                                theme: { mode: 'dark' },
                                plotOptions: {
                                    candlestick: {
                                        colors: {
                                            upward: '#10b981', // Emerald Green
                                            downward: '#ef4444' // Red
                                        },
                                        wick: { useFillColor: true }
                                    }
                                },
                                xaxis: {
                                    type: 'datetime',
                                    tooltip: { enabled: true },
                                    axisBorder: { show: false },
                                    axisTicks: { show: false },
                                    labels: { style: { colors: '#9ca3af' } }
                                },
                                yaxis: {
                                    tooltip: { enabled: true },
                                    labels: {
                                        style: { colors: '#9ca3af' },
                                        formatter: (val) => `${currencySymbol}${val.toFixed(2)}`
                                    }
                                },
                                grid: {
                                    borderColor: '#333',
                                    strokeDashArray: 3
                                },
                                tooltip: { theme: 'dark' }
                            }}
                            series={[{
                                name: 'Price',
                                data: market_data.history.map(d => ({
                                    x: new Date(d.date),
                                    y: [d.open, d.high, d.low, d.close]
                                }))
                            }]}
                            type="candlestick"
                            width="100%"
                            height="100%"
                        />
                    </div>
                </Card>

                {/* 3. Fundamentals (Left Middle) */}
                <Card className="lg:col-span-6 h-[400px] flex flex-col">
                    <SectionHeader icon={Activity} title="Fundamental Analysis" />
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-sm text-gray-400 text-justify font-sans leading-7">
                            {renderContent(fundamentals.analysis, "text-neon-blue")}
                        </div>
                    </div>
                </Card>

                {/* 4. Critic's Take (Right Middle) */}
                <Card className="lg:col-span-6 h-[400px] flex flex-col bg-gradient-to-br from-[#13161b] to-indigo-950/10 border-indigo-500/10">
                    <SectionHeader icon={Shield} title="Critic's Assessment" className="border-indigo-500/20" />
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar border-l-2 border-neon-purple/30 pl-6 ml-1">
                        <div className="prose prose-invert prose-sm max-w-none text-justify font-sans text-gray-300 leading-8">
                            {renderContent(critique, "text-neon-purple")}
                        </div>
                    </div>
                </Card>

                {/* 5. Recent News (Bottom Full) */}
                <Card className="lg:col-span-12">
                    <SectionHeader icon={Newspaper} title="Recent Market Intelligence" />
                    {news.news.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <Activity className="w-8 h-8 mb-2 opacity-50 animate-pulse" />
                            <p>Fetching latest market news...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {news.news.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block p-5 rounded-lg bg-black/20 hover:bg-black/40 border border-gray-800 hover:border-neon-blue/30 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="text-xs text-neon-blue mb-2 font-mono truncate max-w-[200px]">
                                                {(() => {
                                                    try { return new URL(item.link).hostname.replace('www.', ''); }
                                                    catch { return item.link; }
                                                })()}
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-200 group-hover:text-neon-blue transition-colors line-clamp-2 leading-snug">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-neon-blue opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 -translate-y-1" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default Dashboard;
