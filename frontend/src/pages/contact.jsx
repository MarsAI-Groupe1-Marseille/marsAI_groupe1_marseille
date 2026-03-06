import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarryBackground from '../components/StarryBackground.jsx';

const Contact = () => {
    const { t } = useLanguage();
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const [currentMode, setCurrentMode] = useState('dark');
    const mapRef = React.useRef(null);

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

    useEffect(() => {
        // Charger Leaflet et initialiser la map
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(style);

            // Initialiser la map après chargement de Leaflet
            setTimeout(() => {
                if (mapRef.current && window.L) {
                    const map = window.L.map(mapRef.current).setView([43.3192, 5.3699], 14);
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19,
                    }).addTo(map);
                    window.L.marker([43.3192, 5.3699]).addTo(map)
                        .bindPopup('<b>La Plateforme</b><br>Marseille, France')
                        .openPopup();
                }
            }, 100);
        };
        document.head.appendChild(script);
    }, [currentMode]);

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
            <div style={{ maxWidth: '64rem', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '4rem', paddingBottom: '4rem' }}>

                {/* Hero */}
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
                        <Mail size={32} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.25rem',
                        fontWeight: '900',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        letterSpacing: '0.025em',
                        marginBottom: '1.5rem'
                    }}>
                        {t('contact_title').split(' ')[0]}{' '}
                        {currentMode === 'light' ? (
                            <span style={{
                                display: 'inline-block',
                                color: '#7c3aed',
                                marginLeft: '0.25rem'
                            }}>
                                {t('contact_title').split(' ').slice(1).join(' ')}
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
                                {t('contact_title').split(' ').slice(1).join(' ')}
                            </span>
                        )}
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        color: currentMode === 'light' ? '#666666' : '#94a3b8',
                        maxWidth: '42rem',
                        margin: '0 auto'
                    }}>
                        {t('contact_subtitle')}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', gridTemplateColumns: currentMode === 'light' ? 'repeat(1, 1fr)' : undefined, '@media (min-width: 1024px)': { gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' } }}>

                    {/* Infos de contact */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / 2' }}>
                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '1.5rem',
                            backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'} `,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{
                                padding: '0.5rem',
                                backgroundColor: currentMode === 'light' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '9999px',
                                flexShrink: 0
                            }}>
                                <Mail size={20} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                            </div>
                            <div>
                                <h3 style={{
                                    fontWeight: '600',
                                    color: currentMode === 'light' ? '#000000' : '#ffffff',
                                    marginBottom: '0.25rem'
                                }}>{t('contact_email_label')}</h3>
                                <a href="mailto:contact@marsai.fr" style={{
                                    color: currentMode === 'light' ? '#7c3aed' : '#94a3b8',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    transition: 'color 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.color = currentMode === 'light' ? '#6d28d9' : '#cbd5e1'}
                                onMouseLeave={(e) => e.target.style.color = currentMode === 'light' ? '#7c3aed' : '#94a3b8'}
                                >
                                    contact@marsai.fr
                                </a>
                            </div>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '1.5rem',
                            backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{
                                padding: '0.5rem',
                                backgroundColor: currentMode === 'light' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '9999px',
                                flexShrink: 0
                            }}>
                                <MessageCircle size={20} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                            </div>
                            <div>
                                <h3 style={{
                                    fontWeight: '600',
                                    color: currentMode === 'light' ? '#000000' : '#ffffff',
                                    marginBottom: '0.25rem'
                                }}>{t('contact_discord_label')}</h3>
                                <p style={{
                                    color: currentMode === 'light' ? '#666666' : '#94a3b8',
                                    fontSize: '0.875rem'
                                }}>
                                    {t('contact_discord_text')}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '1.5rem',
                            backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{
                                padding: '0.5rem',
                                backgroundColor: currentMode === 'light' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '9999px',
                                flexShrink: 0
                            }}>
                                <MapPin size={20} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                            </div>
                            <div>
                                <h3 style={{
                                    fontWeight: '600',
                                    color: currentMode === 'light' ? '#000000' : '#ffffff',
                                    marginBottom: '0.25rem'
                                }}>{t('contact_location_label')}</h3>
                                <p style={{
                                    color: currentMode === 'light' ? '#666666' : '#94a3b8',
                                    fontSize: '0.875rem'
                                }}>{t('contact_location_text')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div style={{ gridColumn: '1 / -1', '@media (min-width: 1024px)': { gridColumn: 'span 2' } }}>
                        {sent ? (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2.5rem',
                                borderRadius: '1.5rem',
                                backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                                textAlign: 'center',
                                gap: '1rem'
                            }}>
                                <CheckCircle size={48} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                                }}>{t('contact_form_sent_title')}</h2>
                                <p style={{
                                    color: currentMode === 'light' ? '#666666' : '#94a3b8'
                                }}>{t('contact_form_sent_message')}</p>
                                <button
                                    onClick={() => setSent(false)}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '9999px',
                                        backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                        color: currentMode === 'light' ? '#7c3aed' : '#a78bfa',
                                        border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139, 92, 246, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139, 92, 246, 0.2)';
                                    }}
                                >
                                    {t('contact_form_send_another')}
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    padding: '2rem',
                                    borderRadius: '1.5rem',
                                    backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.25rem'
                                }}
                            >
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                        <label htmlFor="name" style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: currentMode === 'light' ? '#666666' : '#cbd5e1'
                                        }}>{t('contact_form_name_label')}</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder={t('contact_form_name_placeholder')}
                                            style={{
                                                borderRadius: '0.75rem',
                                                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.4)',
                                                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.875rem',
                                                outline: 'none',
                                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                                transition: 'all 0.3s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139, 92, 246, 0.6)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                        <label htmlFor="email" style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: currentMode === 'light' ? '#666666' : '#cbd5e1'
                                        }}>{t('contact_form_email_label')}</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder={t('contact_form_email_placeholder')}
                                            style={{
                                                borderRadius: '0.75rem',
                                                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.4)',
                                                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.875rem',
                                                outline: 'none',
                                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                                transition: 'all 0.3s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139, 92, 246, 0.6)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                    <label htmlFor="subject" style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: currentMode === 'light' ? '#666666' : '#cbd5e1'
                                    }}>{t('contact_form_subject_label')}</label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder={t('contact_form_subject_placeholder')}
                                        style={{
                                            borderRadius: '0.75rem',
                                            backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.4)',
                                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            padding: '0.75rem 1rem',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            color: currentMode === 'light' ? '#000000' : '#ffffff',
                                            transition: 'all 0.3s',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139, 92, 246, 0.6)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                    <label htmlFor="message" style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: currentMode === 'light' ? '#666666' : '#cbd5e1'
                                    }}>{t('contact_form_message_label')}</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder={t('contact_form_message_placeholder')}
                                        style={{
                                            borderRadius: '0.75rem',
                                            backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.4)',
                                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            padding: '0.75rem 1rem',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            color: currentMode === 'light' ? '#000000' : '#ffffff',
                                            transition: 'all 0.3s',
                                            resize: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139, 92, 246, 0.6)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        alignSelf: 'flex-end',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 2rem',
                                        borderRadius: '9999px',
                                        backgroundColor: currentMode === 'light' ? '#7c3aed' : '#7c3aed',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = currentMode === 'light' ? '#6d28d9' : '#6d28d9';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = currentMode === 'light' ? '#7c3aed' : '#7c3aed';
                                    }}
                                >
                                    <Send size={16} />
                                    {t('contact_form_send_button')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div style={{ marginTop: '4rem' }}>
                    <h2 style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        {t('contact_location_label')}
                    </h2>
                    <div 
                        ref={mapRef}
                        style={{
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                            backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                            minHeight: '400px'
                        }}
                    ></div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Contact;
