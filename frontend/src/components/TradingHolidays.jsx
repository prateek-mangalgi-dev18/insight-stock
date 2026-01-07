import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const TradingHolidays = () => {
    const holidays = [
        { date: "26th JAN", day: "MONDAY", name: "Republic Day" },
        { date: "03rd MAR", day: "TUESDAY", name: "Holi" },
        { date: "26th MAR", day: "THURSDAY", name: "Shri Ram Navami" },
        { date: "31st MAR", day: "TUESDAY", name: "Shri Mahavir Jayanti" },
        { date: "03rd APR", day: "FRIDAY", name: "Good Friday" },
        { date: "14th APR", day: "TUESDAY", name: "Dr. Baba Saheb Ambedkar Jayanti" },
        { date: "01st MAY", day: "FRIDAY", name: "Maharashtra Day" },
        { date: "28th MAY", day: "THURSDAY", name: "Bakri Id" },
        { date: "26th JUN", day: "FRIDAY", name: "Muharram" },
        { date: "14th SEP", day: "MONDAY", name: "Ganesh Chaturthi" },
        { date: "02nd OCT", day: "FRIDAY", name: "Mahatma Gandhi Jayanti" },
        { date: "20th OCT", day: "TUESDAY", name: "Dussehra" },
        { date: "10th NOV", day: "TUESDAY", name: "Diwali-Balipratipada" },
        { date: "24th NOV", day: "TUESDAY", name: "Prakash Gurpurab Sri Guru Nanak Dev" },
        { date: "25th DEC", day: "FRIDAY", name: "Christmas" },
    ];

    return (
        <section className="py-20 px-6 bg-[#050505] border-t border-gray-900 overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 text-xs font-mono text-orange-400">
                        <Calendar className="w-3 h-3" />
                        <span>MARKET CALENDAR</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Trading Holidays <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">2026</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Plan your trading year ahead. Here is the list of holidays for Equity & Equity Derivatives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {holidays.map((holiday, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-[#13161b] border border-gray-800 rounded-xl p-5 flex items-center space-x-4 hover:border-orange-500/50 transition-colors group"
                        >
                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-900 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                <span className="text-[10px] font-bold text-orange-500 uppercase">{holiday.date.split(" ")[1]}</span>
                                <span className="text-xl font-bold text-white">{holiday.date.split(" ")[0].replace(/\D/g, '')}</span>
                                <span className="text-[8px] text-gray-500">{holiday.date.split(" ")[0].replace(/\d/g, '')}</span>
                            </div>

                            <div>
                                <div className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-1">
                                    {holiday.day}
                                </div>
                                <h4 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">
                                    {holiday.name}
                                </h4>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-gray-800 rounded-xl p-6 text-center">
                    <h4 className="text-lg font-bold text-white mb-2">Muhurat Trading</h4>
                    <p className="text-gray-400 text-sm">
                        Will be conducted on <span className="text-neon-blue font-bold">Sunday, November 08, 2026</span>.
                        <br />Timings shall be notified subsequently.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TradingHolidays;
