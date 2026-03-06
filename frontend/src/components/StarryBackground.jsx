import { useEffect, useRef } from 'react';

export default function StarryBackground() {
    const canvasRef = useRef(null);
    const animationFrameIdRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration du canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Générer les étoiles
        const stars = [];
        const starCount = 400;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2.5,
                opacity: Math.random() * 0.8 + 0.4,
                twinkleSpeed: Math.random() * 0.08 + 0.02,
                twinklePhase: Math.random() * Math.PI * 2,
                glow: Math.random() * 8 + 4
            });
        }

        // Étoiles filantes
        const shootingStars = [];
        let time = 0;

        const createShootingStar = () => {
            const angle = Math.random() * Math.PI / 4 + Math.PI / 8;
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height * 0.3;
            
            shootingStars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * Math.random() * 8 + 5,
                vy: Math.sin(angle) * Math.random() * 8 + 5,
                trail: [],
                life: 0,
                maxLife: 60,
                opacity: 0
            });
        };

        let shootingStarTimer = Math.random() * 120 + 120;

        const animate = () => {
            // Détecter le mode à chaque frame
            const isLightMode = document.documentElement.getAttribute('data-mode') === 'light';
            const bgColor = isLightMode ? 'rgb(248, 250, 252)' : 'rgb(15, 23, 42)';

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dessiner les étoiles
            stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.7;
                const finalOpacity = star.opacity * twinkle;
                
                // Augmenter la visibilité en mode light
                const lightModeOpacityMultiplier = isLightMode ? 1.2 : 1;
                const adjustedOpacity = Math.min(finalOpacity * lightModeOpacityMultiplier, 1);
                
                const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.glow);
                gradient.addColorStop(0, `rgba(${isLightMode ? '30, 30, 30' : '255, 255, 255'}, ${adjustedOpacity * 0.8})`);
                gradient.addColorStop(0.5, `rgba(${isLightMode ? '80, 80, 80' : '147, 197, 253'}, ${adjustedOpacity * 0.3})`);
                gradient.addColorStop(1, `rgba(${isLightMode ? '80, 80, 80' : '147, 197, 253'}, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.glow, 0, Math.PI * 2);
                ctx.fill();

                // Étoile centrale plus grosse en mode light
                const starSize = isLightMode ? star.radius * 1.5 : star.radius;
                ctx.fillStyle = `rgba(${isLightMode ? '30, 30, 30' : '255, 255, 255'}, ${adjustedOpacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2);
                ctx.fill();
            });

            // Animer les étoiles filantes
            shootingStarTimer--;
            if (shootingStarTimer <= 0) {
                createShootingStar();
                shootingStarTimer = Math.random() * 120 + 120;
            }

            // Dessiner les étoiles filantes
            shootingStars.forEach((star, index) => {
                star.life++;
                const progress = star.life / star.maxLife;
                
                if (progress < 0.3) {
                    star.opacity = progress / 0.3;
                } else {
                    star.opacity = Math.max(0, 1 - (progress - 0.3) / 0.7);
                }

                star.x += star.vx;
                star.y += star.vy;

                star.trail.push({ x: star.x, y: star.y });
                if (star.trail.length > 30) {
                    star.trail.shift();
                }

                // Dessiner la traînée
                for (let i = 0; i < star.trail.length; i++) {
                    const trailPoint = star.trail[i];
                    const trailOpacity = (i / star.trail.length) * star.opacity;
                    const trailSize = (i / star.trail.length) * 2;

                    ctx.fillStyle = isLightMode 
                        ? `rgba(50, 50, 50, ${trailOpacity * 1.2})`
                        : `rgba(200, 220, 255, ${trailOpacity * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Tête de l'étoile filante
                ctx.fillStyle = isLightMode 
                    ? `rgba(50, 50, 50, ${Math.min(star.opacity * 1.2, 1)})`
                    : `rgba(255, 255, 200, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
                ctx.fill();

                // Halo
                const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
                headGlow.addColorStop(0, `rgba(${isLightMode ? '80, 80, 80' : '255, 255, 255'}, ${Math.min(star.opacity * 1.2, 1) * 0.8})`);
                headGlow.addColorStop(1, `rgba(${isLightMode ? '80, 80, 80' : '255, 255, 255'}, 0)`);
                ctx.fillStyle = headGlow;
                ctx.beginPath();
                ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
                ctx.fill();

                if (star.life >= star.maxLife || star.x > canvas.width + 50 || star.y > canvas.height + 50) {
                    shootingStars.splice(index, 1);
                }
            });

            animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Redimensionnement du canvas
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
}
