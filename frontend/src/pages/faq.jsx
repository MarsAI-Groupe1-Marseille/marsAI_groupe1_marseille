import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CircleHelp, MessageCircle, Mail } from 'lucide-react';

const FAQ_DATA = [
    {
        question: "Qu'est-ce que Mars AI ?",
        answer: "Mars AI est une plateforme dédiée à la création cinématographique assistée par intelligence artificielle. Nous organisons des festivals, des concours et offrons une vitrine pour les créateurs utilisant l'IA dans leurs œuvres."
    },
    {
        question: "Comment soumettre un film ?",
        answer: "Pour soumettre un film, vous devez créer un compte, vous connecter, puis cliquer sur 'Soumission' dans le menu. Remplissez le formulaire avec les détails de votre œuvre et le lien vers la vidéo."
    },
    {
        question: "Quels sont les critères d'éligibilité ?",
        answer: "Les films doivent utiliser l'intelligence artificielle de manière significative dans leur processus de création (visuel, sonore, scénario, etc.). La durée et le format spécifiques sont détaillés dans le règlement de chaque concours."
    },
    {
        question: "L'inscription est-elle gratuite ?",
        answer: "L'inscription à la plateforme est gratuite. Certains concours spécifiques peuvent avoir des frais d'inscription, mais la plupart de nos événements sont ouverts à tous sans frais."
    },
    {
        question: "Comment fonctionne le système de vote ?",
        answer: "Les films sont soumis au vote d'un jury d'experts ainsi qu'au vote du public pour certains prix. Les critères incluent l'originalité, la qualité technique, et l'utilisation créative de l'IA."
    },
    {
        question: "Puis-je modifier ma soumission ?",
        answer: "Une fois soumise, une œuvre ne peut généralement pas être modifiée pendant la période de vote. Si vous avez fait une erreur majeure, veuillez nous contacter directement via le support."
    }
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white pt-20">
            <div className="max-w-4xl mx-auto px-6 py-16">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full mb-6">
                        <CircleHelp size={32} className="text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Questions <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">Fréquentes</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Trouvez des réponses aux questions les plus courantes sur le festival, les soumissions et le fonctionnement de la plateforme Mars AI.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {FAQ_DATA.map((item, index) => (
                        <div
                            key={index}
                            className={`group border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-slate-900/50 border-violet-500/30 shadow-lg shadow-violet-900/10' : 'bg-slate-900/20 hover:bg-slate-900/40 hover:border-white/10'}`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className={`text-lg font-semibold transition-colors ${openIndex === index ? 'text-violet-300' : 'text-slate-200 group-hover:text-white'}`}>
                                    {item.question}
                                </span>
                                <span className={`ml-4 p-2 rounded-full transition-all duration-300 ${openIndex === index ? 'bg-violet-500/20 text-violet-300 rotate-180' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'}`}>
                                    <ChevronDown size={20} />
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-violet-900/20 to-slate-900/50 border border-violet-500/20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Vous avez d'autres questions ?</h3>
                    <p className="text-slate-400 mb-8">
                        Notre équipe est là pour vous aider. N'hésitez pas à nous contacter directement.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@marsai.fr" className="bg-white text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center gap-2">
                            <Mail size={18} />
                            Nous contacter
                        </a>
                        <button className="px-8 py-3 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition flex items-center gap-2">
                            <MessageCircle size={18} />
                            Support Discord
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Faq;
