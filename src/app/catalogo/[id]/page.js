"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, Heart, Sparkles, ChevronLeft, ChevronRight, ThumbsUp, MessageCircle } from "lucide-react";
import PawButton from "../../../components/PawButton";
import ProductImage from "../../../components/ProductImage";

const ALL_REVIEWS = [
    { name: "Ana Clara", avatar: "AC", stars: 5, date: "15 jan 2025", text: "Meu cachorrinho amou! Chegou super rápido e bem embalado. Já é o terceiro que compro aqui, nunca me decepcionou.", likes: 42, color: "from-pink-400 to-rose-500" },
    { name: "Pedro H.", avatar: "PH", stars: 5, date: "22 jan 2025", text: "Produto excelente! A qualidade superou minhas expectativas. Minha gata ficou obcecada. Recomendo demais!", likes: 38, color: "from-blue-400 to-indigo-500" },
    { name: "Mariana S.", avatar: "MS", stars: 4, date: "03 fev 2025", text: "Gostei bastante, só achei que poderia ser um pouco maior. Mas a qualidade é ótima e o pet adorou!", likes: 17, color: "from-emerald-400 to-teal-500" },
    { name: "Lucas T.", avatar: "LT", stars: 5, date: "10 fev 2025", text: "Serviço impecável da Peti! Produto chegou antes do prazo e meu dog já está usando com orgulho 😄", likes: 29, color: "from-orange-400 to-amber-500" },
    { name: "Fernanda R.", avatar: "FR", stars: 5, date: "14 fev 2025", text: "Presentei minha cachorrinha no dia dos namorados com esse produto e ela ficou encantada! Voltarei mais vezes.", likes: 55, color: "from-violet-400 to-purple-500" },
    { name: "Carlos M.", avatar: "CM", stars: 5, date: "01 mar 2025", text: "Comprei para o meu golden retriever. Qualidade fantástica, ele usa todos os dias. Vale cada centavo.", likes: 33, color: "from-sky-400 to-cyan-500" },
    { name: "Juliana K.", avatar: "JK", stars: 4, date: "05 mar 2025", text: "Ótimo produto! Minha gatinha de início desconfiou mas agora não larga. Entrega rápida e embalagem linda.", likes: 21, color: "from-fuchsia-400 to-pink-500" },
    { name: "Rafael B.", avatar: "RB", stars: 5, date: "12 mar 2025", text: "Melhor loja de pet da internet sem dúvida! Produto de altíssima qualidade e suporte sensacional.", likes: 48, color: "from-lime-400 to-green-500" },
    { name: "Beatriz O.", avatar: "BO", stars: 5, date: "20 mar 2025", text: "Meu bichinho ficou super feliz! Já é o segundo produto que compro e ambos foram perfeitos. Entrega relâmpago!", likes: 36, color: "from-red-400 to-rose-500" },
    { name: "Thiago N.", avatar: "TN", stars: 4, date: "28 mar 2025", text: "Produto bonito e resistente. Meu labrador que destruiu tudo que comprei antes, esse ainda está intacto depois de semanas!", likes: 61, color: "from-indigo-400 to-violet-500" },
    { name: "Camila F.", avatar: "CF", stars: 5, date: "04 abr 2025", text: "A Peti sempre supera as expectativas! Chegou em 2 dias, embalagem cuidadosa e minha princesinha adorou.", likes: 44, color: "from-amber-400 to-orange-500" },
    { name: "Diego L.", avatar: "DL", stars: 5, date: "11 abr 2025", text: "Comprei como teste e agora nunca mais compro em outro lugar. Qualidade premium a um preço justo!", likes: 27, color: "from-teal-400 to-emerald-500" },
    { name: "Vanessa P.", avatar: "VP", stars: 3, date: "18 abr 2025", text: "Produto bom, mas achei um pouco caro. Ainda assim, meu pet aprovou e está usando bastante.", likes: 8, color: "from-slate-400 to-gray-500" },
    { name: "Gustavo A.", avatar: "GA", stars: 5, date: "25 abr 2025", text: "Top demais! Meu poodle é exigente e aprovou esse produto na hora. Compro sempre pela Peti!", likes: 39, color: "from-purple-400 to-fuchsia-500" },
    { name: "Isabela C.", avatar: "IC", stars: 5, date: "02 mai 2025", text: "Incrível! A foto já era linda mas ao vivo é ainda melhor. Meu shih tzu parece um rei com isso. 👑", likes: 52, color: "from-cyan-400 to-sky-500" },
    { name: "Rodolfo M.", avatar: "RM", stars: 4, date: "09 mai 2025", text: "Qualidade muito boa. Só demorou um pouquinho mais pra chegar, mas valeu a espera! Pet aprovadíssimo.", likes: 15, color: "from-green-400 to-lime-500" },
    { name: "Larissa V.", avatar: "LV", stars: 5, date: "16 mai 2025", text: "Box chegou lindo, presentinho incrível para minha pet. Ela ficou revirando tudo na hora. 😂 Adorei!", likes: 67, color: "from-rose-400 to-pink-500" },
    { name: "Felipe Z.", avatar: "FZ", stars: 5, date: "23 mai 2025", text: "Produto exatamente como descrito, talvez até melhor! Meu vira-lata caramelo aprovou na primeira tentativa.", likes: 31, color: "from-yellow-400 to-amber-500" },
];


export default function ProdutoInfo() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [direction, setDirection] = useState(1);

    // Seleciona aleatoriamente entre 4 e 6 reviews do pool total
    const reviews = useMemo(() => {
        const shuffled = [...ALL_REVIEWS].sort(() => Math.random() - 0.5);
        const count = Math.floor(Math.random() * 3) + 4; // 4 a 6
        return shuffled.slice(0, count);
    }, [id]);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "produtos", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() });
            }
            setLoading(false);
        };
        if (id) fetchProduct();
    }, [id]);

    // Normalizar array de imagens (compatibilidade com campo legado imageUrl)
    const getImages = () => {
        if (!product) return [];
        if (product.images && product.images.length > 0) return product.images;
        if (product.imageUrl) return [product.imageUrl];
        return [];
    };

    const changeImage = (newIdx, dir) => {
        setDirection(dir);
        setActiveImg(newIdx);
    };

    const images = getImages();

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
        center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
        exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25 } }),
    };

    if (loading) {
        return <div className="min-h-screen bg-[#FCFBFF] flex items-center justify-center font-bold text-[#a855f7] animate-pulse text-xl">Buscando detalhes do produto...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FCFBFF] flex flex-col items-center justify-center">
                <h2 className="text-3xl font-black text-[#141414] mb-4">Produto Mágico não encontrado!</h2>
                <Link href="/catalogo" className="text-[#a855f7] font-bold hover:underline inline-flex items-center gap-2">
                    <ArrowLeft size={16} /> Voltar ao catálogo
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#FCFBFF] pt-32 pb-24 px-6">
            {/* Background Shapes */}
            <div className="absolute top-0 inset-x-0 h-full w-full bg-[#FCFBFF] -z-20" />
            <div className="absolute top-0 inset-x-0 h-[60vh] w-full bg-gradient-to-b from-[#e5d9f2]/40 to-transparent -z-10" />

            <div className="max-w-6xl mx-auto">
                <Link href="/catalogo" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-[#a855f7] transition-colors mb-8 group pl-2 md:pl-0">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                        <ArrowLeft size={16} />
                    </div>
                    Voltar ao Catálogo
                </Link>

                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col lg:flex-row gap-12 lg:gap-20 relative">


                    {/* Área de Imagens (Galeria) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 flex flex-col gap-4"
                    >
                        {/* Imagem Principal */}
                        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-[#FCFBFF] shadow-inner border border-gray-50 flex items-center justify-center p-8 group">
                            <AnimatePresence custom={direction} mode="wait">
                                <motion.div
                                    key={activeImg}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0 flex items-center justify-center p-8"
                                >
                                    <ProductImage
                                        src={images[activeImg] || ""}
                                        alt={`${product.title} - foto ${activeImg + 1}`}
                                        fill
                                        size={400}
                                        padding="p-8"
                                        blendMultiply
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Botão de favoritar */}
                            <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors z-10">
                                <Heart size={20} />
                            </button>

                            {/* Controles prev/next se tiver mais de 1 imagem */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => changeImage((activeImg - 1 + images.length) % images.length, -1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-[#a855f7] hover:bg-white transition-all z-10"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => changeImage((activeImg + 1) % images.length, 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-[#a855f7] hover:bg-white transition-all z-10"
                                    >
                                        <ChevronRight size={18} />
                                    </button>

                                    {/* Contador */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                        {activeImg + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 justify-center flex-wrap">
                                {images.map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => changeImage(idx, idx > activeImg ? 1 : -1)}
                                        className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${activeImg === idx ? 'border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.3)] scale-105' : 'border-gray-100 hover:border-[#a855f7]/50 opacity-70 hover:opacity-100'}`}
                                    >
                                        <ProductImage src={url} alt={`Thumbnail ${idx + 1}`} fill size={64} className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Área de Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 flex flex-col justify-center"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-[#a855f7] text-[10px] font-black tracking-widest uppercase shadow-sm border border-purple-100">
                                    {product.category}
                                </span>
                                {product.isPromotion && product.promotionPrice && (() => {
                                    const parsePrice = (str) => parseFloat((str || "0").replace(/[^\d,]/g, '').replace(',', '.'));
                                    const original = parsePrice(product.price);
                                    const promo = parsePrice(product.promotionPrice);
                                    const pct = original > 0 ? Math.round((1 - promo / original) * 100) : 0;
                                    return pct > 0 ? (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                                            className="flex items-center gap-1.5 bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-[0_4px_16px_rgba(168,85,247,0.4)]"
                                        >
                                            <Sparkles size={12} />
                                            -{pct}% OFF
                                        </motion.div>
                                    ) : null;
                                })()}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#141414] leading-tight mb-4">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                <div className="flex items-center text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
                                </div>
                                <span className="text-gray-500">5.0 (124 avaliações)</span>
                            </div>
                        </div>

                        {/* Bloco de Preço */}
                        {product.isPromotion && product.promotionPrice ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-6 bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-200/60 rounded-3xl p-5 relative overflow-hidden"
                            >
                                {/* Brilho decorativo */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#a855f7]/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                            className="text-5xl font-black text-[#a855f7] tracking-tight"
                                        >
                                            {product.promotionPrice}
                                        </motion.span>
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-xl text-gray-400 font-bold line-through"
                                        >
                                            {product.price}
                                        </motion.span>
                                    </div>

                                    {/* Faixa de urgência pulsante */}
                                    <motion.div
                                        animate={{ opacity: [1, 0.7, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider"
                                    >
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full inline-block animate-ping" />
                                        Oferta por tempo limitado
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="mb-6">
                                <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-black text-[#141414] tracking-tight block">{product.price}</motion.span>
                            </div>
                        )}

                        <p className="text-[#52B56A] font-bold text-sm mb-6 flex items-center gap-1.5">
                            <Sparkles size={14} /> Em estoque. Envio Imediato Mágico!
                        </p>

                        <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                            {product.description || "Este produto fabuloso é perfeito para a rotina do seu pet. Desenvolvido com carinho e materiais de super qualidade."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <PawButton variant="purple" className="flex-1 py-5 justify-center text-lg shadow-[0_10px_30px_-10px_rgba(168,85,247,0.5)]">
                                Adicionar à Sacola <ShoppingBag size={20} className="ml-2" />
                            </PawButton>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-[#52B56A] flex items-center justify-center shrink-0">
                                    <Truck size={18} />
                                </div>
                                <p className="text-sm font-bold text-gray-600">Frete Grátis nas magias acima de R$ 99</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={18} />
                                </div>
                                <p className="text-sm font-bold text-gray-600">Devolução mágica em até 7 dias</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ===== Seção de Avaliações ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7 }}
                    className="mt-10 bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
                >
                    {/* Header da seção */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <MessageCircle size={22} className="text-[#a855f7]" />
                                <h2 className="text-2xl font-black text-[#141414]">Avaliações dos Clientes</h2>
                            </div>
                            <p className="text-gray-500 text-sm font-medium pl-9">O que estão dizendo sobre este produto mágico</p>
                        </div>
                        {/* Resumo geral */}
                        <div className="flex items-center gap-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 rounded-2xl px-6 py-4 shrink-0">
                            <div className="text-center">
                                <p className="text-4xl font-black text-[#a855f7]">5.0</p>
                                <div className="flex items-center justify-center text-yellow-400 mt-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                                </div>
                            </div>
                            <div className="text-left text-sm text-gray-500 font-medium">
                                <p className="font-bold text-gray-700">{ALL_REVIEWS.length}+ avaliações</p>
                                <p>98% recomendam</p>
                            </div>
                        </div>
                    </div>

                    {/* Grid de cards de review */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className="bg-[#FCFBFF] border border-gray-100 rounded-3xl p-6 flex flex-col gap-4 hover:border-[#a855f7]/20 hover:shadow-[0_8px_24px_-10px_rgba(168,85,247,0.1)] transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar gerado com iniciais */}
                                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md`}>
                                            {review.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#141414] text-sm">{review.name}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{review.date}</p>
                                        </div>
                                    </div>
                                    {/* Estrelas */}
                                    <div className="flex items-center text-yellow-400 shrink-0">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.stars ? 'fill-current' : 'text-gray-200 fill-current'} />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed font-medium flex-grow">{review.text}</p>

                                {/* Rodapé do card */}
                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#a855f7] transition-colors text-xs font-bold group">
                                        <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
                                        Útil ({review.likes})
                                    </button>
                                    <span className="text-gray-200">·</span>
                                    <span className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">Compra verificada</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <p className="text-sm text-gray-400 font-medium">Mostrando {reviews.length} de {ALL_REVIEWS.length}+ avaliações verificadas</p>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
