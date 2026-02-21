"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Github, Globe, X } from "lucide-react";

// ⚙️ Configure seus links aqui:
const GITHUB_URL = "https://github.com/BrayanAmarals";
const PORTFOLIO_URL = "https://brayan-portfolio.vercel.app/";

export default function DevDisclaimer() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-5 right-5 z-[999] flex flex-col items-end gap-2">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="max-w-[300px] bg-white border border-gray-100 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] p-5 relative"
                    >
                        {/* Botão fechar */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={12} />
                        </button>

                        {/* Ícone de aviso */}
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                            <Info size={20} className="text-amber-500" />
                        </div>

                        <h3 className="font-black text-[#141414] text-sm mb-2 leading-tight">
                            Aviso de Portfólio
                        </h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            Todos os dados exibidos neste site — incluindo a empresa <strong className="text-gray-700">Peti</strong>,
                            produtos, preços, avaliações e informações de contato —
                            são <strong className="text-gray-700">fictícios</strong> e foram
                            criados exclusivamente para fins de desenvolvimento de portfólio pessoal.
                        </p>

                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                Desenvolvido por
                            </p>
                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-xs font-bold text-gray-600 hover:text-[#a855f7] transition-colors group"
                            >
                                <div className="w-7 h-7 rounded-xl bg-gray-900 group-hover:bg-[#a855f7] flex items-center justify-center text-white transition-colors shrink-0">
                                    <Github size={14} />
                                </div>
                                GitHub — BrayanAmarals
                            </a>
                            <a
                                href={PORTFOLIO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-xs font-bold text-gray-600 hover:text-[#52B56A] transition-colors group"
                            >
                                <div className="w-7 h-7 rounded-xl bg-[#52B56A]/10 group-hover:bg-[#52B56A] flex items-center justify-center text-[#52B56A] group-hover:text-white transition-colors shrink-0">
                                    <Globe size={14} />
                                </div>
                                Portfólio Pessoal
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Botão flutuante com pulse */}
            <div className="relative flex items-center justify-center">
                {/* Anéis de pulse (só quando fechado) */}
                {!open && (
                    <>
                        <span className="absolute w-16 h-16 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />
                        <span className="absolute w-[52px] h-[52px] rounded-full bg-orange-400/20 animate-pulse pointer-events-none" />
                    </>
                )}

                <motion.button
                    onClick={() => setOpen((v) => !v)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    title="Aviso de portfólio"
                    className={`relative z-10 flex items-center gap-2 px-4 py-3 rounded-full font-black text-sm shadow-[0_6px_24px_rgba(0,0,0,0.15)] transition-all duration-300 ${open
                        ? "bg-[#a855f7] text-white shadow-[0_6px_24px_rgba(168,85,247,0.45)]"
                        : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_6px_28px_rgba(245,158,11,0.45)]"
                        }`}
                >
                    <Info size={17} className="shrink-0" />
                    <span className="leading-none tracking-wide">
                        {open ? "Fechar" : "Portfólio Dev"}
                    </span>
                </motion.button>
            </div>
        </div>
    );
}
