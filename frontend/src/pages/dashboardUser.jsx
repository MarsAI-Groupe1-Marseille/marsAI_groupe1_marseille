import React, { useState,useEffect } from "react";
import { Users, Eye, Pencil, Trash2, UserPlus, X } from "lucide-react";
import axios from '../config/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Dashboard User Component - Force recompile


function BadgeAttribution({ role, t, currentMode = 'dark' }) {
   
    const styles = {
        admin: {
            light: { background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.3)' },
            dark: { background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }
        },
        jury: {
            light: { background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.3)' },
            dark: { background: 'rgba(96, 165, 250, 0.2)', color: '#93c5fd', border: '1px solid rgba(96, 165, 250, 0.3)' }
        },
        moderator: {
            light: { background: 'rgba(168, 85, 247, 0.1)', color: '#7c3aed', border: '1px solid rgba(168, 85, 247, 0.3)' },
            dark: { background: 'rgba(196, 181, 253, 0.2)', color: '#e9d5ff', border: '1px solid rgba(147, 51, 234, 0.4)' }
        },
    };

    const labels = {
        admin: t ? t('dashboard_user_admin') : "Admin",
        jury: t ? t('dashboard_user_jury') : "Jury",
        moderator: t ? t('dashboard_user_moderator') : "Modérateur",
    };

    const style = styles[role]?.[currentMode] || styles[role]?.dark;

    return (
        <span style={{
            fontSize: '0.875rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.375rem',
            paddingBottom: '0.375rem',
            borderRadius: '9999px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            backgroundColor: style?.background,
            color: style?.color,
            border: style?.border
        }}>
            {labels[role] || role}
        </span>
    );
}

function UserProfileModal({ user, isOpen, onClose, t, currentMode = 'dark' }) {
    if (!isOpen || !user) return null;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
                borderRadius: '0.75rem',
                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                maxWidth: '28rem',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Header avec fermeture */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.5rem',
                    borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: currentMode === 'light' ? '#000000' : '#ffffff'
                    }}>
                        {t('dashboard_user_profile') || 'Profil Utilisateur'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                            border: 'none',
                            borderRadius: '0.5rem',
                            transition: 'all 0.2s ease',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#323232';
                            e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : '#262626';
                            e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenu du modal */}
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    {/* Avatar */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            width: '6rem',
                            height: '6rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #a855f7, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid #7c3aed',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            marginBottom: '1rem'
                        }}>
                            {user.avatar_url ? (
                                <img src={`${user.avatar_url}?t=${Date.now()}`} alt={user.full_name} style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }} />
                            ) : (
                                <span style={{
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    fontSize: '1.875rem'
                                }}>
                                    {getInitials(user.full_name)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Informations */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {/* Nom complet */}
                        <div>
                            <label style={{
                                fontSize: '0.75rem',
                                color: currentMode === 'light' ? '#999999' : '#737373',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '600'
                            }}>
                                {t('dashboard_user_fullname')}
                            </label>
                            <p style={{
                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                fontWeight: '600',
                                marginTop: '0.25rem'
                            }}>
                                {user.full_name}
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{
                                fontSize: '0.75rem',
                                color: currentMode === 'light' ? '#999999' : '#737373',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '600'
                            }}>
                                {t('dashboard_user_email')}
                            </label>
                            <p style={{
                                color: currentMode === 'light' ? '#666666' : '#d4d4d8',
                                marginTop: '0.25rem',
                                wordBreak: 'break-all'
                            }}>
                                {user.email}
                            </p>
                        </div>

                        {/* Rôle */}
                        <div>
                            <label style={{
                                fontSize: '0.75rem',
                                color: currentMode === 'light' ? '#999999' : '#737373',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '600'
                            }}>
                                {t('dashboard_user_role')}
                            </label>
                            <div style={{ marginTop: '0.25rem' }}>
                                <BadgeAttribution role={user.role} t={t} currentMode={currentMode} />
                            </div>
                        </div>

                        {/* Spécialité */}
                        {user.specialite && (
                            <div>
                                <label style={{
                                    fontSize: '0.75rem',
                                    color: currentMode === 'light' ? '#999999' : '#737373',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontWeight: '600'
                                }}>
                                    {t('dashboard_user_specialite') || 'Spécialités'}
                                </label>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    marginTop: '0.5rem'
                                }}>
                                    {Array.isArray(user.specialite) 
                                        ? user.specialite.map((spec, idx) => (
                                            <span key={idx} style={{
                                                backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(168, 85, 247, 0.3)',
                                                color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff',
                                                paddingLeft: '0.75rem',
                                                paddingRight: '0.75rem',
                                                paddingTop: '0.25rem',
                                                paddingBottom: '0.25rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem',
                                                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(147, 51, 234, 0.5)'}`
                                            }}>
                                                {spec}
                                            </span>
                                        ))
                                        : typeof user.specialite === 'string'
                                        ? (() => {
                                            try {
                                                const specs = JSON.parse(user.specialite);
                                                return specs.map((spec, idx) => (
                                                    <span key={idx} style={{
                                                        backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(168, 85, 247, 0.3)',
                                                        color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff',
                                                        paddingLeft: '0.75rem',
                                                        paddingRight: '0.75rem',
                                                        paddingTop: '0.25rem',
                                                        paddingBottom: '0.25rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem',
                                                        border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(147, 51, 234, 0.5)'}`
                                                    }}>
                                                        {spec}
                                                    </span>
                                                ));
                                            } catch {
                                                return <span style={{
                                                    backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(168, 85, 247, 0.3)',
                                                    color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff',
                                                    paddingLeft: '0.75rem',
                                                    paddingRight: '0.75rem',
                                                    paddingTop: '0.25rem',
                                                    paddingBottom: '0.25rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.875rem',
                                                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(147, 51, 234, 0.5)'}`
                                                }}>
                                                    {user.specialite}
                                                </span>;
                                            }
                                        })()
                                        : null
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bouton Fermer */}
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            borderRadius: '0.5rem',
                            background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        {t('dashboard_user_close') || 'Fermer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormEdition({ user, editingData, setEditingData, onSave, onCancel, isLoading, t, avatarFile, setAvatarFile, currentMode = 'dark' }) {
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);

    const handleAvatarChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('✅ Form submitted!');
        onSave(e);
    };

    return (
        <form onSubmit={handleFormSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            width: '100%'
        }}>
            {/* Section Avatar */}
            <div style={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <label style={{
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                    marginBottom: '0.75rem',
                    display: 'block'
                }}>
                    {t('dashboard_user_avatar') || 'Avatar'}
                </label>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    {/* Aperçu de l'avatar */}
                    <div style={{
                        width: '6rem',
                        height: '6rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(to bottom right, #a855f7, #9333ea)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #7c3aed',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                    }}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar preview" style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }} />
                        ) : (
                            <span style={{
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '1.5rem'
                            }}>
                                {user?.full_name
                                    ? user.full_name
                                        .split(' ')
                                        .map(n => n[0])
                                        .join('')
                                        .toUpperCase()
                                    : 'U'}
                            </span>
                        )}
                    </div>
                    
                    {/* Input file pour l'avatar */}
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#7c3aed',
                        cursor: 'pointer',
                        color: '#ffffff',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                    >
                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('dashboard_user_change_avatar') || 'Changer l\'avatar'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                <label style={{
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                    marginBottom: '0.25rem'
                }}>
                    {t('dashboard_user_fullname')}
                </label>
                <input
                    value={editingData?.full_name || ''}
                    onChange={(e) => setEditingData({ ...editingData, full_name: e.target.value })}
                    style={{
                        width: '100%',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#7c3aed';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.2)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder={t('dashboard_user_fullname')}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <label style={{
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                    marginBottom: '0.25rem'
                }}>
                    {t('dashboard_user_email')}
                </label>
                <input
                    value={editingData?.email || ''}
                    onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                    style={{
                        width: '100%',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#7c3aed';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.2)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder={t('dashboard_user_email')}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <label style={{
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                    marginBottom: '0.25rem'
                }}>
                    {t('dashboard_user_role')}
                </label>
                <select
                    value={editingData?.role || ''}
                    onChange={(e) => setEditingData({ ...editingData, role: e.target.value })}
                    style={{
                        width: '100%',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        color: currentMode === 'light' ? '#000000' : '#ffffff',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#7c3aed';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.2)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <option value="admin">{t('dashboard_user_admin')}</option>
                    <option value="jury">{t('dashboard_user_jury')}</option>
                    <option value="moderator">{t('dashboard_user_moderator')}</option>
                </select>
            </div>

            <div style={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1rem'
            }}>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    style={{
                        width: '100%',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#404040',
                        border: 'none',
                        color: currentMode === 'light' ? '#333333' : '#f5f5f5',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: isLoading ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#d4d4d4' : '#505050')}
                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#404040')}
                    disabled={isLoading}
                >
                    {t('dashboard_user_cancel')}
                </button>

                <button 
                    type="submit" 
                    style={{
                        width: '100%',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                        border: 'none',
                        color: '#ffffff',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'opacity 0.2s ease',
                        opacity: isLoading ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.opacity = '1')}
                    disabled={isLoading}
                >
                    {isLoading ? t('dashboard_user_saving') : t('dashboard_user_save')}
                </button>
            </div>
        </form>
    );
}


function UserRow({ user, isEditing, toggleEdit, editingData, setEditingData, onSaveUser, onDeleteUser, onViewUser, isLoading, t, avatarFile, setAvatarFile, currentMode = 'dark' }) {
    
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.02)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}>                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flex: '0 0 auto'
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(to bottom right, #a855f7, #9333ea)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #7c3aed',
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        {user.avatar_url ? (
                            <img src={`${user.avatar_url}?t=${Date.now()}`} alt={user.full_name} style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }} />
                        ) : (
                            <span style={{
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                            }}>
                                {getInitials(user.full_name)}
                            </span>
                        )}
                    </div>
                    {/* Infos */}
                    <div>
                        <p style={{
                            fontWeight: '600',
                            color: currentMode === 'light' ? '#000000' : '#ffffff'
                        }}>
                            {user.full_name}
                        </p>
                        <p style={{
                            fontSize: '0.875rem',
                            color: currentMode === 'light' ? '#999999' : '#737373'
                        }}>
                            {user.email}
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: '0 0 auto'
                }}>
                    <BadgeAttribution role={user.role} t={t} currentMode={currentMode} />
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                    marginLeft: 'auto',
                    flex: '0 0 auto'
                }}>
                    <button 
                        onClick={() => onViewUser(user)} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#262626',
                            border: 'none',
                            color: currentMode === 'light' ? '#333333' : '#a3a3a3',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#d4d4d4' : '#323232';
                            e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#262626';
                            e.currentTarget.style.color = currentMode === 'light' ? '#333333' : '#a3a3a3';
                        }}
                    >
                        <Eye size={16} />
                        {t('dashboard_user_see')}
                    </button>

                    <button 
                        onClick={() => {
                            toggleEdit(user.id);
                            if (!editingData?.id || editingData.id !== user.id) {
                                setEditingData({ id: user.id, full_name: user.full_name, email: user.email, role: user.role });
                            }
                        }} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#262626',
                            border: 'none',
                            color: currentMode === 'light' ? '#333333' : '#a3a3a3',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(to right, #7c3aed, #ec4899)';
                            e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#262626';
                            e.currentTarget.style.color = currentMode === 'light' ? '#333333' : '#a3a3a3';
                        }}
                    >
                        <Pencil size={16} />
                        {t('dashboard_user_edit')}
                    </button>

                    <button 
                        onClick={() => onDeleteUser(user.id, user.full_name)} 
                        disabled={isLoading} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#262626',
                            border: 'none',
                            color: currentMode === 'light' ? '#d32f2f' : '#f87171',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                            fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#dc2626') && (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#262626';
                            e.currentTarget.style.color = currentMode === 'light' ? '#d32f2f' : '#f87171';
                        }}
                    >
                        <Trash2 size={16} />
                        Supprimer
                    </button>
                </div>
            </div>

            {isEditing && (
                <div style={{
                    backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#0f0f0f',
                    padding: '1.5rem',
                    borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`
                }}>
                    <FormEdition 
                        user={user} 
                        editingData={editingData}
                        setEditingData={setEditingData}
                        onSave={() => onSaveUser(user.id)}
                        onCancel={() => toggleEdit(user.id)}
                        isLoading={isLoading}
                        t={t}
                        avatarFile={avatarFile}
                        setAvatarFile={setAvatarFile}
                        currentMode={currentMode}
                    />
                </div>
            )}
        </>
    );
}

export default function DashboardUser() {
    const { t } = useLanguage();
    const { user: authUser } = useAuth();
    const [currentMode, setCurrentMode] = useState('dark');
    const [usersList, setUsersList] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingData, setEditingData] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "jury" });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // ========================================================================
    // EFFET: Détection du mode clair/sombre
    // ========================================================================
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setCurrentMode(document.documentElement.getAttribute('data-mode') || 'dark');
        });
        
        observer.observe(document.documentElement, { attributes: true });
        setCurrentMode(document.documentElement.getAttribute('data-mode') || 'dark');
        
        return () => observer.disconnect();
    }, []);

    const toggleEdit = (id) => {
        setEditingUserId(prev => (prev === id ? null : id));
        if (editingUserId === id) {
            setAvatarFile(null);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleUpdateUser = async (userId) => {
        if (!editingData || editingData.id !== userId) return;

        setIsLoading(true);
        console.log("=== DÉBUT MODIFICATION USER ===");
        console.log("UserID à modifier:", userId);
        console.log("AuthUser ID:", authUser?.id);
        console.log("Editing data:", editingData);
        
        try {
            const formData = new FormData();
            formData.append('full_name', editingData.full_name);
            formData.append('email', editingData.email);
            
            // Seulement ajouter le role si on modifie quelqu'un d'autre
            if (userId !== authUser?.id) {
                formData.append('role', editingData.role);
            }
            
            if (avatarFile) {
                formData.append('avatar', avatarFile);
                console.log("Avatar file ajouté:", avatarFile.name, "Size:", avatarFile.size);
            } else {
                console.log("❌ Pas d'avatar file sélectionné");
            }

            // Choisir l'endpoint en fonction de si c'est l'utilisateur courant ou un autre
            const endpoint = userId === authUser?.id ? `/users/me` : `/users/${userId}`;
            
            console.log("Envoi de la requête PUT vers:", endpoint);
            console.log("FormData contient:", {
                full_name: editingData.full_name,
                email: editingData.email,
                role: userId !== authUser?.id ? editingData.role : '(non modifié)',
                avatar: avatarFile ? avatarFile.name : null
            });

            const response = await axios.put(endpoint, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("=== RÉPONSE DU SERVEUR ===");
            console.log("Réponse complète:", response.data);
            console.log("Avatar URL reçu:", response.data.user?.avatar_url);
            
            // Mettre à jour la liste localement
            const updatedUsersList = usersList.map(user => 
                user.id === userId ? { ...user, ...response.data.user } : user
            );
            setUsersList(updatedUsersList);
            console.log("Liste des utilisateurs mise à jour localement");

            // Mettre à jour le selectedUser si c'est le même utilisateur qui est visualisé
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({
                    ...selectedUser,
                    ...response.data.user
                });
                console.log("Selected user mis à jour dans le modal");
            }

            // Si c'est l'utilisateur courant qui s'auto-modifie, refetch /auth/me
            if (userId === authUser?.id) {
                console.log("🔄 Refetching utilisateur connecté depuis API (c'est le courant)");
                try {
                    const meResponse = await axios.get('/auth/me');
                    console.log("✅ Refetch /auth/me réussi:", meResponse.data);
                    if (meResponse?.data) {
                        console.log("Avatar URL du user connecté:", meResponse.data.avatar_url);
                        localStorage.setItem('user', JSON.stringify(meResponse.data));
                        console.log("💾 localStorage mis à jour avec les données fraîches");
                        console.log("🔔 DISPATCHING: userAvatarUpdated avec données:", meResponse.data);
                        window.dispatchEvent(new CustomEvent('userAvatarUpdated', { detail: meResponse.data }));
                        console.log("✅ EVENT DISPATCHED");
                    }
                } catch (refetchError) {
                    console.error("⚠️ Erreur lors du refetch /auth/me:", refetchError.response?.data || refetchError.message);
                }
            }

            console.log("✅ Utilisateur mis à jour avec succès");
            alert(t('dashboard_user_updated'));
            setEditingUserId(null);
            setEditingData(null);
            setAvatarFile(null);
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour de l'utilisateur:", error);
            console.error("Response data:", error.response?.data);
            console.error("Error message:", error.message);
            alert(`${t('dashboard_user_error')} : ${error.response?.data?.error || error.message || t('dashboard_user_error_update')}`);
        } finally {
            setIsLoading(false);
            console.log("=== FIN MODIFICATION USER ===\n");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`${t('dashboard_user_confirm_delete')} ${userName} ${t('dashboard_user_irreversible')}`)) {
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(`/users/${userId}`);

            // Mettre à jour la liste en supprimant l'utilisateur
            setUsersList(prev => prev.filter(user => user.id !== userId));

            console.log("Utilisateur supprimé avec succès");
            alert(t('dashboard_user_success'));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            alert(`${t('dashboard_user_error')} : ${error.response?.data?.error || t('dashboard_user_error_delete')}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Appel à l'API pour créer et inviter l'utilisateur
            const response = await axios.post('/users/invite', {
                email: newUser.email,
                full_name: newUser.fullName,
                role: newUser.role
            });
            
            // Afficher un message de succès
            console.log("Utilisateur créé avec succès :", response.data);
            alert(`${t('dashboard_user_invited')} ${newUser.email} !`);
            
            // Recharger la liste des utilisateurs
            const usersResponse = await axios.get('/users');
            setUsersList(usersResponse.data);
            
            // Réinitialiser le formulaire
            setNewUser({ fullName: "", email: "", role: "jury" });
            setShowAddForm(false);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            alert(`${t('dashboard_user_error')} : ${error.response?.data?.error || t('dashboard_user_error_create')}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Appel à l'API pour récupérer les utilisateurs
        axios.get('/users')     
            .then(response => {
                console.log("Utilisateurs récupérés :", response.data);
                setUsersList(response.data); // On suppose que l'API renvoie un tableau d'utilisateurs
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            });
    }, []);
    return (
        <div style={{
            minHeight: '100vh',
            background: currentMode === 'light'
                ? '#ffffff'
                : 'linear-gradient(to bottom right, #0f0f0f, #171717, #0f0f0f)',
            color: currentMode === 'light' ? '#000000' : '#ffffff'
        }}>
            <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto space-y-8">

            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderRadius: '1rem',
                background: currentMode === 'light'
                    ? 'linear-gradient(to right, #7c3aed, #c43bb5, #ec4899)'
                    : 'linear-gradient(to right, #7c3aed, #ec489b, #ec4899)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <Users style={{ color: '#ffffff' }} />
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }}>
                        {t('dashboard_user_title')}
                    </h1>
                </div>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                        width: '100%',
                        marginTop: '1rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <UserPlus size={18} />
                    {t('dashboard_user_add')}
                </button>
            </header>

            {showAddForm && (
                <form
                    onSubmit={handleAddUser}
                    style={{
                        backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
                        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                    }}>
                        <label style={{
                            fontSize: '0.875rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            marginBottom: '0.25rem'
                        }}>
                            {t('dashboard_user_fullname')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('dashboard_user_fullname')}
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1rem',
                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                fontFamily: 'inherit',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#7c3aed';
                                e.currentTarget.style.outline = 'none';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            required
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                    }}>
                        <label style={{
                            fontSize: '0.875rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            marginBottom: '0.25rem'
                        }}>
                            {t('dashboard_user_email')}
                        </label>
                        <input
                            type="email"
                            placeholder={t('dashboard_user_email')}
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1rem',
                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                fontFamily: 'inherit',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#7c3aed';
                                e.currentTarget.style.outline = 'none';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            required
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                    }}>
                        <label style={{
                            fontSize: '0.875rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            marginBottom: '0.25rem'
                        }}>
                            {t('dashboard_user_role')}
                        </label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1rem',
                                color: currentMode === 'light' ? '#000000' : '#ffffff',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#7c3aed';
                                e.currentTarget.style.outline = 'none';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <option value="admin">{t('dashboard_user_admin')}</option>
                            <option value="jury">{t('dashboard_user_jury')}</option>
                            <option value="moderator">{t('dashboard_user_moderator')}</option>
                        </select>
                    </div>

                    <div style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                        marginTop: '1rem'
                    }}>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#404040',
                                border: 'none',
                                color: currentMode === 'light' ? '#333333' : '#f5f5f5',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#d4d4d4' : '#505050';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                            }}
                            disabled={isLoading}
                        >
                            {t('dashboard_user_cancel')}
                        </button>

                        <button 
                            type="submit" 
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.5rem',
                                background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                                border: 'none',
                                color: '#ffffff',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'opacity 0.2s ease',
                                opacity: isLoading ? 0.5 : 1,
                                width: '100%'
                            }}
                            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = '0.85')}
                            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.opacity = '1')}
                            disabled={isLoading}
                        >
                            {isLoading ? t('dashboard_user_sending') : t('dashboard_user_add_invite')}
                        </button>
                    </div>
                </form>
            )}
            <section style={{
                backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                borderRadius: '1rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '1rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                    borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`
                }}>
                    <span>{t('dashboard_user_column_user')}</span>
                    <span style={{ textAlign: 'center' }}>{t('dashboard_user_column_role')}</span>
                    <span style={{ textAlign: 'right', gridColumn: 'span 2' }}>{t('dashboard_user_column_actions')}</span>
                </div>

                {usersList.map((user) => (
                    <UserRow 
                        key={user.id}
                        user={user} 
                        isEditing={editingUserId === user.id}
                        toggleEdit={toggleEdit}
                        editingData={editingData}
                        setEditingData={setEditingData}
                        onSaveUser={handleUpdateUser}
                        onDeleteUser={handleDeleteUser}
                        onViewUser={handleViewUser}
                        isLoading={isLoading}
                        t={t}
                        avatarFile={avatarFile}
                        setAvatarFile={setAvatarFile}
                        currentMode={currentMode}
                    />
                ))}
            </section>

                </div>
            </main>

            {/* Modal de visualisation du profil utilisateur */}
            <UserProfileModal 
                user={selectedUser} 
                isOpen={showViewModal} 
                onClose={() => setShowViewModal(false)} 
                t={t}
                currentMode={currentMode}
            />
        </div>
    );
}