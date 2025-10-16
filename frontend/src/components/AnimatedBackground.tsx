import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Removed mouse position tracking for better performance
  const gradientCache = useRef<{ [key: string]: CanvasGradient }>({});

  // No images; circles only for gym template

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    // White particles for high contrast
    const COLORS = ['#ffffff']

    const createParticles = () => {
      const particleCount = 70;
      particles.length = 0; // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Much smaller particles
          size: Math.random() * 0.8 + 0.2,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          // Slightly higher base opacity for white on gray
          opacity: Math.random() * 0.3 + 0.15,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const animate = () => {
      // Modern gray tone background for better particle contrast
      ctx.fillStyle = 'rgb(26, 28, 32)'; // ~#1A1C20
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw circle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections between nearby particles (subtle)
        if (index % 3 === 0) {
          particles.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 70) { // Reduced for better performance
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255, ${0.06 * (1 - distance / 70)})`;
                ctx.lineWidth = 0.3;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
              }
            }
          });
        }
      });

      requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    // Mouse movement listener removed
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      // No need to remove mouse listener since we're not adding it
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ 
        background: 'linear-gradient(to bottom, #1b1d21, #23272e)',
        zIndex: 0 
      }}
    />
  );
}
