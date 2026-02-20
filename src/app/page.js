"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";

const PromoCarousel = dynamic(() => import("../components/PromoCarousel"), { ssr: false });
import { useEffect, useState, Fragment } from "react";
import PawButton from "../components/PawButton";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

const fadeRight = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};


// ─── Página Principal ────────────────────────────────────────────────────────
export default function Home() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);

  useEffect(() => {
    const FALLBACK = [
      { id: "fallback-1", title: "Coleira Premium", description: "Ajustável, leve e super resistente. O estilo que seu gato merece.", price: "R$ 110,00", promotionPrice: "R$ 89,90", isPromotion: true, imageUrl: "/cat_collar_1771607350265.png" },
      { id: "fallback-2", title: "Ração Premium", description: "Nutrição completa para seu pet ter energia todo dia com ingredientes naturais.", price: "R$ 150,00", promotionPrice: "R$ 120,00", isPromotion: true, imageUrl: "/hero_dog_1_1771611625113.png" },
      { id: "fallback-3", title: "Kit Higiene Pet", description: "Shampoo, condicionador e escova para seu pet sempre cheiroso e com pelagem brilhante.", price: "R$ 95,00", promotionPrice: "R$ 75,00", isPromotion: true, imageUrl: "/hero_cat_1_1771611607035.png" },
    ];
    const fetchCarouselItems = async () => {
      try {
        const qPromo = query(collection(db, "produtos"), where("isPromotion", "==", true), limit(6));
        const promoSnap = await getDocs(qPromo);
        const promos = [];
        promoSnap.forEach((doc) => promos.push({ id: doc.id, ...doc.data() }));

        if (promos.length >= 3) { setCarouselItems(promos); return; }

        const qAll = query(collection(db, "produtos"), limit(6));
        const allSnap = await getDocs(qAll);
        const allProds = [];
        allSnap.forEach((doc) => {
          const d = { id: doc.id, ...doc.data() };
          if (!promos.find((p) => p.id === d.id)) allProds.push(d);
        });

        const combined = [...promos, ...allProds.map((p) => ({ ...p, isPromotion: false, promotionPrice: "" }))].slice(0, 6);
        if (combined.length >= 3) { setCarouselItems(combined); return; }

        // Menos de 3 produtos: mesclar com fallback para garantir mínimo de 3 itens
        const merged = [...combined];
        for (const f of FALLBACK) {
          if (merged.length >= 3) break;
          merged.push(f);
        }
        setCarouselItems(merged);
      } catch {
        setCarouselItems(FALLBACK);
      } finally {
        setCarouselLoading(false);
      }
    };
    fetchCarouselItems();
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const xReverse = useTransform(springX, (v) => v * -1);
  const yReverse = useTransform(springY, (v) => v * -1);

  const { scrollY } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      mouseX.set((e.clientX / window.innerWidth) * 40 - 20);
      mouseY.set((e.clientY / window.innerHeight) * 40 - 20);
      const target = e.target;
      const tag = target?.tagName?.toLowerCase?.() ?? "";
      setIsHovering(
        tag === "button" || tag === "a" ||
        !!target?.closest?.("button") || !!target?.closest?.("a")
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen overflow-hidden relative bg-[#F8F9FA]">

      {/* Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#52B56A] pointer-events-none z-[100] flex items-center justify-center mix-blend-difference hidden md:flex"
        animate={{ x: cursorPos.x - 16, y: cursorPos.y - 16, scale: isHovering ? 1.8 : 1, backgroundColor: isHovering ? "rgba(82,181,106,0.2)" : "rgba(82,181,106,0)" }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <div className={`w-1.5 h-1.5 bg-[#52B56A] rounded-full transition-transform ${isHovering ? "scale-0" : "scale-100"}`} />
      </motion.div>

      {/* BG Shapes */}
      <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, -300]) }} className="absolute right-[-5%] top-[25%] w-64 h-64 bg-gradient-to-br from-[#52B56A]/20 to-transparent rounded-full blur-3xl -z-10" />
      <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, 400]) }} className="absolute left-[-10%] top-[60%] w-[500px] h-[500px] bg-gradient-to-tr from-[#fbcfe8]/40 to-transparent rounded-full blur-3xl -z-10" />

      {/* Hero */}
      <section className="relative w-full min-h-screen pt-36 md:pt-40 lg:pt-44 pb-20 px-4 md:px-6 flex flex-col items-center overflow-hidden bg-[#f9f8fa]">
        <div className="absolute top-0 inset-x-0 h-full w-full bg-[#FCFBFF] -z-20" />
        <div className="absolute top-0 inset-x-0 h-3/4 w-full bg-gradient-to-b from-[#e5d9f2]/30 to-transparent -z-10" />
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[15%] right-[25%] opacity-40"><svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
        <motion.div animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-32 right-[20%] opacity-40 scale-150"><svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
        <motion.div animate={{ rotate: 180, scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-52 left-[5%] opacity-30 scale-75"><svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
        <motion.div animate={{ rotate: -180, scale: [0.8, 1, 0.8] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-32 right-[10%] opacity-40"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
        <motion.div animate={{ rotate: 360, y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[40%] left-[8%] opacity-30 scale-50"><svg width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
        <motion.div animate={{ rotate: -360, y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] right-[5%] opacity-20 scale-110"><svg width="24" height="24" viewBox="0 0 24 24" fill="#52B56A" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>

        <div className="text-center z-10 max-w-4xl mx-auto px-4 mt-8 md:mt-12 relative">
          {/* Fish */}
          <motion.div className="absolute -top-16 -left-8 md:-top-20 md:-left-28 hidden sm:block cursor-pointer z-0 opacity-80" animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} whileHover={{ scale: 1.2, rotate: 15, x: -10 }}>
            <svg width="90" height="90" viewBox="0 0 100 100" className="overflow-visible" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffcce0" /><stop offset="100%" stopColor="#f48fb1" /></linearGradient><filter id="fishShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="5" dy="8" stdDeviation="6" floodColor="#f48fb1" floodOpacity="0.4" /><feDropShadow dx="-3" dy="-3" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.9" /></filter></defs>
              <g filter="url(#fishShadow)" transform="rotate(-15 50 50)"><ellipse cx="55" cy="50" rx="25" ry="15" fill="url(#fishGrad)" /><polygon points="32,50 15,35 15,65" fill="url(#fishGrad)" stroke="url(#fishGrad)" strokeWidth="2" strokeLinejoin="round" /><circle cx="68" cy="45" r="3" fill="#ffffff" opacity="0.9" /></g>
            </svg>
          </motion.div>
          {/* Tennis Ball */}
          <motion.div className="absolute top-[20%] -right-12 md:top-20 md:-right-32 hidden sm:block cursor-pointer z-0 opacity-80" animate={{ y: [0, 20, 0], x: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} whileHover={{ scale: 1.25, rotate: 45 }}>
            <svg width="80" height="80" viewBox="0 0 100 100" className="overflow-visible" xmlns="http://www.w3.org/2000/svg">
              <defs><radialGradient id="ballGrad" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#eaff80" /><stop offset="100%" stopColor="#a3d100" /></radialGradient><filter id="ballShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#a3d100" floodOpacity="0.4" /><feDropShadow dx="-3" dy="-3" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.7" /></filter></defs>
              <circle cx="50" cy="50" r="35" fill="url(#ballGrad)" filter="url(#ballShadow)" /><path d="M 28 25 C 45 35, 45 65, 28 75" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" /><path d="M 72 25 C 55 35, 55 65, 72 75" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
            </svg>
          </motion.div>
          {/* Bone */}
          <motion.div className="absolute -bottom-16 -left-16 md:-bottom-20 md:-left-32 hidden md:block cursor-pointer z-0 opacity-80" animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} whileHover={{ scale: 1.3, rotate: -20 }}>
            <svg width="100" height="100" viewBox="0 0 100 100" className="overflow-visible" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#c2410c" /></linearGradient><filter id="boneGlow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="5" dy="8" stdDeviation="6" floodColor="#ea580c" floodOpacity="0.5" /><feDropShadow dx="-4" dy="-4" stdDeviation="5" floodColor="#ffedd5" floodOpacity="0.8" /></filter></defs>
              <g filter="url(#boneGlow)" transform="rotate(25 50 50)"><rect x="35" y="40" width="30" height="20" fill="url(#boneGrad)" /><circle cx="35" cy="40" r="12" fill="url(#boneGrad)" /><circle cx="35" cy="60" r="12" fill="url(#boneGrad)" /><circle cx="65" cy="40" r="12" fill="url(#boneGrad)" /><circle cx="65" cy="60" r="12" fill="url(#boneGrad)" /></g>
            </svg>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring", damping: 20 }} className="relative text-5xl md:text-7xl font-semibold text-[#0f172a] leading-[1.1] mb-6 tracking-tight z-10">
            O Melhor para o Seu Pet,<br className="hidden md:block" /> com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8e68c1] to-[#52B56A]">Qualidade e Carinho</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10 z-10">
            Torne o seu pet uma prioridade com nossos produtos exclusivos para a felicidade e bem-estar dele no dia a dia.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="relative flex flex-col sm:flex-row items-center justify-center gap-4 z-10">
            <PawButton href="/catalogo" variant="purple" className="px-8 py-3.5 text-base w-full sm:w-auto">
              Explorar Loja <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </PawButton>
            <PawButton href="/sobre#missao" variant="white" className="px-8 py-3.5 text-base w-full sm:w-auto">Nossa Missão</PawButton>
          </motion.div>
        </div>

        {/* Hero images */}
        <div className="relative w-full max-w-6xl mx-auto mt-16 md:mt-24 min-h-[400px] flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 px-4 z-10">
          <div className="hidden md:block absolute top-[50%] left-[10%] w-[80%] h-px border-t border-[#d8b4e2]/50 -z-10" />
          <motion.div style={{ y: springY, x: xReverse }} className="relative w-48 h-64 md:w-60 md:h-[320px] bg-purple-50 p-2 md:-mt-24 z-10 border border-purple-200 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="relative w-full h-full bg-[#f1e6ff] overflow-hidden cursor-pointer group">
              <Image src="/hero_cat_1_1771611607035.png" alt="Gato fofo" fill className="object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div style={{ y: springX, x: yReverse }} className="relative w-40 h-52 md:w-48 md:h-64 bg-green-50 p-2 md:mt-24 z-10 border border-green-200 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="relative w-full h-full bg-[#eaffe4] overflow-hidden cursor-pointer group">
              <Image src="/hero_dog_1_1771611625113.png" alt="Cão golden alegre" fill className="object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div style={{ y: yReverse, x: springY }} className="relative w-40 h-52 md:w-48 md:h-64 bg-orange-50 p-2 md:mt-12 z-10 border border-orange-200 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="relative w-full h-full bg-[#fff0e3] overflow-hidden cursor-pointer group">
              <Image src="/hero_cat_2_1771611641742.png" alt="Gato cinza" fill className="object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div style={{ y: xReverse, x: springX }} className="relative w-48 h-64 md:w-60 md:h-[320px] bg-pink-50 p-2 md:-mt-20 z-10 border border-pink-200 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="relative w-full h-full bg-[#ffedf4] overflow-hidden cursor-pointer group">
              <Image src="/hero_dog_2_1771611657512.png" alt="Cão feliz" fill className="object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sponsors ticker */}
      <section className="max-w-7xl mx-auto py-12 px-6 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10 pointer-events-none"></div>
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 w-max">
          {[...Array(3)].map((_, i) => (
            <Fragment key={i}>
              <span className="font-extrabold text-3xl tracking-tighter hover:text-[#52B56A] cursor-pointer transition-colors duration-300">PRO PLAN&#174;</span>
              <span className="font-extrabold text-4xl italic tracking-tighter lowercase hover:text-[#52B56A] cursor-pointer transition-colors duration-300">whiskas</span>
              <span className="font-black text-4xl tracking-tighter hover:text-[#52B56A] cursor-pointer transition-colors duration-300">Me-O</span>
              <span className="font-extrabold text-3xl tracking-widest uppercase hover:text-[#52B56A] cursor-pointer transition-colors duration-300">ROYAL CANIN</span>
              <span className="font-extrabold text-3xl tracking-tighter hover:text-[#52B56A] cursor-pointer transition-colors duration-300">PEDIGREE</span>
              <span className="font-black text-4xl italic tracking-tight hover:text-[#52B56A] cursor-pointer transition-colors duration-300">Purina</span>
              <span className="font-extrabold text-3xl tracking-widest uppercase hover:text-[#52B56A] cursor-pointer transition-colors duration-300">BRAVECTO</span>
            </Fragment>
          ))}
        </motion.div>
      </section>

      {/* Collaboration + Carrossel */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 px-6 flex flex-col xl:flex-row gap-12 xl:gap-20 items-center justify-between overflow-visible z-20 relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeRight} className="relative z-10 w-full xl:w-5/12 shrink-0">
          <div className="mb-6 inline-block">
            <h4 className="text-[#52B56A] font-bold tracking-widest uppercase text-xs mb-2">Destaque Exclusivo</h4>
            <motion.span initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.5 }} className="block h-1 bg-[#52B56A] rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#141414] mb-8 leading-[1.1] relative">
            Os Melhores <br />
            <span className="relative inline-block text-[#141414]">
              Acessórios
              <motion.div className="absolute -bottom-2 left-0 right-0 h-4 bg-[#52B56A]/20 -z-10 rounded-full" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8 }} style={{ transformOrigin: "left" }} />
            </span>
            <br />para o Seu Pet
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed max-w-md text-lg font-medium">
            Em nossa loja, sabemos que seus pets são parte da família. Por isso, oferecemos apenas os produtos que nós usaríamos nos nossos.
          </p>
          <PawButton href="/sobre" variant="dark" className="px-8 py-4 text-sm w-full sm:w-auto inline-flex mb-4">
            Ver Informações <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
          </PawButton>
        </motion.div>

        <div className="relative flex flex-col items-center w-full xl:w-7/12">
          {carouselLoading ? (
            /* Skeleton do carrossel */
            <div className="relative w-full max-w-[850px] animate-pulse">
              <div className="bg-white p-6 md:p-8 rounded-[3rem] w-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row gap-8 items-stretch min-h-[280px]">
                {/* Skeleton imagem */}
                <div className="w-full md:w-5/12 aspect-[4/3] md:aspect-square rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-50 shrink-0" />
                {/* Skeleton info */}
                <div className="flex flex-col justify-between w-full py-2 gap-4">
                  <div className="space-y-3">
                    <div className="h-3 w-24 bg-gray-100 rounded-full" />
                    <div className="h-8 w-3/4 bg-gray-100 rounded-2xl" />
                    <div className="h-8 w-1/2 bg-gray-100 rounded-2xl" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full bg-gray-100 rounded-full" />
                      <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
                      <div className="h-3 w-4/6 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-36 bg-gray-100 rounded-full" />
                    <div className="h-11 w-11 bg-gray-100 rounded-full" />
                    <div className="h-11 w-11 bg-gray-100 rounded-full" />
                  </div>
                </div>
              </div>
              {/* Skeleton dots */}
              <div className="flex justify-center gap-2 mt-5">
                <div className="h-2 w-6 bg-gray-200 rounded-full" />
                <div className="h-2 w-2 bg-gray-100 rounded-full" />
                <div className="h-2 w-2 bg-gray-100 rounded-full" />
              </div>
            </div>
          ) : (
            <PromoCarousel items={carouselItems} />
          )}

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 sm:gap-6 mt-8 w-full max-w-[850px] px-2 md:px-6 opacity-90">
            <div className="flex -space-x-4">
              {["/hero_dog_1_1771611625113.png", "/hero_cat_1_1771611607035.png", "/hero_dog_2_1771611657512.png", "/hero_cat_2_1771611641742.png"].map((src, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#FCFBFF] bg-gray-50 overflow-hidden flex items-center justify-center p-1 shadow-sm">
                  <Image src={src} alt="Pet Avatar" width={48} height={48} className="object-cover w-full h-full rounded-full" />
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                {[...Array(5)].map((_, i) => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>)}
              </div>
              <p className="text-gray-500 font-medium text-sm"><strong className="text-black font-extrabold">+5.000</strong> tutores felizes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="pt-16 pb-32 px-6 relative z-10 -mt-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_80%,transparent_100%)] -z-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="text-center flex flex-col items-center mb-20">
            <span className="bg-[#52B56A]/10 text-[#52B56A] px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase mb-6">Categorias</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#141414] mb-6">O Que Oferecemos</h2>
            <p className="text-gray-500 text-lg max-w-2xl font-medium">Nossa loja oferece uma linha completa dos melhores produtos para a alimentação, higiene e o conforto do seu melhor amigo.</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Alimentação Premium", color: "bg-red-50 text-red-500", icon: "🦴", desc: "Rações, petiscos e suplementos para manter energia lá em cima.", href: "/catalogo?categoria=Alimenta%C3%A7%C3%A3o" },
              { title: "Higiene e Beleza", color: "bg-blue-50 text-blue-500", icon: "🛁", desc: "Shampoos modernos e escovas para pelos de brilhar os olhos.", href: "/catalogo?categoria=Higiene" },
              { title: "Brinquedos e Conforto", color: "bg-yellow-50 text-yellow-500", icon: "🧸", desc: "Caminhas nuvem e arranhadores gigantes para a diversão.", href: "/catalogo?categoria=Brinquedos" }
            ].map((facility, idx) => (
              <Link key={idx} href={facility.href}>
                <motion.div variants={fadeUp} whileHover={{ y: -15 }} className="group relative bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:shadow-[#52B56A]/10 transition-all duration-500 overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#52B56A]/0 via-[#52B56A]/0 to-[#52B56A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }} transition={{ duration: 0.5 }} className={`w-20 h-20 rounded-3xl ${facility.color} flex items-center justify-center text-4xl mb-8 shadow-inner`}>{facility.icon}</motion.div>
                  <h3 className="font-extrabold text-2xl mb-4 text-[#141414]">{facility.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">{facility.desc}</p>
                  <div className="mt-8 flex items-center text-[#52B56A] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Explorar Seção <ArrowRight size={18} className="ml-2" /></div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Produtos em Ação */}
      <section className="bg-black text-white py-32 rounded-t-[4rem] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Produtos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#52B56A] to-yellow-300">Em Ação</span></h2>
              <p className="text-gray-400 text-xl md:text-2xl font-medium">Seja a diversão no colo ou o luxo no banho. Veja as demonstrações.</p>
            </div>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="grid md:grid-cols-3 gap-10">
            {[
              { img: "/hero_dog_1_1771611625113.png", label: "Brinquedos", title: "Hora de Brincar!", color: "#52B56A", href: "/catalogo?categoria=Brinquedos" },
              { img: "/hero_cat_1_1771611607035.png", label: "Conforto", title: "Caminhas & Tocas", color: "#a855f7", href: "/catalogo?categoria=Acess%C3%B3rios" },
              { img: "/hero_dog_2_1771611657512.png", label: "Higiene", title: "Banho com Estilo", color: "#f59e0b", href: "/catalogo?categoria=Higiene" },
            ].map((card, idx) => (
              <Link key={idx} href={card.href}>
                <motion.div variants={fadeUp} className="group relative rounded-[2rem] overflow-hidden cursor-pointer">
                  <div className="relative w-full aspect-[4/5] bg-gray-900 overflow-hidden">
                    <Image src={card.img} alt={card.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 z-20">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl">
                        <Play size={24} fill="white" className="text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                      <span className="px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4 inline-flex items-center gap-1 shadow-md" style={{ backgroundColor: card.color }}><Sparkles size={12} /> {card.label}</span>
                      <h4 className="font-black text-2xl md:text-3xl text-white mb-2 leading-tight">{card.title}</h4>
                      <div className="w-full h-1 bg-white/20 mt-6 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} className="h-full" style={{ backgroundColor: card.color }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust / Newsletter */}
      <section className="bg-black px-6 pb-24 h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="max-w-7xl mx-auto bg-gradient-to-r from-[#52B56A] to-[#368a4a] rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_30px_60px_-15px_rgba(82,181,106,0.4)] relative overflow-hidden -mt-20 z-30"
        >
          <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-xl relative z-10 w-full md:w-1/2 text-white">
            <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-black mb-6 leading-[1.1]">
              Ofertas <br />Exclusivas no <br /><span className="text-yellow-300">Seu E-mail</span>
            </motion.h2>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-10">Descontos selecionados e novidades de produtos em primeira mão para você.</p>
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full p-2 pl-8 transition-all w-full shadow-2xl focus-within:bg-white focus-within:text-black">
              <input type="email" placeholder="Insira seu e-mail" className="bg-transparent border-none outline-none flex-grow text-base md:text-lg placeholder:text-white/60 focus:placeholder:text-gray-400 focus:text-black font-semibold" />
              <PawButton variant="dark" className="w-16 h-16 shrink-0 bg-black border-black text-[#52B56A] outline-none">
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </PawButton>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 10 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ type: "spring", bounce: 0.5, delay: 0.3 }} className="relative w-full md:w-1/2 h-[350px] md:h-[500px]">
            <motion.div animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="w-full h-full relative">
              <Image src="/pets_trust_1771607695926.png" alt="Promoções e confiança" fill className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
