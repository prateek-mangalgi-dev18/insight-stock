import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCcw, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MarketOverview = () => {
    const [indices, setIndices] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const indicesRes = await axios.get('http://localhost:8001/api/market/indices');
            const sectorsRes = await axios.get('http://localhost:8001/api/market/sectors');

            setIndices(indicesRes.data.data);
            setSectors(sectorsRes.data.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch market data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full h-full p-4 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono tracking-tighter text-white">Market Overview</h2>
                <button
                    onClick={fetchData}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                    <RefreshCcw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading && indices.length === 0 ? (
                <div className="text-center text-gray-500 py-12">Loading market pulse...</div>
            ) : error ? (
                <div className="text-center text-red-400 py-12">{error}</div>
            ) : (
                <>
                    {/* Indices Cards */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-neon-blue" />
                            Global Indices
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {indices.map((idx) => (
                                <motion.div
                                    key={idx.symbol}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-[#13161b] rounded-xl border border-gray-800 relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 -mr-5 -mt-5 ${idx.change_percent >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>

                                    <h4 className="text-gray-400 text-sm font-mono mb-1">{idx.name || idx.symbol}</h4>
                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl font-bold text-white">
                                            {idx.price.toLocaleString()}
                                        </div>
                                        <div className={`flex items-center text-sm font-bold ${idx.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {idx.change_percent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                            {Math.abs(idx.change_percent)}%
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sector Performance */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center">
                            <PieChart className="w-5 h-5 mr-2 text-neon-purple" />
                            Sector Performance (Intraday)
                        </h3>
                        <div className="h-[400px] bg-[#13161b] rounded-xl border border-gray-800 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sectors} layout="vertical" margin={{ left: 40, right: 40, top: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={120}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                        formatter={(val) => [`${val}%`, 'Change']}
                                    />
                                    <Bar dataKey="change_percent" barSize={20} radius={[0, 4, 4, 0]}>
                                        {sectors.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.change_percent >= 0 ? '#4ade80' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketOverview;
