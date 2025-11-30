import React, { useState } from 'react';

const ReviewForm = ({ onSubmit, initialGameName = '' }) => {
    const [formData, setFormData] = useState({
        gameName: initialGameName,
        reviewerName: '',
        rating: 5,
        reviewText: '',
        tags: []
    });

    const AVAILABLE_TAGS = [
        'Story', 'Gameplay', 'Graphics', 'Performance', 'Sound', 'Multiplayer'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tag) => {
        setFormData(prev => {
            const tags = prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form but keep game name if it was pre-filled
        setFormData({
            gameName: initialGameName || '',
            reviewerName: '',
            rating: 5,
            reviewText: '',
            tags: []
        });
    };

    return (
        <div className="w-full h-full p-6 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 font-orbitron tracking-wider relative z-10">
                Submit Analysis
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                {/* Game Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold">Target System (Game)</label>
                    <input
                        type="text"
                        name="gameName"
                        value={formData.gameName}
                        onChange={handleChange}
                        placeholder="Enter game title..."
                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
                        required
                    />
                </div>

                {/* Reviewer & Rating Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold">Agent Name</label>
                        <input
                            type="text"
                            name="reviewerName"
                            value={formData.reviewerName}
                            onChange={handleChange}
                            placeholder="Codename..."
                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold">Rating Level</label>
                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-cyan-100 focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                            <option value="4">⭐⭐⭐⭐ (4)</option>
                            <option value="3">⭐⭐⭐ (3)</option>
                            <option value="2">⭐⭐ (2)</option>
                            <option value="1">⭐ (1)</option>
                        </select>
                    </div>
                </div>

                {/* Tags Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold">Analysis Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all border ${formData.tags.includes(tag)
                                    ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold">Observation Log</label>
                    <textarea
                        name="reviewText"
                        value={formData.reviewText}
                        onChange={handleChange}
                        placeholder="Enter detailed analysis..."
                        rows="4"
                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all resize-none"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-0.5 transition-all duration-300 font-orbitron tracking-widest uppercase"
                >
                    Submit Data
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
