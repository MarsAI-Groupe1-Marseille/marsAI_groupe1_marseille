import React from 'react';
import { Scale } from 'lucide-react';

const Legal = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white pt-20">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full mb-6">
                        <Scale size={32} className="text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Mentions{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
                            Légales
                        </span>
                    </h1>
                </div>

                <div className="space-y-12">
                    <section className="p-8 rounded-2xl bg-slate-900/50 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du site</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Le site MarsAI est édité par l'équipe MarsAI Groupe 1 Marseille.<br />
                            Adresse : La Plateforme, Marseille, France.<br />
                            Email : contact@marsai.fr<br />
                        </p>
                    </section>

                    <section className="p-8 rounded-2xl bg-slate-900/50 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Hébergement</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Ce site est hébergé par , situé à .<br />
                            Téléphone : 06 00 00 00 00.
                        </p>
                    </section>

                    <section className="p-8 rounded-2xl bg-slate-900/50 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Propriété intellectuelle</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Le contenu de ce site (textes, images, vidéos, etc.) est la propriété de MarsAI sauf mention contraire.
                            Toute reproduction, distribution, modification ou publication de ces différents éléments est strictement interdite sans notre accord exprès par écrit.
                        </p>
                    </section>

                    <section className="p-8 rounded-2xl bg-slate-900/50 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Données personnelles</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                            Vous pouvez exercer ce droit en nous contactant à l'adresse email mentionnée ci-dessus.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Legal;
