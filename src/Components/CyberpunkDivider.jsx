import React from 'react';
import { motion } from 'framer-motion';

const CyberpunkDivider = () => {
    return (
        <div className="relative w-full h-24 flex items-center justify-center overflow-hidden my-8">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/10 to-transparent blur-xl"></div>

            {/* Main Container */}
            <div className="w-full max-w-6xl relative flex items-center px-4">

                {/* Left Line Segment */}
                <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-blue-500 relative">
                    {/* Moving Energy Particle Left */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-20 h-[2px] bg-cyan-400 blur-[1px]"
                        animate={{
                            x: ['-100%', '100%'],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1
                        }}
                    />
                </div>

                {/* Center Tech Element */}
                <div className="mx-6 relative flex items-center justify-center">
                    {/* Rotating Outer Ring */}
                    <motion.div
                        className="w-8 h-8 border border-cyan-500/30 rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-full h-full border-t-2 border-cyan-400 rounded-full opacity-80"></div>
                    </motion.div>

                    {/* Inner Diamond */}
                    <div className="absolute w-4 h-4 bg-gray-900 border border-purple-500 rotate-45 transform shadow-[0_0_15px_rgba(168,85,247,0.6)] z-10"></div>

                    {/* Pulse Effect */}
                    <motion.div
                        className="absolute w-4 h-4 bg-purple-500 rotate-45"
                        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* Right Line Segment */}
                <div className="flex-grow h-[1px] bg-gradient-to-l from-transparent via-purple-500/50 to-blue-500 relative">
                    {/* Moving Energy Particle Right */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-[2px] bg-purple-400 blur-[1px]"
                        animate={{
                            x: ['100%', '-100%'],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1.5
                        }}
                    />
                </div>

                {/* Decorative Circuit Nodes */}
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_4px_cyan]"></div>
                    <div className="w-12 h-[1px] bg-cyan-500/30"></div>
                </div>

                <div className="absolute right-[15%] top-1/2 -translate-y-1/2 flex flex-col gap-1 items-end">
                    <div className="w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_4px_purple]"></div>
                    <div className="w-12 h-[1px] bg-purple-500/30"></div>
                </div>

            </div>
        </div>
    );
};

export default CyberpunkDivider;
