"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag, Filter, Sparkles, Heart } from "lucide-react";
import PawButton from '../../components/PawButton';
import ProductImage from '../../components/ProductImage';
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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

function CatalogoInner() {
    const { scrollY } = useScroll();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Relevância");

    // Aplica filtro de categoria via query param (?categoria=)
    useEffect(() => {
        const cat = searchParams.get("categoria");
        if (cat) setActiveCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "produtos"));
            const fetched = [];
            querySnapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() });
            });
            setProducts(fetched);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    // Filter and Sort Logic
    const filteredProducts = products.filter(item => {
        const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        const priceA = parseFloat((a.price || "0").replace(/[^\d,]/g, '').replace(',', '.'));
        const priceB = parseFloat((b.price || "0").replace(/[^\d,]/g, '').replace(',', '.'));

        if (sortBy === "Menor Preço") return priceA - priceB;
        if (sortBy === "Maior Preço") return priceB - priceA;
        return 0; // Relevância (default)
    });

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#FCFBFF]">
            {/* Background Shapes */}
            <div className="absolute top-0 inset-x-0 h-full w-full bg-[#FCFBFF] -z-20" />
            <div className="absolute top-0 inset-x-0 h-[80vh] w-full bg-gradient-to-b from-[#e5d9f2]/30 to-transparent -z-10" />
            <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, -300]) }} className="absolute left-[-10%] top-[20%] w-[500px] h-[500px] bg-gradient-to-tr from-[#52B56A]/20 to-transparent rounded-full blur-3xl -z-10" />
            <motion.div style={{ y: useTransform(scrollY, [0, 2000], [0, 500]) }} className="absolute right-[-5%] top-[60%] w-[600px] h-[600px] bg-gradient-to-bl from-[#a855f7]/15 to-transparent rounded-full blur-3xl -z-10" />

            {/* Decorative Stars */}
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-48 left-[8%] opacity-30"><svg width="30" height="30" viewBox="0 0 24 24" fill="#a855f7" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>
            <motion.div animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-64 right-[10%] opacity-40 scale-125"><svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" /></svg></motion.div>

            {/* Header Section */}
            <section className="pt-40 md:pt-48 lg:pt-56 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]"
                >
                    <ShoppingBag size={16} className="text-[#52B56A]" />
                    <span className="text-sm font-bold tracking-widest uppercase text-[#52B56A]">A loja do seu amigo</span>
                </motion.div>

                <motion.h1
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="text-5xl md:text-7xl font-semibold text-[#0f172a] leading-[1.1] mb-8 tracking-tight max-w-4xl"
                >
                    Tudo que faz o <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#52B56A] to-[#22c55e]">rabinho abanar.</span>
                </motion.h1>

                <motion.p
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Encontre as melhores marcas e itens essenciais selecionados a dedo para manter seu companheiro saudável e feliz todos os dias.
                </motion.p>
            </section>

            {/* Filters */}
            <section className="px-6 max-w-7xl mx-auto relative z-10 mb-12">
                <motion.div
                    initial="hidden" animate="visible" variants={fadeIn}
                    className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/80 backdrop-blur-md border border-white p-4 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]"
                >
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {["Todos", "Alimentação", "Higiene", "Acessórios", "Brinquedos"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-[#52B56A] text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                {cat === "Todos" ? "Ver Todos" : cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 group">
                        <input
                            type="text"
                            placeholder="Buscar itens..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 bg-gray-50 px-5 py-3 rounded-2xl outline-none focus:bg-white focus:border-[#a855f7] border-2 border-transparent transition-all shadow-sm focus:shadow-[0_10px_30px_-15px_rgba(168,85,247,0.3)] text-sm font-semibold text-gray-600"
                        />
                        <div className="relative w-full sm:w-auto shrink-0 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#a855f7] transition-colors">
                                <Filter size={18} />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full sm:w-[220px] bg-gray-50 border-2 border-transparent focus:border-[#a855f7] focus:bg-white text-gray-600 outline-none pl-12 pr-10 py-3 rounded-2xl font-semibold shadow-sm transition-all cursor-pointer"
                            >
                                <option>Relevância</option>
                                <option>Menor Preço</option>
                                <option>Maior Preço</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Products Grid */}
            <section className="px-6 max-w-7xl mx-auto pb-32 relative z-10">
                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-bold animate-pulse">
                        Carregando vitrine...
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold bg-white/50 rounded-3xl backdrop-blur-md border border-gray-100">
                        Nenhum produto cadastrado no momento.
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold bg-white/50 rounded-3xl backdrop-blur-md border border-gray-100">
                        Ops! Não encontramos nada com esse nome ou nessa categoria... 🔍
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredProducts.map((item) => (
                            <Link href={`/catalogo/${item.id}`} key={item.id} className="block group">
                                <motion.div
                                    variants={fadeIn}
                                    className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_-12px_rgba(168,85,247,0.12)] transition-all duration-500 cursor-pointer border border-gray-100 group-hover:border-[#a855f7]/30 flex flex-col h-full"
                                >
                                    <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden bg-[#FCFBFF] mb-5 flex items-center justify-center">
                                        {/* Imagem principal */}
                                        <ProductImage
                                            src={(item.images && item.images.length > 0 ? item.images[0] : item.imageUrl) || ""}
                                            alt={item.title}
                                            fill
                                            size={320}
                                            padding="p-6"
                                            blendMultiply
                                            className={`transition-all duration-500 ease-in-out ${item.images && item.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'}`}
                                        />
                                        {/* Segunda imagem (hover) */}
                                        {item.images && item.images.length > 1 && (
                                            <ProductImage
                                                src={item.images[1]}
                                                alt={`${item.title} - vista 2`}
                                                fill
                                                size={320}
                                                padding="p-6"
                                                blendMultiply
                                                className="transition-all duration-500 ease-in-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 absolute inset-0"
                                            />
                                        )}
                                        {item.isPromotion && (
                                            <div className="absolute top-3 left-3 bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(168,85,247,0.2)] z-10 flex items-center gap-1">
                                                <Sparkles size={12} /> PROMO
                                            </div>
                                        )}
                                        {/* Indicador de múltiplas fotos */}
                                        {item.images && item.images.length > 1 && (
                                            <div className="absolute bottom-3 left-3 flex gap-1 z-10">
                                                {item.images.slice(0, 4).map((_, i) => (
                                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[#a855f7] group-hover:opacity-0' : i === 1 ? 'bg-gray-300 opacity-0 group-hover:opacity-100 group-hover:bg-[#a855f7]' : 'bg-gray-200 opacity-60'}`} />
                                                ))}
                                            </div>
                                        )}
                                        {/* Emblema favorito */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                                            <Heart size={18} className="text-red-400 hover:fill-red-400 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-grow justify-between px-1">
                                        <div className="mb-4">
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 group-hover:text-[#52B56A] transition-colors mb-2">{item.category}</p>
                                            <h3 className="font-bold text-[#141414] text-base leading-snug group-hover:text-[#a855f7] transition-colors line-clamp-2">{item.title}</h3>
                                        </div>

                                        <div className="flex items-end justify-between mt-auto">
                                            <div className="flex flex-col">
                                                {item.isPromotion && item.promotionPrice ? (
                                                    <>
                                                        <span className="font-extrabold text-xl text-[#a855f7]">{item.promotionPrice}</span>
                                                        <span className="font-bold text-[11px] line-through text-gray-400 uppercase tracking-widest mt-0.5">{item.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-extrabold text-xl text-[#141414]">{item.price}</span>
                                                )}
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center transition-all group-hover:bg-[#a855f7] group-hover:text-white group-hover:rotate-[-45deg] group-hover:scale-110 shadow-sm group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
                                                <ArrowRight size={18} className="transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                )}

                {filteredProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-20 flex justify-center"
                    >
                        <PawButton variant="dark" className="px-10 py-5 text-lg">
                            Carregar mais produtos <Sparkles size={18} className="ml-2 animate-pulse" />
                        </PawButton>
                    </motion.div>
                )}

            </section>
        </main>
    );
}

export default function Catalogo() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FCFBFF] flex items-center justify-center font-bold text-[#52B56A] animate-pulse">Carregando vitrine...</div>}>
            <CatalogoInner />
        </Suspense>
    );
}
