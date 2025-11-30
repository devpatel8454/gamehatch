import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = {
    'Positive': '#4ade80', // Green
    'Negative': '#ef4444', // Red
    'Mixed': '#facc15', // Yellow
    'Story': '#8b5cf6', // Purple
    'Gameplay': '#06b6d4', // Cyan
    'Graphics': '#f472b6', // Pink
    'Performance': '#f97316', // Orange
};

const ReviewAnalyticsChart = ({
    data = [
        { name: 'Positive', value: 35 },
        { name: 'Negative', value: 15 },
        { name: 'Mixed', value: 20 },
        { name: 'Story', value: 45 },
        { name: 'Gameplay', value: 60 },
        { name: 'Graphics', value: 50 },
        { name: 'Performance', value: 30 },
    ],
    title = "Live Vibe Check"
}) => {
    const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);

    // Calculate stroke dashes for SVG
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;
    const chartSegments = data.map((item) => {
        // For a "Vibe Chart", we might want to show relative strength rather than a pure part-of-whole pie
        // But for a doughnut visual, part-of-whole is standard. 
        // Let's normalize to 100% for the visual ring.
        const percentage = total > 0 ? item.value / total : 0;
        const strokeDasharray = `${percentage * circumference} ${circumference}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += percentage * circumference;

        return {
            ...item,
            color: COLORS[item.name] || '#9ca3af',
            strokeDasharray,
            strokeDashoffset,
            percentage: total > 0 ? Math.round(percentage * 100) : 0
        };
    });

    return (
        <div className="w-full h-full p-6 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col items-center relative overflow-hidden group">
            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-2xl border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors duration-500 pointer-events-none"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 font-orbitron tracking-wider z-10">
                {title}
            </h3>

            <div className="relative w-64 h-64 flex items-center justify-center z-10">
                {/* Background Circle */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke="#1e293b"
                        strokeWidth="16"
                    />
                </svg>

                {/* Chart Segments */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {chartSegments.map((segment, index) => (
                        <motion.circle
                            key={segment.name}
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth="16"
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.strokeDashoffset}
                            strokeLinecap="round"
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{ strokeDasharray: segment.strokeDasharray }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
                            className="drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
                        />
                    ))}
                </svg>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-bold text-white font-rajdhani drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {total}
                    </span>
                    <span className="text-xs text-cyan-300/70 uppercase tracking-[0.2em] mt-1">Insights</span>
                </div>
            </div>

            {/* Legend */}
            <div className="w-full mt-8 grid grid-cols-2 gap-x-4 gap-y-3 z-10">
                {chartSegments.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px]"
                                style={{ backgroundColor: segment.color, boxShadow: `0 0 8px ${segment.color}` }}
                            ></span>
                            <span className="text-sm text-slate-400 group-hover/item:text-cyan-200 transition-colors font-medium">
                                {segment.name}
                            </span>
                        </div>
                        <span className="text-sm font-bold font-mono" style={{ color: segment.color }}>
                            {segment.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewAnalyticsChart;
