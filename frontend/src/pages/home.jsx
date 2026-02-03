import React from 'react';
import { ArrowRight, Trophy, Users, Cpu, Globe } from 'lucide-react'; // Assuming you can use lucide-react, or replace with standard text/svg

const Home = () => {
    // Data structures make the JSX cleaner and easier to maintain
    const categories = [
        { title: "Exploration", img: "https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&q=80&w=400", desc: "Mapping the red planet." },
        { title: "Colonization", img: "https://images.unsplash.com/photo-1614728853913-1e22ba6e985e?auto=format&fit=crop&q=80&w=400", desc: "Sustainable habitats." },
        { title: "Terraforming", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400", desc: "Atmospheric generation." },
        { title: "AI Analysis", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400", desc: "Data driven future." },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white">

            <main className="pt-20">
                {/* --- HERO SECTION --- */}
                <section id="accueil" className="relative py-32 lg:py-48 flex flex-col items-center text-center px-4 overflow-hidden">
                    {/* Background Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] -z-10"></div>

                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-6">
                        MARS <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">AI</span>
                    </h1>
                    <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A debitis doloribus inventore magnam minus quo ullam! Assumenda atque, aut autem cum deleniti, expedita impedit, iusto optio qui quidem totam ut.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-white text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center gap-2">
                            Commencer <ArrowRight size={18} />
                        </button>
                        <button className="border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
                            En savoir plus
                        </button>
                    </div>
                </section>

                {/* --- CATEGORIES --- */}
                <section id="categories" className="py-20 max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Catégories</h2>
                        <div className="h-px bg-white/20 flex-grow"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 hover:border-orange-500/50 transition-all duration-300">
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={cat.img}
                                        alt={cat.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                                    <p className="text-slate-400 text-sm">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                <section id="awards" className="py-20 bg-slate-900/50 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-16">Reconnaissance & Awards</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-6">
                                    <Trophy size={32} />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">1er Prix</h3>
                                <p className="text-slate-400">Innovation Spatiale 2025</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-6">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">Global</h3>
                                <p className="text-slate-400">Partenariats Internationaux</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-6">
                                    <Cpu size={32} />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">Top 10</h3>
                                <p className="text-slate-400">Tech Startups France</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="partenaires" className="py-20 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-4">Nos Partenaires</h2>
                        <p className="text-slate-400">Ils font confiance à la plateforme</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 transition cursor-pointer">
                                <span className="font-bold text-xl tracking-widest text-slate-500">LOGO {i}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-black py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-xl font-bold text-white">MARS AI © 2026</div>
                    <div className="flex gap-6 text-slate-400 text-sm">
                        <a href="#" className="hover:text-white transition">Mentions Légales</a>
                        <a href="#" className="hover:text-white transition">Politique de Confidentialité</a>
                        <a href="#" className="hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home