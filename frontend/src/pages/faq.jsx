import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CircleHelp, MessageCircle, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

// FAQ questions/answers are now managed through translation keys
const FAQ_KEYS = [
    { questionKey: 'faq_q1', answerKey: 'faq_a1' },
    { questionKey: 'faq_q2', answerKey: 'faq_a2' },
    { questionKey: 'faq_q3', answerKey: 'faq_a3' },
    { questionKey: 'faq_q4', answerKey: 'faq_a4' },
    { questionKey: 'faq_q5', answerKey: 'faq_a5' },
    { questionKey: 'faq_q6', answerKey: 'faq_a6' },
];

const Faq = () => {
    const { t } = useLanguage();
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
                        {t('faq_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600"></span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        {t('faq_subtitle')}
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {FAQ_KEYS.map((item, index) => (
                        <div
                            key={index}
                            className={`group border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-slate-900/50 border-violet-500/30 shadow-lg shadow-violet-900/10' : 'bg-slate-900/20 hover:bg-slate-900/40 hover:border-white/10'}`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className={`text-lg font-semibold transition-colors ${openIndex === index ? 'text-violet-300' : 'text-slate-200 group-hover:text-white'}`}>
                                    {t(item.questionKey)}
                                </span>
                                <span className={`ml-4 p-2 rounded-full transition-all duration-300 ${openIndex === index ? 'bg-violet-500/20 text-violet-300 rotate-180' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'}`}>
                                    <ChevronDown size={20} />
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
                                    {t(item.answerKey)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-violet-900/20 to-slate-900/50 border border-violet-500/20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">{t('faq_contact_title')}</h3>
                    <p className="text-slate-400 mb-8">
                        {t('faq_contact_desc')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@marsai.fr" className="bg-white text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center gap-2">
                            <Mail size={18} />
                            {t('faq_contact_btn')}
                        </a>
                        <button className="px-8 py-3 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition flex items-center gap-2">
                            <MessageCircle size={18} />
                            {t('faq_discord_btn')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Faq;
