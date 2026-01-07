import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Server, BarChart2, Activity } from 'lucide-react';

const Loading = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        "Connecting to Global Exchanges...",
        "Fetching Institutional Reports...",
        "Analyzing Historical Volatility...",
        "Running AI Predictive Models...",
        "Synthesizing Market Verdict..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    // Simulated Data Packets
    const packets = Array.from({ length: 6 });

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-[#0a0c10]">

            {/* Main Animation Container */}
            <div className="relative flex items-center justify-center space-x-12 mb-12 transform scale-110 sm:scale-125">

                {/* 1. Server Cluster (Data Source) */}
                <div className="flex flex-col space-y-2 relative">
                    <div className="absolute -top-6 left-0 text-xs font-mono text-neon-blue/50 flex items-center">
                        <Database className="w-3 h-3 mr-1" /> DATA
                    </div>
                    {[1, 2, 3].map((server) => (
                        <motion.div
                            key={`server-${server}`}
                            className="w-16 h-8 bg-[#13161b] border border-neon-blue/30 rounded flex items-center justify-around px-2 relative overflow-hidden"
                            animate={{
                                borderColor: ['rgba(0, 243, 255, 0.3)', 'rgba(0, 243, 255, 0.8)', 'rgba(0, 243, 255, 0.3)']
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: server * 0.2 }}
                        >
                            {/* Server Lights */}
                            {[1, 2, 3].map((light) => (
                                <motion.div
                                    key={`light-${light}`}
                                    className="w-2 h-2 rounded-full bg-neon-blue"
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() }}
                                />
                            ))}
                        </motion.div>
                    ))}
                </div>

                {/* 2. Data Transmission Flow */}
                <div className="absolute left-[80px] w-24 h-12 flex items-center overflow-hidden">
                    {packets.map((_, i) => (
                        <motion.div
                            key={`packet-${i}`}
                            className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 100, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.25
                            }}
                        />
                    ))}
                </div>

                {/* 3. Analytics Terminal (Processing) */}
                <div className="relative">
                    <div className="absolute -top-6 right-0 text-xs font-mono text-neon-purple/50 flex items-center justify-end">
                        AI CORE <Activity className="w-3 h-3 ml-1" />
                    </div>

                    {/* Screen Frame */}
                    <div className="w-40 h-32 bg-[#13161b] border border-neon-purple/30 rounded-lg p-2 relative shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                        {/* Header Bar */}
                        <div className="h-4 bg-gray-900 rounded-t flex items-center px-2 space-x-1 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        </div>

                        {/* Animated Chart Content */}
                        <div className="relative h-20 bg-black/40 rounded border border-gray-800 p-1 flex items-end justify-between overflow-hidden">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 opacity-10 pointer-events-none">
                                <div className="border-r border-gray-500"></div>
                                <div className="border-r border-gray-500"></div>
                                <div className="border-r border-gray-500"></div>
                                <div className="border-b border-gray-500 w-full absolute top-1/4"></div>
                                <div className="border-b border-gray-500 w-full absolute top-2/4"></div>
                                <div className="border-b border-gray-500 w-full absolute top-3/4"></div>
                            </div>

                            {/* Bars */}
                            {[40, 70, 50, 90, 60].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 bg-gradient-to-t from-neon-purple to-pink-500 rounded-t"
                                    initial={{ height: 0 }}
                                    animate={{ height: [`${h / 2}%`, `${h}%`, `${h / 2}%`] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}

                            {/* Line Path overlay */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                <motion.path
                                    d="M0 60 Q 20 50, 40 30 T 80 20 T 140 10"
                                    fill="none"
                                    stroke="#ec4899"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Reflection / Glow below */}
                    <div className="absolute -bottom-4 left-4 right-4 h-1 bg-neon-purple/50 blur-md rounded-[100%]"></div>
                </div>
            </div>

            {/* Status Text with Typing Cursor */}
            <div className="h-8 flex items-center justify-center">
                <span className="font-mono text-neon-blue text-sm tracking-wider">
                    {`> ${steps[currentStep]}`}
                </span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-4 bg-neon-blue ml-2"
                />
            </div>
        </div>
    );
};

export default Loading;
