import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarryBackground from '../components/StarryBackground.jsx';

const Legal = () => {
    const { lang } = useLanguage();
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

    const content = {
        fr: {
            title: 'Mentions',
            titleGradient: 'Légales',
            sections: [
                {
                    title: '1. Éditeur du site',
                    text: 'Le site MarsAI est édité par l\'équipe MarsAI Groupe 1 Marseille.\nAdresse : La Plateforme, Marseille, France.\nEmail : contact@marsai.fr'
                },
                {
                    title: '2. Hébergement',
                    text: 'Ce site est hébergé par [Nom de l\'hébergeur], situé à [Adresse de l\'hébergeur].\nTéléphone : [Numéro de téléphone de l\'hébergeur].'
                },
                {
                    title: '3. Propriété intellectuelle',
                    text: 'Le contenu de ce site (textes, images, vidéos, etc.) est la propriété de MarsAI sauf mention contraire. Toute reproduction, distribution, modification ou publication de ces différents éléments est strictement interdite sans notre accord exprès par écrit.'
                },
                {
                    title: '4. Données personnelles',
                    text: 'Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d\'un droit d\'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ce droit en nous contactant à l\'adresse email mentionnée ci-dessus.'
                }
            ]
        },
        en: {
            title: 'Legal',
            titleGradient: 'Notice',
            sections: [
                {
                    title: '1. Site Editor',
                    text: 'The MarsAI website is edited by the MarsAI Groupe 1 Marseille team.\nAddress: La Plateforme, Marseille, France.\nEmail: contact@marsai.fr'
                },
                {
                    title: '2. Hosting',
                    text: 'This website is hosted by [Hosting Provider Name], located at [Hosting Provider Address].\nPhone: [Hosting Provider Phone Number].'
                },
                {
                    title: '3. Intellectual Property',
                    text: 'The content of this website (texts, images, videos, etc.) is the property of MarsAI unless otherwise stated. Any reproduction, distribution, modification or publication of these elements is strictly prohibited without our express written consent.'
                },
                {
                    title: '4. Personal Data',
                    text: 'In accordance with the General Data Protection Regulation (GDPR), you have the right to access, correct and delete data concerning you. You can exercise this right by contacting us at the email address mentioned above.'
                }
            ]
        }
    };

    const current = lang === 'en' ? content.en : content.fr;
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
                        <Scale size={32} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.25rem',
                        fontWeight: '900',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        letterSpacing: '0.025em',
                        marginBottom: '1.5rem'
                    }}>
                        {current.title}{' '}
                        {currentMode === 'light' ? (
                            <span style={{
                                display: 'inline-block',
                                color: '#7c3aed',
                                marginLeft: '0.25rem'
                            }}>
                                {current.titleGradient}
                            </span>
                        ) : (
                            <span style={{
                                display: 'inline-block',
                                background: 'linear-gradient(to right, #a78bfa, #d8b4fe)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginLeft: '0.25rem'
                            }}>
                                {current.titleGradient}
                            </span>
                        )}
                    </h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {current.sections.map((section, index) => (
                        <section key={index} style={{
                            padding: '2rem',
                            borderRadius: '1rem',
                            backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(30, 41, 59, 0.5)',
                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                marginBottom: '1rem'
                            }}>{section.title}</h2>
                            <p style={{
                                color: currentMode === 'light' ? '#666666' : '#94a3b8',
                                lineHeight: '1.625',
                                whiteSpace: 'pre-line'
                            }}>
                                {section.text}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default Legal;
