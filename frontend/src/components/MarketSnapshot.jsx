import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';

const MarketSnapshot = () => {
    const [activeTab, setActiveTab] = useState('gainers');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchSnapshot = async () => {
            try {
                const response = await axios.get('http://localhost:8001/api/market/snapshot');
                if (response.data && response.data.data) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch market snapshot", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSnapshot();
        const interval = setInterval(fetchSnapshot, 60000);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: 'gainers', label: 'Gainers', icon: TrendingUp, color: 'text-green-400' },
        { id: 'losers', label: 'Losers', icon: TrendingDown, color: 'text-red-400' },
        { id: 'active_volume', label: 'Most Active (Vol)', icon: Activity, color: 'text-blue-400' },
        { id: 'active_value', label: 'Most Active (Val)', icon: BarChart2, color: 'text-purple-400' }
    ];

    const renderList = (items) => {
        if (!items || items.length === 0) return <div className="text-gray-500 text-center py-4">No data available</div>;

        // Toggle between 5 items and full list based on expanded state
        const displayItems = expanded ? items : items.slice(0, 5);

        return (
            <div className="space-y-3">
                {displayItems.map((item, idx) => (
                    <motion.div
                        key={item.symbol}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${idx < 3 ? 'bg-neon-blue/20 text-neon-blue' : 'bg-gray-800 text-gray-500'}`}>
                                {idx + 1}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-white">{item.symbol}</div>
                                <div className="text-xs text-gray-400">₹{item.price}</div>
                            </div>
                        </div>
                        <div className={`text-sm font-mono font-bold ${item.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.change_percent > 0 ? '+' : ''}{item.change_percent}%
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#13161b] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
            <div className="p-4 border-b border-gray-800 bg-gray-900/30 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-neon-blue" />
                    <span>Market Snapshot</span>
                </h3>
                <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded">LIVE NSE</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-800/50 transition-colors relative ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}
                        title={tab.label}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.id === 'gainers' ? 'bg-green-400' : tab.id === 'losers' ? 'bg-red-400' : tab.id === 'active_volume' ? 'bg-blue-400' : 'bg-purple-400'}`}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Container - Fixed Height with Scroll if Expanded */}
            <div className={`p-4 transition-all duration-300 ease-in-out ${expanded ? 'h-[400px] overflow-y-auto custom-scrollbar' : 'h-[360px] overflow-hidden'}`}>
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderList(data?.[activeTab])}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <div className="p-3 border-t border-gray-800 bg-gray-900/30 text-center relative z-10">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-neon-blue hover:text-white transition-colors font-medium flex items-center justify-center w-full focus:outline-none"
                >
                    {expanded ? 'Show Less ↑' : 'View Full Market Data ↓'}
                </button>
            </div>
        </div>
    );
};

export default MarketSnapshot;
