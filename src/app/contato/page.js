"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";
import PawButton from '../../components/PawButton';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export default function Contato() {
    const { scrollY } = useScroll();

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#FCFBFF]">
            {/* Background Shapes */}
            <div className="absolute top-0 inset-x-0 h-full w-full bg-[#FCFBFF] -z-20" />
            <div className="absolute top-0 inset-x-0 h-[80vh] w-full bg-gradient-to-b from-[#e5d9f2]/30 to-transparent -z-10" />
            <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, -300]) }} className="absolute left-[-5%] top-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#ec4899]/15 to-transparent rounded-full blur-3xl -z-10" />
            <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, 400]) }} className="absolute right-[-10%] top-[50%] w-[600px] h-[600px] bg-gradient-to-bl from-[#a855f7]/20 to-transparent rounded-full blur-3xl -z-10" />

            {/* Decorative Stars */}
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 right-[15%] opacity-40"><svg width="24" height="24" viewBox="0 0 24 24" fill="#52B56A" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
            <motion.div animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-72 left-[10%] opacity-30 scale-150"><svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>

            {/* Header Section */}
            <section className="pt-40 md:pt-48 lg:pt-56 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]"
                >
                    <MessageSquare size={16} className="text-[#ec4899]" />
                    <span className="text-sm font-bold tracking-widest uppercase text-[#ec4899]">Fale Conosco</span>
                </motion.div>

                <motion.h1
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="text-5xl md:text-7xl font-semibold text-[#0f172a] leading-[1.1] mb-8 tracking-tight max-w-4xl"
                >
                    Estamos de orelhas <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#fb923c]">em pé para você!</span>
                </motion.h1>

                <motion.p
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Tem alguma dúvida especial, sugestão criativa ou quer checar a disponibilidade de um item? Mande uma mensagem e nossa equipe (humana) responderá rapidinho.
                </motion.p>
            </section>

            {/* Main Contact Section */}
            <section className="px-6 max-w-7xl mx-auto pb-32 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">

                    {/* Infos Blocks (Esqueda) */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="w-full lg:w-5/12 flex flex-col gap-6"
                    >
                        <motion.div variants={fadeIn} className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-white flex items-start gap-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#ffedd5] text-[#f97316] flex items-center justify-center">
                                <MapPin size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#141414] mb-2">Visite nossa loja</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Rua dos Focinhos Felizes, 1234<br />Bairro Jardim Primavera<br />São Paulo, SP - 01234-567</p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-white flex items-start gap-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#e5d9f2] text-[#a855f7] flex items-center justify-center">
                                <Mail size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#141414] mb-2">Email Rápido</h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-1">Dúvidas gerais:</p>
                                <a href="mailto:ola@peti.com.br" className="text-lg font-bold text-[#a855f7] hover:underline">ola@peti.com.br</a>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-white flex items-start gap-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#dcfce7] text-[#22c55e] flex items-center justify-center">
                                <Phone size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#141414] mb-2">Telefone & Whatsapp</h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-1">Segunda à Sexta, 8h as 18h:</p>
                                <a href="tel:+5511999999999" className="text-lg font-bold text-[#22c55e] hover:underline">(11) 99999-9999</a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Form Block (Direita) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-7/12 bg-white/90 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
                    >
                        <h2 className="text-3xl font-black text-[#141414] mb-8">Envie uma mensagem</h2>

                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Seu Nome</label>
                                    <input type="text" placeholder="Como devemos lhe chamar?" className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent outline-none focus:border-[#a855f7] focus:bg-white text-gray-800 font-medium transition-colors" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Email</label>
                                    <input type="email" placeholder="seu@email.com" className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent outline-none focus:border-[#a855f7] focus:bg-white text-gray-800 font-medium transition-colors" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Assunto</label>
                                <input type="text" placeholder="Sobre o que quer falar?" className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent outline-none focus:border-[#a855f7] focus:bg-white text-gray-800 font-medium transition-colors" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Sua Mensagem</label>
                                <textarea rows="5" placeholder="Escreva aqui os detalhes..." className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent outline-none focus:border-[#a855f7] focus:bg-white text-gray-800 font-medium transition-colors resize-none"></textarea>
                            </div>

                            <div className="pt-4">
                                <PawButton variant="purple" className="px-10 py-5 text-lg w-full">
                                    Enviar Mensagem <Send size={18} className="ml-2" />
                                </PawButton>
                            </div>
                        </form>

                    </motion.div>

                </div>
            </section>
        </main>
    );
}
