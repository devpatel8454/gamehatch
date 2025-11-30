import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { exportWishlistToPDF, exportWishlistToWord } from '../../utils/wishlistExport';

const WishlistExport = ({ wishlist }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState(null);

    const exportToPDF = async () => {
        setIsExporting(true);
        setExportFormat('pdf');

        try {
            exportWishlistToPDF(wishlist);
            toast.success('📄 Wishlist exported as PDF successfully!');
        } catch (error) {
            toast.error('❌ Failed to export PDF');
            console.error('PDF export error:', error);
        } finally {
            setIsExporting(false);
            setExportFormat(null);
        }
    };

    const exportToWord = async () => {
        setIsExporting(true);
        setExportFormat('docx');

        try {
            await exportWishlistToWord(wishlist);
            toast.success('📝 Wishlist exported as Word document successfully!');
        } catch (error) {
            toast.error('❌ Failed to export Word document');
            console.error('Word export error:', error);
        } finally {
            setIsExporting(false);
            setExportFormat(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0a0e27] via-[#0f172a] to-[#0a0e27] border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)]"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Label Section */}
                <div className="flex items-center space-x-3">
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <FaDownload className="text-3xl text-cyan-400" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-orbitron">
                            Download Your Wishlist
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Export your {wishlist.length} saved {wishlist.length === 1 ? 'game' : 'games'} as a document
                        </p>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex flex-wrap gap-4">
                    {/* PDF Export Button */}
                    <motion.button
                        onClick={exportToPDF}
                        disabled={isExporting || wishlist.length === 0}
                        className={`
              group relative px-6 py-3 rounded-lg font-medium transition-all duration-300
              flex items-center space-x-3 overflow-hidden
              ${wishlist.length === 0
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]'
                            }
              ${isExporting && exportFormat === 'pdf' ? 'animate-pulse' : ''}
            `}
                        whileHover={wishlist.length > 0 ? { scale: 1.05 } : {}}
                        whileTap={wishlist.length > 0 ? { scale: 0.95 } : {}}
                    >
                        {/* Animated Background */}
                        {wishlist.length > 0 && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        )}

                        <FaFilePdf className="text-xl relative z-10" />
                        <span className="relative z-10 font-rajdhani">
                            {isExporting && exportFormat === 'pdf' ? 'Exporting...' : 'Export as PDF'}
                        </span>

                        {isExporting && exportFormat === 'pdf' && (
                            <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full relative z-10"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                    </motion.button>

                    {/* Word Export Button */}
                    <motion.button
                        onClick={exportToWord}
                        disabled={isExporting || wishlist.length === 0}
                        className={`
              group relative px-6 py-3 rounded-lg font-medium transition-all duration-300
              flex items-center space-x-3 overflow-hidden
              ${wishlist.length === 0
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]'
                            }
              ${isExporting && exportFormat === 'docx' ? 'animate-pulse' : ''}
            `}
                        whileHover={wishlist.length > 0 ? { scale: 1.05 } : {}}
                        whileTap={wishlist.length > 0 ? { scale: 0.95 } : {}}
                    >
                        {/* Animated Background */}
                        {wishlist.length > 0 && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: 0.5
                                }}
                            />
                        )}

                        <FaFileWord className="text-xl relative z-10" />
                        <span className="relative z-10 font-rajdhani">
                            {isExporting && exportFormat === 'docx' ? 'Exporting...' : 'Export as Word'}
                        </span>

                        {isExporting && exportFormat === 'docx' && (
                            <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full relative z-10"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Decorative Bottom Line */}
            <motion.div
                className="mt-4 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    );
};

export default WishlistExport;
