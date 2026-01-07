import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StockSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            try {
                const response = await fetch(`http://localhost:8001/api/search?q=${value}`);
                const data = await response.json();
                setSuggestions(data.results || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (symbol) => {
        setQuery(symbol);
        setShowSuggestions(false);
        onSearch(symbol);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.toUpperCase());
            setShowSuggestions(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-12 relative z-50">
            <motion.form
                onSubmit={handleSubmit}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-neon-blue/50 transition-all duration-300 hover:bg-white/10">
                    <Search className="w-6 h-6 text-neon-blue ml-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => query.length > 1 && setShowSuggestions(true)}
                        placeholder="ENTER TICKER (e.g. RELIANCE.NS, AAPL)"
                        className="w-full bg-transparent text-white px-6 py-4 focus:outline-none font-sans tracking-wide placeholder-gray-500 text-lg"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-neon-blue/10 rounded-xl hover:bg-neon-blue hover:text-black text-neon-blue transition-all duration-300 mr-2"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </motion.form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-black border border-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                        <div
                            key={s.symbol}
                            onClick={() => handleSelect(s.symbol)}
                            className="px-4 py-3 hover:bg-gray-900 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-900 last:border-0"
                        >
                            <span className="font-bold text-neon-blue">{s.symbol}</span>
                            <span className="text-gray-400 text-sm">{s.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StockSearch;
