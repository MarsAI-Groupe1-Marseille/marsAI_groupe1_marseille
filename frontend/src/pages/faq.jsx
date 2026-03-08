import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CircleHelp, MessageCircle, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import StarryBackground from '../components/StarryBackground.jsx';

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
    const [currentMode, setCurrentMode] = useState('dark');

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const mode = document.documentElement.getAttribute('data-mode');
            setCurrentMode(mode || 'dark');
        });

        const mode = document.documentElement.getAttribute('data-mode');
        setCurrentMode(mode || 'dark');

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
        <StarryBackground />
        <div style={{
            minHeight: '100vh',
            backgroundColor: currentMode === 'light' ? '#ffffff' : '#0f172a',
            color: currentMode === 'light' ? '#333333' : '#cbd5e1',
            fontFamily: 'sans-serif',
            paddingTop: '5rem',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '4rem', paddingBottom: '4rem' }}>

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.75rem',
                        backgroundColor: currentMode === 'light' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '9999px',
                        marginBottom: '1.5rem'
                    }}>
                        <CircleHelp size={32} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.25rem',
                        fontWeight: '900',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        letterSpacing: '0.025em',
                        marginBottom: '1.5rem'
                    }}>
                        {t('faq_title')}
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        color: currentMode === 'light' ? '#666666' : '#94a3b8',
                        maxWidth: '42rem',
                        margin: '0 auto'
                    }}>
                        {t('faq_subtitle')}
                    </p>
                </div>

                {/* FAQ List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {FAQ_KEYS.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                style={{
                                    border: `1px solid ${isOpen ? (currentMode === 'light' ? 'rgba(124,58,237,0.3)' : 'rgba(139, 92, 246, 0.3)') : (currentMode === 'light' ? 'rgba(124,58,237,0.15)' : 'rgba(255, 255, 255, 0.05)')}`,
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s',
                                    backgroundColor: isOpen
                                        ? (currentMode === 'light' ? 'rgba(243, 240, 255, 0.6)' : 'rgba(30, 41, 59, 0.5)')
                                        : (currentMode === 'light' ? 'rgba(243, 240, 255, 0.3)' : 'rgba(30, 41, 59, 0.2)'),
                                    boxShadow: isOpen ? (currentMode === 'light' ? '0 10px 15px rgba(124,58,237,0.1)' : '0 10px 15px rgba(91, 33, 182, 0.1)') : 'none'
                                }}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.5rem',
                                        textAlign: 'left',
                                        outline: 'none',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isOpen) {
                                            e.currentTarget.parentElement.style.backgroundColor = currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isOpen) {
                                            e.currentTarget.parentElement.style.backgroundColor = currentMode === 'light' ? 'rgba(243, 240, 255, 0.3)' : 'rgba(30, 41, 59, 0.2)';
                                        }
                                    }}
                                >
                                    <span style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        transition: 'color 0.3s',
                                        color: isOpen
                                            ? (currentMode === 'light' ? '#7c3aed' : '#a78bfa')
                                            : (currentMode === 'light' ? '#333333' : '#cbd5e1')
                                    }}>
                                        {t(item.questionKey)}
                                    </span>
                                    <span style={{
                                        marginLeft: '1rem',
                                        padding: '0.5rem',
                                        borderRadius: '100%',
                                        transition: 'all 0.3s',
                                        backgroundColor: isOpen
                                            ? (currentMode === 'light' ? 'rgba(124,58,237,0.2)' : 'rgba(139, 92, 246, 0.2)')
                                            : (currentMode === 'light' ? 'rgba(124,58,237,0.1)' : 'rgba(255, 255, 255, 0.05)'),
                                        color: isOpen
                                            ? (currentMode === 'light' ? '#7c3aed' : '#a78bfa')
                                            : (currentMode === 'light' ? '#999999' : '#94a3b8'),
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        <ChevronDown size={20} />
                                    </span>
                                </button>

                                <div
                                    style={{
                                        transition: 'all 0.3s ease-in-out',
                                        overflow: 'hidden',
                                        maxHeight: isOpen ? '400px' : '0px',
                                        opacity: isOpen ? 1 : 0
                                    }}
                                >
                                    <div style={{
                                        padding: '1.5rem',
                                        paddingTop: '0',
                                        color: currentMode === 'light' ? '#666666' : '#94a3b8',
                                        lineHeight: '1.625',
                                        borderTop: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.15)' : 'rgba(255, 255, 255, 0.05)'}`
                                    }}>
                                        {t(item.answerKey)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Section */}
                <div style={{
                    marginTop: '5rem',
                    padding: '2rem',
                    borderRadius: '1.875rem',
                    background: currentMode === 'light'
                        ? 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.1), rgba(243, 240, 255, 0.3))'
                        : 'linear-gradient(to bottom right, rgba(91, 33, 182, 0.2), rgba(30, 41, 59, 0.5))',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.25)' : 'rgba(139, 92, 246, 0.2)'}`,
                    textAlign: 'center'
                }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        marginBottom: '1rem'
                    }}>{t('faq_contact_title')}</h3>
                    <p style={{
                        color: currentMode === 'light' ? '#666666' : '#94a3b8',
                        marginBottom: '2rem'
                    }}>
                        {t('faq_contact_desc')}
                    </p>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        '@media (min-width: 640px)': { flexDirection: 'row' }
                    }}>
                        <a href="mailto:contact@marsai.fr" style={{
                            backgroundColor: currentMode === 'light' ? '#ffffff' : '#7c3aed',
                            color: currentMode === 'light' ? '#000000' : '#ffffff',
                            padding: '0.75rem 2rem',
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = currentMode === 'light' ? '#f0f0f0' : '#6d28d9';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = currentMode === 'light' ? '#ffffff' : '#7c3aed';
                        }}
                        >
                            <Mail size={18} />
                            {t('faq_contact_btn')}
                        </a>
                        <button style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            color: currentMode === 'light' ? '#7c3aed' : '#ffffff',
                            border: `1px solid ${currentMode === 'light' ? '#7c3aed' : 'rgba(255, 255, 255, 0.1)'}`,
                            backgroundColor: 'transparent',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(124,58,237,0.1)' : 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                        >
                            <MessageCircle size={18} />
                            {t('faq_discord_btn')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
};

export default Faq;
