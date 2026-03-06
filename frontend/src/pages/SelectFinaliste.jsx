import React, { useEffect, useState, useRef } from "react";
import {
  Film, MessageSquare, Check, X,
  Trophy, Award, Plus, Search,
  ThumbsUp, AlertCircle
} from "lucide-react";
import axios from "../config/axiosConfig";
import { useLanguage } from "../context/LanguageContext";

/* ─── GÉNÉRATEUR DE COULEURS D'AVATAR ─── */
function getInitialColors(initials) {
  const colorMap = {
    MC: "from-violet-500 to-purple-700",
    PR: "from-blue-500 to-blue-700",
    LS: "from-emerald-500 to-teal-700",
    HB: "from-amber-500 to-orange-700",
    CV: "from-rose-500 to-pink-700",
    JD: "from-cyan-500 to-blue-700",
    AB: "from-pink-500 to-rose-700",
    CD: "from-indigo-500 to-purple-700",
    EF: "from-lime-500 to-emerald-700",
    GH: "from-orange-500 to-amber-700"
  };
  if (colorMap[initials]) return colorMap[initials];
  
  // Générer une couleur basée sur le hash des initiales
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palettes = [
    "from-indigo-500 to-purple-700",
    "from-pink-500 to-red-700",
    "from-cyan-500 to-teal-700",
    "from-lime-500 to-green-700",
    "from-orange-500 to-red-700",
    "from-fuchsia-500 to-pink-700",
    "from-sky-500 to-blue-700",
    "from-violet-500 to-indigo-700"
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

/* ─── COMPOSANTS UTILITAIRES ─── */
function Avatar({ initials, size = "md", currentMode = 'dark' }) {
  const sizes = { sm: { w: '32px', h: '32px', textSize: '0.75rem' }, md: { w: '40px', h: '40px', textSize: '0.875rem' } };
  const s = sizes[size];
  return (
    <div style={{
      width: s.w,
      height: s.h,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a855f7, #9333ea)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#ffffff',
      flexShrink: 0,
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      fontSize: s.textSize
    }}>
      {initials}
    </div>
  );
}

function VoteBadge({ status, currentMode = 'dark' }) {
  const normalized = status || "";
  const { t } = useLanguage();
  const labels = {
    LIKE: t('selectfinaliste_liked'),
    DISCUSS: t('selectfinaliste_to_discuss'),
    DISLIKE: "Dislike"
  };
  
  const getStyle = () => {
    if (normalized === 'LIKE') {
      return {
        backgroundColor: currentMode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)',
        borderColor: currentMode === 'light' ? '#059669' : 'rgba(16, 185, 129, 0.5)',
        color: currentMode === 'light' ? '#059669' : '#4ade80'
      };
    }
    if (normalized === 'DISCUSS') {
      return {
        backgroundColor: currentMode === 'light' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(217, 119, 6, 0.2)',
        borderColor: currentMode === 'light' ? '#b45309' : 'rgba(217, 119, 6, 0.5)',
        color: currentMode === 'light' ? '#b45309' : '#facc15'
      };
    }
    return {
      backgroundColor: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)',
      borderColor: currentMode === 'light' ? '#dc2626' : 'rgba(239, 68, 68, 0.5)',
      color: currentMode === 'light' ? '#dc2626' : '#fca5a5'
    };
  };
  
  const label = labels[normalized] || "Vote";
  const styleObj = getStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      borderRadius: '9999px',
      border: `1px solid ${styleObj.borderColor}`,
      fontSize: '0.625rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: styleObj.backgroundColor,
      color: styleObj.color
    }}>
      {label}
    </span>
  );
}

/* ─── HELPER: COMPTER LES VOTES PAR STATUS ─── */
function countVotesByStatus(evaluations, status) {
  return (evaluations || []).filter(e => e.vote_status === status).length;
}

/* ─── MODAL VOTES ─── */
function VotesModal({ film, voteStatus, onClose, currentMode = 'dark' }) {
  const { t } = useLanguage();
  if (!film || !voteStatus) return null;
  const evaluations = (film.comments || []).filter(c => c.vote_status === voteStatus);
  const statusLabel = voteStatus === 'LIKE' ? t('selectfinaliste_jury_likes') : t('selectfinaliste_to_discuss');
  const isLike = voteStatus === 'LIKE';
  const bgColors = isLike 
    ? { header: currentMode === 'light' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: currentMode === 'light' ? '#d1fae5' : '#064e3b' }
    : { header: currentMode === 'light' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.15)', border: currentMode === 'light' ? '#fed7aa' : '#78350f' };
  const iconColor = isLike ? '#059669' : '#b45309';
  const badgeBg = isLike ? 'rgba(16, 185, 129, 0.2)' : 'rgba(217, 119, 6, 0.2)';
  const badgeBorder = isLike ? 'rgba(16, 185, 129, 0.5)' : 'rgba(217, 119, 6, 0.5)';
  const badgeColor = isLike ? '#059669' : '#b45309';
  const cardHoverBg = isLike ? currentMode === 'light' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)' : currentMode === 'light' ? 'rgba(217, 119, 6, 0.05)' : 'rgba(217, 119, 6, 0.1)';
  const cardBorderHover = isLike ? currentMode === 'light' ? '#a7f3d0' : 'rgba(16, 185, 129, 0.5)' : currentMode === 'light' ? '#fcdcac' : 'rgba(217, 119, 6, 0.5)';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      }} onClick={onClose} />
      <div style={{
        position: 'relative',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '42rem',
        maxHeight: '85vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
          background: `linear-gradient(to right, ${bgColors.header}, transparent)`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {isLike ? <ThumbsUp size={16} style={{ color: iconColor }} /> : <AlertCircle size={16} style={{ color: iconColor }} />}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: iconColor
                }}>{statusLabel} {t('selectfinaliste_jury_opinion')}</span>
              </div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'black',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }}>{film.titre}</h2>
              <p style={{
                fontSize: '0.875rem',
                color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                marginTop: '0.125rem'
              }}>{film.real}</p>
            </div>
            <button onClick={onClose} style={{
              padding: '0.5rem',
              backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
              borderRadius: '0.5rem',
              border: 'none',
              color: currentMode === 'light' ? '#666666' : '#a3a3a3',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
              e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : '#262626';
              e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
            }}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div style={{
          overflowY: 'auto',
          maxHeight: '60vh',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {evaluations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '3rem',
              paddingBottom: '3rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>
              {isLike ? <ThumbsUp size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} /> : <AlertCircle size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />}
              <p style={{ fontSize: '0.875rem' }}>{isLike ? t('selectfinaliste_no_likes_for_film') : t('selectfinaliste_no_discusses_for_film')}</p>
            </div>
          ) : evaluations.map((c, idx) => (
            <div key={idx} style={{
              backgroundColor: currentMode === 'light' ? 'rgba(229, 229, 229, 0.4)' : 'rgba(38, 38, 38, 0.6)',
              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
              borderRadius: '0.75rem',
              padding: '1rem',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = cardHoverBg;
              e.currentTarget.style.borderColor = cardBorderHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentMode === 'light' ? 'rgba(229, 229, 229, 0.4)' : 'rgba(38, 38, 38, 0.6)';
              e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#262626';
            }}>
              <Avatar initials={c.avatar} currentMode={currentMode} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }}>{c.jury}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                    paddingTop: '0.125rem',
                    paddingBottom: '0.125rem',
                    borderRadius: '9999px',
                    border: `1px solid ${badgeBorder}`,
                    fontWeight: 'semibold',
                    backgroundColor: badgeBg,
                    color: badgeColor
                  }}>{statusLabel}</span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                  flexShrink: 0
                }}>{c.date}</span>
                <p style={{
                  fontSize: '0.875rem',
                  color: currentMode === 'light' ? '#333333' : '#e5e5e5',
                  lineHeight: '1.5',
                  marginTop: '0.5rem'
                }}>{c.text || `(${t('selectfinaliste_no_comment')})`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CommentsModal = ({ film, onClose, currentMode }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      }} onClick={onClose} />
      <div style={{
        position: 'relative',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '42rem',
        maxHeight: '85vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
    <div style={{
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
          backgroundImage: `linear-gradient(to right, ${currentMode === 'light' ? 'rgba(217, 119, 6, 0.05)' : 'rgba(217, 119, 6, 0.15)'}, transparent)`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <MessageSquare size={16} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: currentMode === 'light' ? '#7c3aed' : '#a78bfa'
                }}>{t('selectfinaliste_jury_opinion')}</span>
              </div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'black',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }}>{film.titre}</h2>
              <p style={{
                fontSize: '0.875rem',
                color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                marginTop: '0.125rem'
              }}>{film.real}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <button onClick={onClose} style={{
                padding: '0.5rem',
                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                borderRadius: '0.5rem',
                border: 'none',
                color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : '#262626';
                e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
              }}>
                <X size={18} />
              </button>
              {film.comments.length > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                    marginBottom: '0.5rem'
                  }}>{film.comments.length} {t('selectfinaliste_jury_opinions')}</div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {/* Vote counts - handled separately if needed */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{
          overflowY: 'auto',
          maxHeight: '60vh',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {film.comments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '3rem',
              paddingBottom: '3rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>
              <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem' }}>{t('selectfinaliste_no_comments_for_film')}</p>
            </div>
          ) : film.comments.map((c, idx) => {
              const isLikeComment = c.vote_status === 'LIKE';
              const isDiscussComment = c.vote_status === 'DISCUSS';
              const getBgStyle = () => {
                if (isLikeComment) {
                  return {
                    backgroundColor: currentMode === 'light' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)',
                    borderColor: currentMode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.3)'
                  };
                }
                if (isDiscussComment) {
                  return {
                    backgroundColor: currentMode === 'light' ? 'rgba(217, 119, 6, 0.05)' : 'rgba(217, 119, 6, 0.1)',
                    borderColor: currentMode === 'light' ? '#fed7aa' : 'rgba(217, 119, 6, 0.3)'
                  };
                }
                return {
                  backgroundColor: currentMode === 'light' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: currentMode === 'light' ? '#fecaca' : 'rgba(239, 68, 68, 0.3)'
                };
              };
              const bgStyle = getBgStyle();
              return (
                <div key={idx} style={{
                  backgroundColor: bgStyle.backgroundColor,
                  border: `1px solid ${bgStyle.borderColor}`,
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <Avatar initials={c.avatar} currentMode={currentMode} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        color: currentMode === 'light' ? '#000000' : '#ffffff'
                      }}>{c.jury}</span>
                      <VoteBadge status={c.vote_status} currentMode={currentMode} />
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                      flexShrink: 0
                    }}>{c.date}</span>
                    <p style={{
                      fontSize: '0.875rem',
                      color: currentMode === 'light' ? '#333333' : '#e5e5e5',
                      marginTop: '0.5rem',
                      lineHeight: '1.5'
                    }}>{c.text || `(${t('selectfinaliste_no_comment')})`}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* ─── GRAPHE SÉLECTION ─── */
function SelectionChart({ films, currentMode = 'dark' }) {
  const { t } = useLanguage();
  const selected = films.filter(f => f.selected).length;
  const total = films.length;
  const pct = Math.round((selected / total) * 100);
  const circumference = 2 * Math.PI * 52;
  const dash = (selected / total) * circumference;

  const byTag = {};
  films.filter(f => f.selected).forEach(f => {
    if (!f.tags) return;
    f.tags.split(",").forEach(tagStr => {
      const tag = tagStr.trim();
      if (!tag) return;
      byTag[tag] = (byTag[tag] || 0) + 1;
    });
  });
  const tagEntries = Object.entries(byTag).slice(0, 5);
  const maxTag = Math.max(...tagEntries.map(([,v]) => v), 1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#1a1a1a',
        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
        borderRadius: '1rem',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke={currentMode === 'light' ? '#e5e5e5' : '#262626'} strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#violet-grad)" strokeWidth="10"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
            <defs>
              <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'black',
              color: currentMode === 'light' ? '#000000' : '#ffffff'
            }}>{selected}</span>
            <span style={{
              fontSize: '0.75rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>/{total}</span>
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#7c3aed',
            marginBottom: '0.25rem'
          }}>{t('selectfinaliste_selected_films')}</div>
          <div style={{
            fontSize: '2.25rem',
            fontWeight: 'black',
            color: currentMode === 'light' ? '#000000' : '#ffffff'
          }}>{pct}<span style={{ fontSize: '0.875rem', color: currentMode === 'light' ? '#999999' : '#a3a3a3' }}>%</span></div>
          <div style={{
            fontSize: '0.875rem',
            color: currentMode === 'light' ? '#999999' : '#a3a3a3',
            marginTop: '0.25rem'
          }}>{t('selectfinaliste_selection_rate')}</div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>
              <span style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: '#a855f7'
              }} />
              {t('selectfinaliste_selected_status')} ({selected})
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>
              <span style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#404040'
              }} />
              {t('selectfinaliste_pending')} ({total - selected})
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#1a1a1a',
        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
        borderRadius: '1rem',
        padding: '1.5rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#7c3aed',
          marginBottom: '1rem'
        }}>{t('selectfinaliste_selected_genres')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tagEntries.map(([tag, count]) => (
            <div key={tag}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                marginBottom: '0.25rem'
              }}>
                <span style={{
                  color: currentMode === 'light' ? '#333333' : '#e5e5e5',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{tag}</span>
                <span style={{
                  color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                  flexShrink: 0,
                  marginLeft: '0.5rem'
                }}>{count} film{count > 1 ? "s" : ""}</span>
              </div>
              <div style={{
                height: '0.5rem',
                backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#262626',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '9999px',
                    backgroundImage: 'linear-gradient(to right, #7c3aed, #a78bfa)',
                    transition: 'width 0.7s ease',
                    width: `${(count / maxTag) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
          {tagEntries.length === 0 && (
            <p style={{
              fontSize: '0.875rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>{t('selectfinaliste_no_films_selected')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── COMPOSANT PRINCIPAL ─── */
export default function SelectFinaliste() {
  const { t } = useLanguage();
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSelected, setFilterSelected] = useState("all");
  const [commentFilm, setCommentFilm] = useState(null);
  const [voteFilm, setVoteFilm] = useState({ film: null, status: null });
  const [editingPrize, setEditingPrize] = useState(null);
  const [prizeInput, setPrizeInput] = useState("");
  const [toast, setToast] = useState({ visible: false, msg: "", color: "#8b5cf6" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [currentMode, setCurrentMode] = useState('dark');
  const toastTimer = useRef(null);
  const limit = 12;

  useEffect(() => {
    const handleModeChange = (e) => {
      const mode = document.documentElement.getAttribute('data-mode') || 'dark';
      setCurrentMode(mode);
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

    const mode = document.documentElement.getAttribute('data-mode') || 'dark';
    setCurrentMode(mode);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFinalists = async () => {
      setLoading(true);
      setApiError("");

      try {
        const params = {
          page,
          limit,
          vote: "liked_or_discuss",
          includeSelected: "true"
        };

        if (filterSelected === "liked") {
          params.vote = "liked";
        } else if (filterSelected === "toDiscuss") {
          params.vote = "discuss";
        } else if (filterSelected === "selected") {
          params.selectedOnly = "true";
        }

        const response = await axios.get("/admin/finalists", { params });

        if (!isMounted) return;
        const payload = response.data || {};
        setFilms((payload.data || []).map(mapApiFilm));
        setTotalPages(payload.totalPages || 1);
      } catch (error) {
        if (!isMounted) return;
        setApiError("Impossible de charger les finalistes pour le moment.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFinalists();

    return () => {
      isMounted = false;
    };
  }, [page, filterSelected]);

  const showToast = (msg, color = "#8b5cf6") => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, msg, color });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  const toggleSelected = async (id) => {
    const film = films.find(f => f.id === id);
    if (!film) return;

    const nowSelected = !film.selected;

    try {
      await axios.put(`/admin/finalists/${id}`, {
        is_selected: nowSelected,
        award_winner: nowSelected ? film.prize : null
      });

      setFilms(prev => prev.map(f => {
        if (f.id !== id) return f;
        if (!nowSelected) {
          showToast(t('selectfinaliste_film_removed'), "#f05a5a");
          return { ...f, selected: false, prize: "" };
        }
        setEditingPrize(id);
        setPrizeInput("");
        showToast(t('selectfinaliste_film_selected'), "#2ac98e");
        return { ...f, selected: true };
      }));
    } catch (error) {
      console.error("Erreur mise à jour sélection:", error);
      showToast("Erreur lors de la mise à jour", "#f05a5a");
    }
  };

  const savePrize = async (id) => {
    try {
      await axios.put(`/admin/finalists/${id}`, {
        award_winner: prizeInput || null
      });

      setFilms(prev => prev.map(f => f.id === id ? { ...f, prize: prizeInput } : f));
      setEditingPrize(null);
      showToast(prizeInput ? t('selectfinaliste_award_assigned').replace('{award}', prizeInput) : t('selectfinaliste_film_selected_no_award'), "#2ac98e");
    } catch (error) {
      console.error("Erreur mise à jour prix:", error);
      showToast(t('selectfinaliste_error_save_award'), "#f05a5a");
    }
  };

  const filtered = films.filter(f => {
    const matchSearch = f.titre.toLowerCase().includes(search.toLowerCase()) ||
                        f.real.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const selectedCount = films.filter(f => f.selected).length;
  const likedCount = films.filter(f => f.liked).length;
  const toDiscussCount = films.filter(f => f.toDiscuss).length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: currentMode === 'light' ? 'linear-gradient(to right, #ffffff, #ffffff)' : 'linear-gradient(to right, rgba(124, 58, 237, 0.15), rgba(99, 102, 241, 0.1), transparent)',
      backgroundColor: currentMode === 'light' ? '#ffffff' : '#0f0f0f',
      color: currentMode === 'light' ? '#000000' : '#ffffff',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif"
    }}>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
        backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 15, 15, 0.8)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: '#7c3aed',
              padding: '0.5rem',
              borderRadius: '0.5rem'
            }}>
              <Film size={20} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#7c3aed',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{t('selectfinaliste_admin')}</div>
              <h1 style={{
                fontSize: '1.125rem',
                fontWeight: 'black',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                lineHeight: 1
              }}>{t('selectfinaliste_title')}</h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.2)',
              border: `1px solid ${currentMode === 'light' ? '#c084fc' : 'rgba(124, 58, 237, 0.4)'}`,
              borderRadius: '9999px',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              '@media (min-width: 640px)': {
                display: 'flex'
              }
            }}>
              <Trophy size={14} style={{ color: '#a78bfa' }} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#c084fc'
              }}>{selectedCount} {t('selectfinaliste_selected')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '80rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { icon: Film, label: t('selectfinaliste_total_submitted'), value: films.length, color: '#3b82f6', bg: currentMode === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)', border: currentMode === 'light' ? '#bfdbfe' : 'rgba(59, 130, 246, 0.3)' },
            { icon: Check, label: t('selectfinaliste_selected'), value: selectedCount, color: '#a78bfa', bg: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)', border: currentMode === 'light' ? '#e9d5ff' : 'rgba(124, 58, 237, 0.3)' },
            { icon: Award, label: t('selectfinaliste_awards_given'), value: films.filter(f => f.prize).length, color: '#facc15', bg: currentMode === 'light' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(217, 119, 6, 0.15)', border: currentMode === 'light' ? '#fed7aa' : 'rgba(217, 119, 6, 0.3)' },
            { icon: MessageSquare, label: t('selectfinaliste_comments'), value: films.reduce((s, f) => s + f.comments.length, 0), color: '#4ade80', bg: currentMode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)', border: currentMode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.3)' },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} style={{
              borderRadius: '0.75rem',
              border: `1px solid ${border}`,
              padding: '1rem',
              backgroundColor: bg
            }}>
              <Icon size={18} style={{ color: color, marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'black', color: currentMode === 'light' ? '#000000' : '#ffffff' }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: currentMode === 'light' ? '#999999' : '#a3a3a3', marginTop: '0.125rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <SelectionChart films={films} currentMode={currentMode} />

        {/* Search & Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          '@media (min-width: 640px)': {
            flexDirection: 'row'
          }
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentMode === 'light' ? '#999999' : '#666666'
            }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('selectfinaliste_search_placeholder')}
              style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#0f0f0f',
                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                borderRadius: '0.75rem',
                paddingLeft: '2.25rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                fontSize: '0.875rem',
                color: currentMode === 'light' ? '#000000' : '#e5e5e5',
                placeholder: currentMode === 'light' ? '#999999' : '#666666',
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#262626'}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Tous */}
            <button
              onClick={() => { setFilterSelected("all"); setPage(1); }}
              style={{
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                border: filterSelected === "all" ? '1px solid #7c3aed' : `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                backgroundColor: filterSelected === "all" ? '#7c3aed' : currentMode === 'light' ? '#f5f5f5' : '#1a1a1a',
                color: filterSelected === "all" ? '#ffffff' : currentMode === 'light' ? '#666666' : '#a3a3a3',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (filterSelected !== "all") {
                  e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (filterSelected !== "all") {
                  e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
                }
              }}
            >
              {t('selectfinaliste_all')}
            </button>

            {/* Sélectionnés */}
            <button
              onClick={() => { setFilterSelected("selected"); setPage(1); }}
              style={{
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                border: filterSelected === "selected" ? '1px solid #7c3aed' : `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                backgroundColor: filterSelected === "selected" ? '#7c3aed' : currentMode === 'light' ? '#f5f5f5' : '#1a1a1a',
                color: filterSelected === "selected" ? '#ffffff' : currentMode === 'light' ? '#666666' : '#a3a3a3',
                cursor: 'pointer'
              }}
            >
              {t('selectfinaliste_selected')}
            </button>

            {/* Like */}
            <button
              onClick={() => { setFilterSelected("liked"); setPage(1); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                border: filterSelected === "liked" ? '1px solid #059669' : `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                backgroundColor: filterSelected === "liked" ? '#059669' : currentMode === 'light' ? '#f5f5f5' : '#1a1a1a',
                color: filterSelected === "liked" ? '#ffffff' : currentMode === 'light' ? '#666666' : '#a3a3a3',
                cursor: 'pointer'
              }}
            >
              <ThumbsUp size={13} />
              {t('selectfinaliste_liked')}
              {likedCount > 0 && (
                <span style={{
                  marginLeft: '0.125rem',
                  borderRadius: '9999px',
                  paddingLeft: '0.375rem',
                  paddingRight: '0.375rem',
                  paddingTop: '0.125rem',
                  paddingBottom: '0.125rem',
                  fontSize: '0.625rem',
                  fontWeight: 'black',
                  backgroundColor: filterSelected === "liked" ? '#10b981' : currentMode === 'light' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.3)',
                  color: filterSelected === "liked" ? '#ffffff' : currentMode === 'light' ? '#059669' : '#4ade80'
                }}>
                  {likedCount}
                </span>
              )}
            </button>

            {/* À discuter */}
            <button
              onClick={() => { setFilterSelected("toDiscuss"); setPage(1); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                border: filterSelected === "toDiscuss" ? '1px solid #b45309' : `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                backgroundColor: filterSelected === "toDiscuss" ? '#b45309' : currentMode === 'light' ? '#f5f5f5' : '#1a1a1a',
                color: filterSelected === "toDiscuss" ? '#ffffff' : currentMode === 'light' ? '#666666' : '#a3a3a3',
                cursor: 'pointer'
              }}
            >
              <AlertCircle size={13} />
              {t('selectfinaliste_to_discuss')}
              {toDiscussCount > 0 && (
                <span style={{
                  marginLeft: '0.125rem',
                  borderRadius: '9999px',
                  paddingLeft: '0.375rem',
                  paddingRight: '0.375rem',
                  paddingTop: '0.125rem',
                  paddingBottom: '0.125rem',
                  fontSize: '0.625rem',
                  fontWeight: 'black',
                  backgroundColor: filterSelected === "toDiscuss" ? '#d97706' : currentMode === 'light' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.3)',
                  color: filterSelected === "toDiscuss" ? '#ffffff' : currentMode === 'light' ? '#b45309' : '#facc15'
                }}>
                  {toDiscussCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: currentMode === 'light' ? '#ffffff' : '#1a1a1a',
          border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
          borderRadius: '1rem',
          overflow: 'hidden'
        }} className="hidden sm:block">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr 1fr 160px 1fr auto',
            gap: 0
          }}>
            {/* Header */}
            {["", t('gallery_title'), t('selectfinaliste_director'), t('selectfinaliste_status'), t('selectfinaliste_award'), t('selectfinaliste_actions')].map(h => (
              <div key={h} style={{
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: currentMode === 'light' ? '#999999' : '#666666',
                borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#0f0f0f'
              }}>
                {h}
              </div>
            ))}

            {/* Rows */}
            {filtered.map(f => (
              <React.Fragment key={f.id}>
                {/* Poster */}
                <div style={{
                  padding: '0.75rem',
                  borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '40px',
                    height: '56px',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#262626',
                    flexShrink: 0
                  }}>
                    {f.posterUrl ? (
                      <img src={f.posterUrl} alt={f.titre} style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: currentMode === 'light' ? '#e5e5e5' : '#404040'
                      }}><Film size={16} /></div>
                    )}
                  </div>
                </div>

                {/* Titre */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }}>{f.titre}</div>
                  <div style={{
                    display: 'flex',
                    gap: '0.25rem',
                    marginTop: '0.25rem',
                    flexWrap: 'wrap'
                  }}>
                    {(f.tags ? f.tags.split(",") : []).slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.75rem',
                        backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#262626',
                        color: currentMode === 'light' ? '#666666' : '#999999',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px'
                      }}>{tag.trim()}</span>
                    ))}
                  </div>
                </div>

                {/* Réalisateur */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: currentMode === 'light' ? '#333333' : '#e5e5e5',
                  fontWeight: '500'
                }}>
                  {f.real}
                </div>

                {/* Statut + Toggle */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <button
                    onClick={() => toggleSelected(f.id)}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      width: '44px',
                      height: '24px',
                      borderRadius: '9999px',
                      transition: 'all 0.2s',
                      backgroundColor: f.selected ? '#a855f7' : (currentMode === 'light' ? '#e5e5e5' : '#404040'),
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      padding: 0
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      transform: f.selected ? 'translateX(24px)' : 'translateX(4px)',
                      transition: 'transform 0.2s',
                      marginTop: '4px'
                    }} />
                  </button>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    color: f.selected ? '#a855f7' : (currentMode === 'light' ? '#999999' : '#666666')
                  }}>
                    {f.selected ? t('selectfinaliste_selected_status') : "—"}
                  </span>
                </div>

                {/* Prix */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {editingPrize === f.id ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%'
                    }}>
                      <input
                        autoFocus
                        value={prizeInput}
                        onChange={e => setPrizeInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") savePrize(f.id); if (e.key === "Escape") setEditingPrize(null); }}
                        placeholder="Ex: Grand Prix..."
                        style={{
                          flex: 1,
                          backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                          border: `1px solid #a855f7`,
                          borderRadius: '0.5rem',
                          padding: '0.375rem 0.75rem',
                          fontSize: '0.75rem',
                          color: currentMode === 'light' ? '#000000' : '#ffffff',
                          outline: 'none'
                        }}
                      />
                      <button onClick={() => savePrize(f.id)} style={{
                        padding: '0.375rem 0.5rem',
                        backgroundColor: '#a855f7',
                        color: '#ffffff',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#9333ea'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#a855f7'}>
                        <Check size={14} />
                      </button>
                      <button onClick={() => { setEditingPrize(null); if (!f.prize) setFilms(p => p.map(x => x.id === f.id ? { ...x, selected: false } : x)); }} style={{
                        padding: '0.375rem 0.5rem',
                        backgroundColor: currentMode === 'light' ? '#e5e5e5' : '#404040',
                        color: currentMode === 'light' ? '#333333' : '#a3a3a3',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }} onMouseEnter={e => e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#d1d5db' : '#505050'} onMouseLeave={e => e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e5e5' : '#404040'}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingPrize(f.id); setPrizeInput(f.prize); }} style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}>
                      {f.prize ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          border: `1px solid rgba(245, 158, 11, 0.3)`,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px'
                        }}>
                          <Trophy size={11} /> {f.prize}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.75rem',
                          color: currentMode === 'light' ? '#999999' : '#666666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Plus size={11} /> Attribuer un prix
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {/* Bouton commentaires */}
                  <button
                    onClick={() => setCommentFilm(f)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                      color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#a855f7';
                      e.currentTarget.style.color = '#a855f7';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                      e.currentTarget.style.color = currentMode === 'light' ? '#999999' : '#a3a3a3';
                    }}
                    title={t('selectfinaliste_view_comments')}
                  >
                    <MessageSquare size={15} />
                    {f.comments.length > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#a855f7',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {f.comments.length}
                      </span>
                    )}
                  </button>

                  {/* Bouton Like */}
                  <button
                    onClick={() => setVoteFilm({ film: f, status: 'LIKE' })}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                      color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.color = '#10b981';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                      e.currentTarget.style.color = currentMode === 'light' ? '#999999' : '#a3a3a3';
                    }}
                    title={t('selectfinaliste_view_likes')}
                  >
                    <ThumbsUp size={15} />
                    {countVotesByStatus(f.comments, 'LIKE') > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {countVotesByStatus(f.comments, 'LIKE')}
                      </span>
                    )}
                  </button>

                  {/* Bouton À discuter */}
                  <button
                    onClick={() => setVoteFilm({ film: f, status: 'DISCUSS' })}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#404040'}`,
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                      color: currentMode === 'light' ? '#999999' : '#a3a3a3',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#f59e0b';
                      e.currentTarget.style.color = '#f59e0b';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#404040';
                      e.currentTarget.style.color = currentMode === 'light' ? '#999999' : '#a3a3a3';
                    }}
                    title={t('selectfinaliste_view_to_discuss')}
                  >
                    <AlertCircle size={15} />
                    {countVotesByStatus(f.comments, 'DISCUSS') > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {countVotesByStatus(f.comments, 'DISCUSS')}
                      </span>
                    )}
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>

          {loading && (
            <div style={{
              textAlign: 'center',
              paddingTop: '2.5rem',
              paddingBottom: '2.5rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>
              {t('selectfinaliste_loading')}
            </div>
          )}

          {apiError && !loading && (
            <div style={{
              textAlign: 'center',
              paddingTop: '2.5rem',
              paddingBottom: '2.5rem',
              color: '#f87171'
            }}>
              {apiError}
            </div>
          )}

          {filtered.length === 0 && !loading && !apiError && (
            <div style={{
              textAlign: 'center',
              paddingTop: '4rem',
              paddingBottom: '4rem',
              color: currentMode === 'light' ? '#999999' : '#a3a3a3'
            }}>
              <Film size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem' }}>{t('selectfinaliste_no_films_found')}</p>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginTop: '1.25rem'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            style={{
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
              color: currentMode === 'light' ? '#666666' : '#a3a3a3',
              backgroundColor: currentMode === 'light' ? '#ffffff' : '#0f0f0f',
              cursor: page <= 1 || loading ? 'not-allowed' : 'pointer',
              opacity: page <= 1 || loading ? 0.4 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!(page <= 1 || loading)) {
                e.currentTarget.style.borderColor = currentMode === 'light' ? '#999999' : '#404040';
                e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#262626';
              e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
            }}
          >
            {t('selectfinaliste_previous_page')}
          </button>
          <div style={{
            fontSize: '0.75rem',
            color: currentMode === 'light' ? '#999999' : '#a3a3a3',
            whiteSpace: 'nowrap'
          }}>
            {t('selectfinaliste_title')} {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            style={{
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
              color: currentMode === 'light' ? '#666666' : '#a3a3a3',
              backgroundColor: currentMode === 'light' ? '#ffffff' : '#0f0f0f',
              cursor: page >= totalPages || loading ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages || loading ? 0.4 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!(page >= totalPages || loading)) {
                e.currentTarget.style.borderColor = currentMode === 'light' ? '#999999' : '#404040';
                e.currentTarget.style.color = currentMode === 'light' ? '#000000' : '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : '#262626';
              e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
            }}
          >
            {t('selectfinaliste_next_page')}
          </button>
        </div>

      </div>

      {/* Modal commentaires */}
      {commentFilm && <CommentsModal film={commentFilm} onClose={() => setCommentFilm(null)} currentMode={currentMode} />}

      {/* Modal votes */}
      {voteFilm.film && (
        <VotesModal
          film={voteFilm.film}
          voteStatus={voteFilm.status}
          onClose={() => setVoteFilm({ film: null, status: null })}
          currentMode={currentMode}
        />
      )}

      {/* Toast */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
        color: currentMode === 'light' ? '#000000' : '#ffffff',
        fontSize: '0.875rem',
        fontWeight: '600',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: toast.visible ? 'auto' : 'none'
      }}>
        <span style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          flexShrink: 0,
          backgroundColor: toast.color
        }} />
        {toast.msg}
      </div>
    </div>
  );
}

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR");
};

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("") || "??";
};

const mapApiFilm = (item) => {
  const comments = (item.evaluations || []).map((evaluation) => {
    const juryName = evaluation.user?.full_name || "Jury";
    return {
      jury: juryName,
      avatar: getInitials(juryName),
      vote_status: evaluation.vote_status,
      text: evaluation.comment || "",
      date: formatDate(evaluation.created_at)
    };
  });

  return {
    id: item.id,
    titre: item.title_original,
    real: item.director?.full_name || "—",
    date: formatDate(item.created_at),
    selected: !!item.is_selected,
    prize: item.award_winner || "",
    liked: (item.vote_stats?.like || 0) > 0,
    toDiscuss: (item.vote_stats?.discuss || 0) > 0,
    posterUrl: item.poster_url,
    synopsis: item.synopsis_original,
    tags: item.theme_tags || "",
    comments
  };
};