"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Sparkles, Sprout, Target, Users } from "lucide-react";
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
            staggerChildren: 0.2,
        },
    },
};

export default function Sobre() {
    const { scrollY } = useScroll();

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#FCFBFF]">
            {/* Background Shapes */}
            <div className="absolute top-0 inset-x-0 h-full w-full bg-[#FCFBFF] -z-20" />
            <div className="absolute top-0 inset-x-0 h-3/4 w-full bg-gradient-to-b from-[#e5d9f2]/30 to-transparent -z-10" />
            <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, -300]) }} className="absolute right-[-5%] top-[10%] w-96 h-96 bg-gradient-to-br from-[#52B56A]/20 to-transparent rounded-full blur-3xl -z-10" />
            <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, 400]) }} className="absolute left-[-10%] top-[40%] w-[500px] h-[500px] bg-gradient-to-tr from-[#fbcfe8]/40 to-transparent rounded-full blur-3xl -z-10" />

            {/* Decorative Stars */}
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 left-[10%] opacity-40"><svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
            <motion.div animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-72 right-[15%] opacity-40 scale-150"><svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>

            {/* Hero Section */}
            <section className="pt-40 md:pt-48 lg:pt-56 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]"
                >
                    <Sparkles size={16} className="text-[#a855f7]" />
                    <span className="text-sm font-bold tracking-widest uppercase text-[#a855f7]">Nossa História</span>
                </motion.div>

                <motion.h1
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="text-5xl md:text-7xl font-semibold text-[#0f172a] leading-[1.1] mb-8 tracking-tight max-w-4xl"
                >
                    Muito mais do que um <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8e68c1] to-[#ec4899]">Pet Shop.</span> Somos família.
                </motion.h1>

                <motion.p
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Acreditamos que cada animalzinho merece um tratamento de realeza. Nossa paixão transcende produtos e chega no coração de quem ama pets incondicionalmente.
                </motion.p>
            </section>

            {/* Origin / Values Section */}
            <section id="missao" className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-32">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col lg:flex-row gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 shadow-inner group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#a855f7]/20 to-transparent z-10 mix-blend-overlay"></div>
                        <Image
                            src="/hero_pets_1771607240493.png"
                            alt="Peti Origins"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="w-full lg:w-1/2"
                    >
                        <motion.h4 variants={fadeIn} className="text-[#52B56A] font-bold tracking-widest uppercase text-xs mb-4">A Essência Peti</motion.h4>
                        <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold text-[#141414] mb-6 leading-tight">
                            Nossa Missão é Oferecer Qualidade
                        </motion.h2>
                        <motion.p variants={fadeIn} className="text-gray-500 mb-6 leading-relaxed text-lg">
                            Bem-vindo à Peti! Aqui, acreditamos que nossos animais de estimação são membros inestimáveis
                            das nossas famílias. Desde o primeiro dia, trabalhamos para oferecer os melhores produtos do mercado,
                            entregando não apenas itens de necessidade, mas sim uma fonte de felicidade e saúde.
                        </motion.p>
                        <motion.p variants={fadeIn} className="text-gray-500 mb-10 leading-relaxed text-lg">
                            Nossa equipe seleciona rigorosamente cada ração, petisco, brinquedo e acessório
                            para garantir que seu pet receba apenas o mais alto padrão de qualidade, segurança e conforto diariamente.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-10">
                            <div className="flex flex-col items-start gap-1">
                                <span className="block text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#52B56A] to-[#22c55e]">+50k</span>
                                <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Produtos Vendidos</span>
                            </div>
                            <div className="w-[2px] h-12 bg-gray-200/60"></div>
                            <div className="flex flex-col items-start gap-1">
                                <span className="block text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#8b5cf6]">10+</span>
                                <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Anos no Mercado</span>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </section>

            {/* Features/Values Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-[#141414] mb-6">Nossos Pilares</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">O que nos move todos os dias para continuar entregando amor em forma de produtos.</p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {/* Valor 1 */}
                    <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50">
                        <div className="w-16 h-16 rounded-2xl bg-[#e5d9f2] text-[#a855f7] flex items-center justify-center mb-6">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#141414] mb-4">Amor Incondicional</h3>
                        <p className="text-gray-500 leading-relaxed">Tratamos cada vida com respeito. Tudo o que fazemos é baseado no amor que sentimos pelos nossos próprios companheiros.</p>
                    </motion.div>

                    {/* Valor 2 */}
                    <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50">
                        <div className="w-16 h-16 rounded-2xl bg-[#dcfce7] text-[#22c55e] flex items-center justify-center mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#141414] mb-4">Segurança 1º</h3>
                        <p className="text-gray-500 leading-relaxed">Curadoria rigorosa das melhores marcas. Não vendemos produtos que nós mesmos não confiaríamos em fornecer aos nossos animais.</p>
                    </motion.div>

                    {/* Valor 3 */}
                    <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50">
                        <div className="w-16 h-16 rounded-2xl bg-[#ffedd5] text-[#f97316] flex items-center justify-center mb-6">
                            <Users size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#141414] mb-4">Comunidade</h3>
                        <p className="text-gray-500 leading-relaxed">Criamos um hub para amantes de pets. Compartilhar experiências nos fortalece como marca e nos ensina a cuidar melhor todos os dias.</p>
                    </motion.div>

                </motion.div>
            </section>

            {/* Banner CTO Final */}
            <section className="pt-10 pb-24 px-6 max-w-7xl mx-auto relative z-10 mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full bg-[#141414] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
                >
                    {/* Shapes no fundo do banner escuro */}
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-[#a855f7]/50 to-transparent blur-3xl rounded-full mix-blend-screen" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-[#52B56A]/40 to-transparent blur-3xl rounded-full mix-blend-screen" />

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">Faça parte da nossa <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#e8bce9]">matilha feliz!</span></h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10 font-medium">
                        Ofereça o que há de melhor para quem sempre oferece o melhor sorriso ao lhe ver chegar.
                    </p>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <PawButton href="/catalogo" variant="primary" className="px-8 py-4 text-base w-full sm:w-auto">
                            Conhecer os Produtos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </PawButton>
                    </div>
                </motion.div>
            </section>

        </main>
    );
}
