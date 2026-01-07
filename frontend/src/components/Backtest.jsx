import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Play, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const Backtest = () => {
    const [symbol, setSymbol] = useState("AAPL");
    const [strategy, setStrategy] = useState("SMA_Crossover");
    const [period, setPeriod] = useState("1y");
    const [initialCapital, setInitialCapital] = useState(10000);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSymbol(value);

        if (value.length > 1) {
            try {
                const response = await axios.get(`http://localhost:8001/api/search?q=${value}`);
                setSuggestions(response.data.results || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (selectedSymbol) => {
        setSymbol(selectedSymbol);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const runBacktest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post('http://localhost:8001/api/backtest', {
                symbol: symbol.toUpperCase(),
                strategy,
                period,
                initial_capital: parseFloat(initialCapital)
            });
            setResult(response.data);
        } catch (err) {
            console.error("Backtest error:", err);
            setError(err.response?.data?.detail || "Backtest failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full p-4 space-y-6">
            <h2 className="text-2xl font-bold font-mono tracking-tighter text-white mb-6">Strategy Backtester</h2>

            {/* Config Form */}
            <form onSubmit={runBacktest} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-[#13161b] p-6 rounded-xl border border-gray-800">
                <div className="relative">
                    <label className="block text-xs text-gray-400 mb-1">Ticker</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={handleSearchChange}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => symbol.length > 1 && setShowSuggestions(true)}
                        className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute w-full mt-1 bg-black border border-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                            {suggestions.map((s) => (
                                <div
                                    key={s.symbol}
                                    onClick={() => handleSelect(s.symbol)}
                                    className="px-4 py-2 hover:bg-gray-900 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-900 last:border-0"
                                >
                                    <span className="font-bold text-neon-blue text-sm">{s.symbol}</span>
                                    <span className="text-gray-400 text-xs truncate ml-2">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Strategy</label>
                    <select
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                    >
                        <option value="SMA_Crossover">SMA Crossover (20/50)</option>
                        <option value="RSI">RSI Strategy (14)</option>
                        <option value="MACD">MACD Crossover</option>
                        <option value="Bollinger_Bands">Bollinger Bands</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Period</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                    >
                        <option value="6mo">6 Months</option>
                        <option value="1y">1 Year</option>
                        <option value="2y">2 Years</option>
                        <option value="5y">5 Years</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Initial Capital</label>
                    <input
                        type="number"
                        value={initialCapital}
                        onChange={(e) => setInitialCapital(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neon-blue text-black font-bold py-2 rounded hover:bg-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {loading ? <span>Simulating...</span> : <><Play className="w-4 h-4 ml-1" /> <span>Run Backtest</span></>}
                    </button>
                </div>
            </form>

            {/* Results Area */}
            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#13161b] rounded-xl border border-gray-800">
                            <div className="text-gray-500 text-xs uppercase">Total Return</div>
                            <div className={`text-2xl font-bold flex items-center ${result.total_return_pct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {result.total_return_pct >= 0 ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
                                {result.total_return_pct}%
                            </div>
                        </div>
                        <div className="p-4 bg-[#13161b] rounded-xl border border-gray-800">
                            <div className="text-gray-500 text-xs uppercase">Final Equity</div>
                            <div className="text-2xl font-bold text-white">
                                {(symbol.toLowerCase().endsWith('.ns') || symbol.toLowerCase().endsWith('.bo') ? "₹" : "$")}{result.final_equity.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Starting: {(symbol.toLowerCase().endsWith('.ns') || symbol.toLowerCase().endsWith('.bo') ? "₹" : "$")}{result.initial_capital.toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-[#13161b] rounded-xl border border-gray-800">
                            <div className="text-gray-500 text-xs uppercase">Max Drawdown</div>
                            <div className="text-2xl font-bold text-red-400">
                                {result.max_drawdown_pct}%
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis */}
                    {result.ai_analysis && (
                        <div className="p-6 bg-gradient-to-r from-neon-purple/10 to-indigo-900/20 rounded-xl border border-neon-purple/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-[40px]"></div>
                            <h3 className="text-sm font-bold text-neon-purple uppercase tracking-wider mb-2 flex items-center">
                                <span className="w-2 h-2 bg-neon-purple rounded-full mr-2 animate-pulse"></span>
                                AI Strategy Assessment
                            </h3>
                            <p className="text-gray-300 font-sans leading-relaxed text-sm md:text-base relative z-10 text-justify whitespace-pre-line">
                                {result.ai_analysis.replace(/\*\*/g, '')}
                            </p>
                        </div>
                    )}

                    {/* Chart */}
                    <div className="bg-[#13161b] rounded-xl border border-gray-800 p-6 h-[500px]">
                        <h3 className="text-lg font-bold text-white mb-4">Performance: Equity vs Stock Price</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.equity_curve}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#666"
                                    fontSize={12}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString()}
                                />
                                <YAxis
                                    yAxisId="left"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                    tickFormatter={(val) => `${(symbol.toLowerCase().endsWith('.ns') || symbol.toLowerCase().endsWith('.bo') ? "₹" : "$")}${val}`}
                                    label={{ value: 'Stock Price', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#00f3ff"
                                    fontSize={12}
                                    tickFormatter={(val) => `${(symbol.toLowerCase().endsWith('.ns') || symbol.toLowerCase().endsWith('.bo') ? "₹" : "$")}${val.toFixed(0)}`}
                                    domain={['dataMin - 100', 'dataMax + 100']}
                                    label={{ value: 'Portfolio Equity', angle: 90, position: 'insideRight', fill: '#00f3ff' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#000", borderColor: "#333" }}
                                    formatter={(value, dataKey) => {
                                        if (dataKey === "close") {
                                        return [`₹${value.toFixed(2)}`, "Stock Price"];
                                        }
                                        if (dataKey === "equity") {
                                        return [`₹${value.toFixed(2)}`, "Portfolio Equity"];
                                        }
                                        if (dataKey === "equity_pct") {
                                        return [`${value.toFixed(2)}%`, "Portfolio Equity (%)"];
                                        }
                                        return [value, dataKey];
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="close"
                                    name="Stock Price"
                                    stroke="#9ca3af"
                                    strokeWidth={1}
                                    dot={false}
                                    opacity={0.5}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="equity"
                                    name="Portfolio Equity"
                                    stroke="#00f3ff"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Backtest;
