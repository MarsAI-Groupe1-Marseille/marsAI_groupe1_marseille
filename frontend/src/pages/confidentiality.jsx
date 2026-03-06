import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarryBackground from '../components/StarryBackground.jsx';

const Confidentiality = () => {
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
            title: 'Politique de',
            titleGradient: 'Confidentialité',
            lastUpdate: 'Dernière mise à jour : Mars 2025',
            sections: [
                {
                    title: '1. Introduction',
                    text: 'MarsAI (ci-après "nous", "notre" ou "la Plateforme") s\'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et sauvegardons vos informations lorsque vous visitez notre site web et utilisez nos services.'
                },
                {
                    title: '2. Informations que nous collectons',
                    text: 'Nous collectons les informations suivantes :\n• Informations d\'identification : nom, prénom, adresse email\n• Informations de compte : mot de passe (haché et sécurisé), rôle utilisateur\n• Informations de profil : avatar, bio, spécialités\n• Données de film : métadonnées, sous-titres, affiches, vidéos soumises\n• Données d\'interaction : commentaires, évaluations, historique de navigation\n• Données techniques : adresse IP, type de navigateur, système d\'exploitation, pages visitées\n• Cookies : identifiants de session pour l\'authentification'
                },
                {
                    title: '3. Base légale du traitement',
                    text: 'Nous traitons vos données en vertu des bases légales suivantes :\n• Consentement : vous avez donné votre consentement explicite (inscription, création de compte)\n• Exécution d\'un contrat : les données sont nécessaires pour fournir nos services\n• Conformité légale : nous devons respecter les obligations légales (fiscalité, sécurité)\n• Intérêts légitimes : amélioration de la plateforme, prévention de la fraude, sécurité'
                },
                {
                    title: '4. Utilisation de vos données',
                    text: 'Nous utilisons vos données pour :\n• Créer et gérer votre compte\n• Fournir, maintenir et améliorer la plateforme\n• Personnaliser votre expérience utilisateur\n• Communiquer avec vous (notifications, mises à jour, support)\n• Traiter les paiements (si applicable)\n• Assurer la sécurité et combattre la fraude\n• Analyser les statistiques d\'utilisation\n• Respecter les obligations légales et réglementaires'
                },
                {
                    title: '5. Partage de vos données',
                    text: 'Nous ne vendons jamais vos données personnelles. Cependant, nous pouvons les partager avec :\n• Prestataires de services : hébergement, paiement, email (sous contrats de confidentialité)\n• Autorités légales : si requis par la loi ou pour protéger nos droits\n• Autres utilisateurs : votre nom et avatar peuvent être visibles aux autres utilisateurs (selon les paramètres)\n• Membres du jury : vos données de profil peuvent être accessibles pour l\'évaluation'
                },
                {
                    title: '6. Stockage des données',
                    text: 'Vos données sont stockées sur nos serveurs :\n• Localisation : Scaleway (France), hébergement cloud sécurisé\n• Chiffrement : données sensibles chiffrées en transit et au repos\n• Durée de stockage : aussi longtemps que votre compte est actif, plus 30 jours après suppression (conformément à nos obligations légales)\n• Sauvegardes : effectuées régulièrement pour la continuité de service'
                },
                {
                    title: '7. Sécurité',
                    text: 'Nous mettons en place les mesures de sécurité suivantes :\n• Authentification : cookies sécurisés HttpOnly pour les sessions\n• Protection CSRF : tokens de protection contre les attaques inter-sites\n• Validation : validation des entrées pour prévenir l\'injection de code\n• Mots de passe : hachés avec bcrypt, jamais stockés en clair\n• HTTPS : toutes les communications sont chiffrées\n• Limites de taux : protection contre les attaques par force brute\n• Bien que nous prenions toutes les précautions, aucun système n\'est 100% sécurisé'
                },
                {
                    title: '8. Votre droit à la portabilité des données',
                    text: 'Vous avez le droit de :\n• Accéder à vos données personnelles\n• Demander la correction de données inexactes\n• Demander la suppression de vos données ("droit à l\'oubli")\n• Exporter vos données dans un format lisible (portabilité des données)\n• Retirer votre consentement à tout moment\n• Vous opposer au traitement de vos données\nPour exercer ces droits, contactez-nous à : contact@marsai.fr'
                },
                {
                    title: '9. Cookies et technologies de suivi',
                    text: 'Nous utilisons :\n• Cookies de session : pour l\'authentification et maintenir votre session\n• Stockage local : pour les préférences d\'interface (thème, langue)\n• Cookies d\'analyse : non utilisés actuellement\nVous pouvez désactiver les cookies dans votre navigateur, mais cela peut affecter votre expérience.'
                },
                {
                    title: '10. Retentions des données',
                    text: 'Nous conservons vos données :\n• Comptes actifs : tant que le compte existe\n• Comptes supprimés : 30 jours (période de grace)\n• Logs d\'accès : 90 jours pour sécurité\n• Données de films : selon votre demande ou jusqu\'à fin du concours\nAprès suppression, vos données sont purgées sauf si la loi exige leur conservation.'
                },
                {
                    title: '11. Modifications de cette politique',
                    text: 'Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications seront communiquées par email aux utilisateurs enregistrés. Votre utilisation continue de la plateforme après les modifications implique votre acceptation des nouvelles conditions.'
                },
                {
                    title: '12. Contact et droits RGPD',
                    text: 'Pour toute question concernant cette politique ou pour exercer vos droits RGPD :\n• Email : contact@marsai.fr\n• Adresse : La Plateforme, Marseille, France\n• Délai de réponse : nous répondons dans les 30 jours (conformément au RGPD)\n• Droit de recours : vous pouvez également le droit de porter plainte auprès de la CNIL (Commission Nationale de l\'Informatique et des Libertés)'
                }
            ]
        },
        en: {
            title: 'Privacy',
            titleGradient: 'Policy',
            lastUpdate: 'Last updated: March 2025',
            sections: [
                {
                    title: '1. Introduction',
                    text: 'MarsAI (hereinafter "we", "our" or the "Platform") is committed to protecting your privacy. This privacy policy explains how we collect, use, disclose and store your information when you visit our website and use our services.'
                },
                {
                    title: '2. Information We Collect',
                    text: 'We collect the following information:\n• Identification information: first name, last name, email address\n• Account information: password (hashed and secured), user role\n• Profile information: avatar, bio, specialties\n• Film data: metadata, subtitles, posters, submitted videos\n• Interaction data: comments, ratings, browsing history\n• Technical data: IP address, browser type, operating system, visited pages\n• Cookies: session identifiers for authentication'
                },
                {
                    title: '3. Legal Basis for Processing',
                    text: 'We process your data under the following legal bases:\n• Consent: you have given your explicit consent (registration, account creation)\n• Contract execution: data is necessary to provide our services\n• Legal compliance: we must comply with legal obligations (taxation, security)\n• Legitimate interests: platform improvement, fraud prevention, security'
                },
                {
                    title: '4. Use of Your Data',
                    text: 'We use your data to:\n• Create and manage your account\n• Provide, maintain and improve the platform\n• Personalize your user experience\n• Communicate with you (notifications, updates, support)\n• Process payments (if applicable)\n• Ensure security and combat fraud\n• Analyze usage statistics\n• Comply with legal and regulatory obligations'
                },
                {
                    title: '5. Sharing Your Data',
                    text: 'We never sell your personal data. However, we may share it with:\n• Service providers: hosting, payment, email (under confidentiality agreements)\n• Legal authorities: if required by law or to protect our rights\n• Other users: your name and avatar may be visible to other users (based on settings)\n• Jury members: your profile data may be accessible for evaluation'
                },
                {
                    title: '6. Data Storage',
                    text: 'Your data is stored on our servers:\n• Location: Scaleway (France), secure cloud hosting\n• Encryption: sensitive data encrypted in transit and at rest\n• Storage duration: as long as your account is active, plus 30 days after deletion (in compliance with our legal obligations)\n• Backups: performed regularly for service continuity'
                },
                {
                    title: '7. Security',
                    text: 'We implement the following security measures:\n• Authentication: secure HttpOnly cookies for sessions\n• CSRF protection: tokens to protect against cross-site attacks\n• Validation: input validation to prevent code injection\n• Passwords: hashed with bcrypt, never stored in plain text\n• HTTPS: all communications are encrypted\n• Rate limiting: protection against brute force attacks\n• Although we take every precaution, no system is 100% secure'
                },
                {
                    title: '8. Your Right to Data Portability',
                    text: 'You have the right to:\n• Access your personal data\n• Request correction of inaccurate data\n• Request deletion of your data ("right to be forgotten")\n• Export your data in a readable format (data portability)\n• Withdraw your consent at any time\n• Object to processing of your data\nTo exercise these rights, contact us at: contact@marsai.fr'
                },
                {
                    title: '9. Cookies and Tracking Technologies',
                    text: 'We use:\n• Session cookies: for authentication and maintaining your session\n• Local storage: for interface preferences (theme, language)\n• Analytics cookies: not currently used\nYou can disable cookies in your browser, but this may affect your experience.'
                },
                {
                    title: '10. Data Retention',
                    text: 'We retain your data:\n• Active accounts: as long as the account exists\n• Deleted accounts: 30 days (grace period)\n• Access logs: 90 days for security\n• Film data: based on your request or until end of contest\nAfter deletion, your data is purged unless the law requires its retention.'
                },
                {
                    title: '11. Changes to This Policy',
                    text: 'We may modify this privacy policy at any time. Changes will be communicated by email to registered users. Your continued use of the platform after modifications implies your acceptance of the new terms.'
                },
                {
                    title: '12. Contact and GDPR Rights',
                    text: 'For any questions about this policy or to exercise your GDPR rights:\n• Email: contact@marsai.fr\n• Address: La Plateforme, Marseille, France\n• Response time: we respond within 30 days (in accordance with GDPR)\n• Right of appeal: you also have the right to lodge a complaint with the CNIL (National Commission for Computing and Liberties)'
                }
            ]
        }
    };

    const currentContent = content[lang] || content.fr;

    return (
        <>
        <StarryBackground />
        <div style={{
            minHeight: '100vh',
            backgroundImage: currentMode === 'light'
                ? 'linear-gradient(to bottom right, #ffffff, #f8f7ff)'
                : 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
            color: currentMode === 'light' ? '#333333' : '#ffffff',
            position: 'relative',
            zIndex: 10
        }}>
            {/* Background elements */}
            <div style={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '24rem',
                    height: '24rem',
                    backgroundColor: currentMode === 'light' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '9999px',
                    filter: 'blur(96px)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '24rem',
                    height: '24rem',
                    backgroundColor: currentMode === 'light' ? 'rgba(234, 88, 170, 0.05)' : 'rgba(217, 70, 239, 0.1)',
                    borderRadius: '9999px',
                    filter: 'blur(96px)'
                }}></div>
            </div>

            <main style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '2rem',
                paddingBottom: '3rem'
            }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginBottom: '1rem'
                        }}>
                            <Shield size={32} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                            <h1 style={{
                                fontSize: currentMode === 'light' ? '2rem' : '2.5rem',
                                fontWeight: 'bold'
                            }}>
                                <span style={{ color: currentMode === 'light' ? '#000000' : '#ffffff' }}>{currentContent.title}</span>
                                <br />
                                {currentMode === 'light' ? (
                                    <span style={{
                                        display: 'inline-block',
                                        color: '#7c3aed',
                                        marginLeft: '0.25rem'
                                    }}>
                                        {currentContent.titleGradient}
                                    </span>
                                ) : (
                                    <span style={{
                                        background: 'linear-gradient(to right, #a78bfa, #f472b6, #f472b6)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        display: 'inline-block'
                                    }}>
                                        {currentContent.titleGradient}
                                    </span>
                                )}
                            </h1>
                        </div>
                        <p style={{
                            fontSize: '0.875rem',
                            color: currentMode === 'light' ? '#999999' : '#999999',
                            marginBottom: '2rem'
                        }}>{currentContent.lastUpdate}</p>
                    </div>

                    {/* Content sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {currentContent.sections.map((section, idx) => (
                            <div
                                key={idx}
                                style={{
                                    borderRadius: '0.75rem',
                                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                                    backdropFilter: 'blur(4px)',
                                    padding: '1.5rem',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.5)' : 'rgba(139, 92, 246, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                                }}
                            >
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 'bold',
                                    color: currentMode === 'light' ? '#7c3aed' : '#a78bfa',
                                    marginBottom: '0.75rem'
                                }}>{section.title}</h2>
                                <p style={{
                                    color: currentMode === 'light' ? '#666666' : '#d1d5db',
                                    lineHeight: '1.625',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {section.text}
                                </p>
                            </div>
                        ))}!
                    </div>

                    {/* Footer notice */}
                    <div style={{
                        marginTop: '3rem',
                        borderRadius: '0.75rem',
                        border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                        backgroundColor: currentMode === 'light' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.05)',
                        backdropFilter: 'blur(4px)',
                        padding: '1.5rem'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: currentMode === 'light' ? '#666666' : '#999999',
                            textAlign: 'center'
                        }}>
                            Cette politique de confidentialité s'applique à tous les services fournis par MarsAI. En utilisant notre plateforme, vous acceptez les conditions énoncées dans cette politique.
                        </p>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
};

export default Confidentiality;
