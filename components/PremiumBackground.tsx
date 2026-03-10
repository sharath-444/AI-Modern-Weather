
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherTheme } from '../types';

interface Props {
    theme: WeatherTheme;
}

export const PremiumBackground: React.FC<Props> = ({ theme }) => {
    // AI Particles (Neural nodes / Data points)
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 20 + Math.random() * 30,
        delay: -Math.random() * 30,
    }));

    const renderWeatherOverlay = () => {
        switch (theme) {
            case WeatherTheme.RAIN:
                return (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        {Array.from({ length: 80 }).map((_, i) => (
                            <motion.div
                                key={`rain-${i}`}
                                initial={{ y: -100, x: `${Math.random() * 120 - 10}%`, opacity: 0 }}
                                animate={{ y: '110vh', opacity: [0, 0.4, 0] }}
                                transition={{
                                    duration: 0.5 + Math.random() * 0.3,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: Math.random() * 2
                                }}
                                className="absolute w-[1px] h-16 bg-cyan-300/40 blur-[0.2px] rotate-12"
                            />
                        ))}
                    </div>
                );
            case WeatherTheme.STORM:
                return (
                    <>
                        <motion.div
                            animate={{ opacity: [0, 0, 0.6, 0, 0.4, 0, 0, 0] }}
                            transition={{ duration: 6, repeat: Infinity, times: [0, 0.7, 0.71, 0.72, 0.85, 0.86, 0.9, 1] }}
                            className="absolute inset-0 bg-white/5 z-30 pointer-events-none"
                        />
                        {/* Rapid Wind Streaks */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={`wind-${i}`}
                                initial={{ x: -300, y: `${Math.random() * 100}%`, opacity: 0 }}
                                animate={{ x: '110vw', opacity: [0, 0.3, 0] }}
                                transition={{
                                    duration: 1.5 + Math.random(),
                                    repeat: Infinity,
                                    ease: "easeIn",
                                    delay: Math.random() * 8
                                }}
                                className="absolute w-80 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent z-10 pointer-events-none"
                            />
                        ))}
                    </>
                );
            case WeatherTheme.SNOW:
                return (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        {Array.from({ length: 60 }).map((_, i) => (
                            <motion.div
                                key={`snow-${i}`}
                                initial={{ y: -50, x: `${Math.random() * 100}%`, opacity: 0 }}
                                animate={{
                                    y: '110vh',
                                    x: [`${Math.random() * 100}%`, `${(Math.random() * 100) + (Math.random() * 10 - 5)}%`],
                                    opacity: [0, 0.8, 0],
                                    rotate: 360
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 4,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: Math.random() * 10
                                }}
                                className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1.5px]"
                            />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
            {/* 1. Base Aurora Layer (Navy / Deep Blue) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c1b3d] via-[#020617] to-[#1e1b4b]" />

            {/* 2. Primary Aurora Flow (Cyan / Teal) */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.25, 0.1],
                    x: ['-50%', '-30%', '-50%'],
                    skewX: [10, 20, 10],
                    scaleY: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-50%] w-[200%] h-[120%] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-[120px] origin-center"
            />

            {/* 3. Secondary Aurora Flow (Purple / Electric Blue) */}
            <motion.div
                animate={{
                    opacity: [0.05, 0.2, 0.05],
                    x: ['20%', '0%', '20%'],
                    skewX: [-15, -5, -15],
                    scaleY: [1.1, 0.9, 1.1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-20%] right-[-50%] w-[180%] h-[100%] bg-gradient-to-r from-transparent via-purple-600/10 to-transparent blur-[140px] origin-center"
            />

            {/* 4. Drifting Clouds (Horizontal Parallax) */}
            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={`cloud-${i}`}
                    initial={{ x: -1000, y: `${10 + i * 18}%` }}
                    animate={{ x: '110vw' }}
                    transition={{
                        duration: 50 + Math.random() * 60,
                        repeat: Infinity,
                        ease: "linear",
                        delay: -Math.random() * 100
                    }}
                    className="absolute w-[800px] h-[350px] bg-white/[0.03] rounded-full blur-[90px] z-5"
                />
            ))}

            {/* 5. AI Data Particles (Neural Points) */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0.2 }}
                    animate={{
                        x: [`${p.x}%`, `${(p.x + 3) % 100}%`, `${p.x}%`],
                        y: [`${p.y}%`, `${(p.y + 3) % 100}%`, `${p.y}%`],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
                    className="absolute bg-cyan-400 rounded-full z-15"
                    style={{ width: p.size, height: p.size, boxShadow: '0 0 8px rgba(34, 211, 238, 0.4)' }}
                />
            ))}

            {/* 6. Atmospheric Glow & Depth Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 z-25" />
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)] z-25" />

            {/* 7. Dynamic Weather Layer */}
            <AnimatePresence>
                {renderWeatherOverlay()}
            </AnimatePresence>
        </div>
    );
};
