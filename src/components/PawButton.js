"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PawIcon = ({ className, ...props }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 8.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 3.5 12 3.5s2.5 1.12 2.5 2.5S13.38 8.5 12 8.5zm-5 2c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm10 0c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm-5 10c-3.5 0-6-2.5-6-5.5 0-1.5 1-3.5 3-4.5.8-.4 1.5-.5 2.5-.5h1c1 0 1.7.1 2.5.5 2 1 3 3 3 4.5 0 3-2.5 5.5-6 5.5z" />
    </svg>
);

export default function PawButton({
    children,
    href,
    className = "",
    variant = "primary",
    onClick,
    ...props
}) {
    const buttonRef = useRef(null);
    const [paws, setPaws] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = (e) => {
        if (!buttonRef.current) return;
        setIsHovered(true);
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Cria a patinha gigante que expande a partir do mouse
        const newPaw = { id: Date.now(), x, y };
        setPaws([newPaw]);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setPaws([]);
    };

    const baseClasses = "group relative overflow-hidden rounded-full font-bold transition-all duration-300 active:scale-95 flex items-center justify-center isolate outline-none";

    let colorClasses = "";
    let pawColor = "";
    if (variant === "primary") {
        colorClasses = "bg-[#52B56A] text-white shadow-[0_4px_14px_0_rgba(82,181,106,0.39)] hover:shadow-[0_6px_20px_rgba(82,181,106,0.3)] hover:-translate-y-0.5";
        pawColor = "text-black opacity-[0.14]";
    } else if (variant === "white") {
        colorClasses = "bg-white text-gray-700 shadow-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5";
        pawColor = "text-black opacity-[0.05]";
    } else if (variant === "dark") {
        colorClasses = "bg-[#141414] text-white shadow-lg hover:shadow-[0_6px_20px_rgba(20,20,20,0.3)] border border-[#141414] hover:-translate-y-0.5";
        pawColor = "text-white opacity-[0.15]";
    } else if (variant === "purple") {
        colorClasses = "bg-[#a882dd] text-white shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] hover:-translate-y-0.5";
        pawColor = "text-black opacity-[0.14]";
    } else if (variant === "icon") {
        colorClasses = "bg-white text-[#52B56A] shadow-lg hover:shadow-[0_6px_20px_rgba(82,181,106,0.3)] hover:-translate-y-0.5";
        pawColor = "text-black opacity-[0.05]";
    } else if (variant === "icon-transparent") {
        colorClasses = "border border-white/50 text-white hover:border-white transition-all shadow-md backdrop-blur-sm bg-black/10 hover:bg-black/20 hover:-translate-y-0.5";
        pawColor = "text-white opacity-[0.2]";
    }

    const combinedClasses = `${baseClasses} ${colorClasses} ${className}`;

    const content = (
        <>
            <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none w-full h-full">{children}</span>

            {/* Ripple de Pata Gigante */}
            <AnimatePresence>
                {paws.map((paw) => (
                    <motion.div
                        key={paw.id}
                        initial={{ scale: 0, x: '-50%', y: '-50%', rotate: -30 }}
                        animate={{ scale: 20, x: '-50%', y: '-50%', rotate: 15 }}
                        exit={{ opacity: 0, scale: 22, transition: { duration: 0.5 } }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute z-0 pointer-events-none ${pawColor}`}
                        style={{ left: paw.x, top: paw.y }}
                    >
                        <PawIcon className="w-8 h-8 md:w-10 md:h-10" />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Mini Patinhas Andando */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 15, x: -15, rotate: -20, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 0], y: -30, x: 20, rotate: 20, scale: 1.2 }}
                            transition={{ duration: 1.5, delay: 0.1, repeat: Infinity, repeatDelay: 0.5 }}
                            className={`absolute top-[40%] left-[10%] ${pawColor}`}
                        >
                            <PawIcon className="w-5 h-5" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 15, x: 15, rotate: 20, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 0], y: -30, x: -20, rotate: -20, scale: 1.2 }}
                            transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
                            className={`absolute bottom-[30%] right-[10%] ${pawColor}`}
                        >
                            <PawIcon className="w-6 h-6" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    if (href) {
        return (
            <Link href={href} ref={buttonRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onClick} className={combinedClasses} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button ref={buttonRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onClick} className={combinedClasses} {...props}>
            {content}
        </button>
    );
}
