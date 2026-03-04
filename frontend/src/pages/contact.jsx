import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: brancher API
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white pt-20">
            <div className="max-w-5xl mx-auto px-6 py-16">

                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full mb-6">
                        <Mail size={32} className="text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Nous{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
                            Contacter
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Une question, un partenariat ou une idée ? Notre équipe vous répondra dans les meilleurs délais.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Infos de contact */}
                    <div className="flex flex-col gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex items-start gap-4">
                            <div className="p-2 bg-violet-500/10 rounded-full shrink-0">
                                <Mail size={20} className="text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Email</h3>
                                <a href="mailto:contact@marsai.fr" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">
                                    contact@marsai.fr
                                </a>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex items-start gap-4">
                            <div className="p-2 bg-violet-500/10 rounded-full shrink-0">
                                <MessageCircle size={20} className="text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Discord</h3>
                                <p className="text-slate-400 text-sm">
                                    Rejoignez notre serveur pour discuter avec la communauté.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex items-start gap-4">
                            <div className="p-2 bg-violet-500/10 rounded-full shrink-0">
                                <MapPin size={20} className="text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Localisation</h3>
                                <p className="text-slate-400 text-sm">Paris / Mars (virtuel)</p>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="lg:col-span-2">
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center p-10 rounded-2xl bg-slate-900/50 border border-violet-500/30 text-center gap-4">
                                <CheckCircle size={48} className="text-violet-400" />
                                <h2 className="text-2xl font-bold text-white">Message envoyé !</h2>
                                <p className="text-slate-400">Merci de nous avoir contactés — nous reviendrons vers vous très prochainement.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-4 px-6 py-2 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors font-semibold"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col gap-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="name" className="text-sm font-medium text-slate-300">Nom</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Jean Dupont"
                                            className="rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-violet-500/60 transition-colors placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="jean@email.com"
                                            className="rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-violet-500/60 transition-colors placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="subject" className="text-sm font-medium text-slate-300">Sujet</label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="Votre sujet..."
                                        className="rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-violet-500/60 transition-colors placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Votre message..."
                                        className="rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-violet-500/60 transition-colors placeholder:text-slate-600 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="self-end inline-flex items-center gap-2 px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors"
                                >
                                    <Send size={16} />
                                    Envoyer
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
