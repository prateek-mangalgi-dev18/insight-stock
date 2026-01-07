import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import StockSearch from '../components/Search';
import Dashboard from '../components/Dashboard';
import Loading from '../components/Loading';
import Backtest from '../components/Backtest';
import Heatmap from '../components/Heatmap';
import MarketOverview from '../components/MarketOverview';
import { Activity, BarChart2, Grid, Globe } from 'lucide-react';

const DashboardPage = () => {
    const [currentView, setCurrentView] = useState("analysis"); // analysis, backtest, heatmap
    const [currentSymbol, setCurrentSymbol] = useState(null);
    const [period, setPeriod] = useState("6mo");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (symbol, timePeriod) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:8001/api/analyze', {
                symbol: symbol,
                period: timePeriod
            });
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to fetch stock data. Check the ticker or try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (symbol) => {
        setCurrentSymbol(symbol);
        setPeriod("6mo");
        setData(null);
        if (currentView !== 'analysis') {
            setCurrentView('analysis');
        }
        fetchData(symbol, "6mo");
    };

    const handlePeriodChange = (newPeriod) => {
        if (!currentSymbol) return;
        setPeriod(newPeriod);
        fetchData(currentSymbol, newPeriod);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-gray-100 selection:bg-neon-blue selection:text-black relative">
            {/* Top Left Branding */}
            <div className="absolute top-6 left-6 z-50 flex items-center space-x-6">
                <Link to="/" className="text-2xl font-bold font-mono tracking-tighter flex items-center space-x-2 group cursor-pointer no-underline">
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-md flex items-center justify-center group-hover:opacity-80 transition-opacity">
                        <Activity className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-white group-hover:text-neon-blue transition-colors">Insight<span className="text-neon-blue">Stock</span></span>
                </Link>
            </div>

            {/* Background Grid Effect */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <header className="text-center mb-12 pt-32">
                    <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mb-4 h-20 flex items-center justify-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple inline-block align-bottom pb-2">
                            Analyze Stocks with InsightStock
                        </span>
                    </h1>
                    <p className="text-gray-500 font-mono text-sm tracking-widest mb-2">ADVANCED MARKET INTELLIGENCE SYSTEM</p>
                    <p className="text-xs text-gray-600 max-w-lg mx-auto border-t border-gray-800 pt-2 mt-4">
                        <span className="text-red-400 font-bold">Disclaimer:</span> Content is for educational purposes only. Not financial advice.
                    </p>
                </header>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#13161b] p-1 rounded-full border border-gray-800 flex space-x-1">
                        <button
                            onClick={() => setCurrentView('analysis')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'analysis' ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="flex items-center space-x-2">
                                <Activity className="w-4 h-4" />
                                <span>Analysis</span>
                            </span>
                        </button>
                        <button
                            onClick={() => setCurrentView('backtest')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'backtest' ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="flex items-center space-x-2">
                                <BarChart2 className="w-4 h-4" />
                                <span>Backtest</span>
                            </span>
                        </button>
                        <button
                            onClick={() => setCurrentView('heatmap')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'heatmap' ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="flex items-center space-x-2">
                                <Grid className="w-4 h-4" />
                                <span>Heatmap</span>
                            </span>
                        </button>
                        <button
                            onClick={() => setCurrentView('market')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'market' ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="flex items-center space-x-2">
                                <Globe className="w-4 h-4" />
                                <span>Market</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Render Views */}
                {currentView === 'analysis' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <StockSearch onSearch={handleSearch} />

                        {loading && <Loading />}

                        {error && (
                            <div className="max-w-xl mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-center font-mono">
                                {error}
                            </div>
                        )}

                        {data && <Dashboard data={data} period={period} onPeriodChange={handlePeriodChange} />}
                    </div>
                )}

                {currentView === 'backtest' && (
                    <div className="animate-in fade-in duration-500">
                        <Backtest />
                    </div>
                )}

                {currentView === 'heatmap' && (
                    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
                        <Heatmap />
                    </div>
                )}

                {currentView === 'market' && (
                    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
                        <MarketOverview />
                    </div>
                )}

                <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-600 text-sm pb-8">
                    <p>© {new Date().getFullYear()} InsightStock. All rights reserved.</p>
                    <p className="mt-2 text-xs text-gray-700">Content is for educational purposes only. Not financial advice.</p>
                </footer>
            </div>
        </div>
    );
};

export default DashboardPage;
