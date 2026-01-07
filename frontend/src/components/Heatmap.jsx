import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { RefreshCcw, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Heatmap = () => {
    const [marketData, setMarketData] = useState({ indian: [], global: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHeatmap = async () => {
        setLoading(true);
        setError(null);
        try {
            // Adjust port if your backend runs on a different port in prod
            const response = await axios.get('http://localhost:8001/api/heatmap');
            // Backend returns { data: { indian: [], global: [] } }
            setMarketData(response.data.data);
        } catch (err) {
            console.error("Heatmap fetch error:", err);
            setError("Failed to load market data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeatmap();
    }, []);

    // Helper to determine block size/color
    // For now, equal size grid.
    // Color intensity based on magnitude.
    const getColor = (change) => {
        if (change > 0) {
            // Green scale
            if (change > 3) return "bg-green-500";
            if (change > 1) return "bg-green-600";
            return "bg-green-700/80";
        } else if (change < 0) {
            // Red scale
            if (change < -3) return "bg-red-500";
            if (change < -1) return "bg-red-600";
            return "bg-red-700/80";
        } else {
            return "bg-gray-600";
        }
    };

    const renderGrid = (stocks, title) => (
        <div className="flex-1 min-w-[300px]">
            <h3 className="text-xl font-bold text-white mb-4 pl-1 border-l-4 border-neon-blue">{title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {stocks.map((stock) => (
                    <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${getColor(stock.change_percent)} aspect-square rounded-lg p-3 flex flex-col justify-between hover:scale-105 transition-transform cursor-default relative overflow-hidden group`}
                    >
                        <div className="flex justify-between items-start z-10">
                            <span className="font-bold text-white text-xs md:text-sm truncate w-full">{stock.symbol}</span>
                        </div>

                        <div className="z-10">
                            <div className="text-[10px] text-white/80 font-mono">
                                {title.includes("Indian") ? "₹" : "$"}{stock.price.toFixed(2)}
                            </div>
                            <div className="flex items-center text-xs font-bold text-white">
                                {stock.change_percent > 0 ? (
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                ) : (
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                )}
                                {Math.abs(stock.change_percent)}%
                            </div>
                        </div>
                        {/* Flash effect on hover */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </motion.div>
                ))}
            </div>
            {stocks.length === 0 && !loading && (
                <div className="text-gray-500 text-sm mt-4">No data available.</div>
            )}
        </div>
    );

    return (
        <div className="w-full h-full p-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-mono tracking-tighter text-white">Market Heatmap</h2>
                <button
                    onClick={fetchHeatmap}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    title="Refresh"
                >
                    <RefreshCcw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading && (!marketData.indian.length && !marketData.global.length) ? (
                <div className="text-center text-gray-500 py-20">Loading market data...</div>
            ) : error ? (
                <div className="text-center text-red-400 py-20">{error}</div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {renderGrid(marketData.indian, "🇮🇳 Indian Market")}
                    <div className="hidden lg:block w-px bg-gray-800"></div>
                    {renderGrid(marketData.global, "🌎 Global Market")}
                </div>
            )}
        </div>
    );
};

export default Heatmap;
