import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Removed mouse position tracking for better performance
  const gradientCache = useRef<{ [key: string]: CanvasGradient }>({});

  // Image for particles
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageLoaded = useRef(false);

  // Logo for bigger particles
  const logoRef = useRef<HTMLImageElement | null>(null);
  const logoLoaded = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      speedX: number;
      speedY: number;
      rotationSpeed: number;
      opacity: number;
      points: number;
      color: string;
      isLogo: boolean; // New property to distinguish logo particles
    }> = [];

    // Load the float image and logo
    const loadImage = () => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        imageLoaded.current = true;
      };
      img.src = '/D logo.png'; // Path to the new D logo in public folder

      // Load logo
      const logoImg = new Image();
      logoImg.onload = () => {
        logoRef.current = logoImg;
        logoLoaded.current = true;
      };
      logoImg.src = '/web logo.png'; // Path to the new web logo in public folder
    };

    // Brand gold color (uniform for consistency)
    const GOLD = '#d7b73f'
    const goldColors = [GOLD]

    const createStar = (ctx: CanvasRenderingContext2D, x: number, y: number, points: number, innerRadius: number, outerRadius: number, rotation: number) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points + rotation;
        const pointX = x + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.closePath();
    };

    const createParticles = () => {
      const particleCount = 40; // Reduced from 55 to 40 for better performance
      particles.length = 0; // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        // Only the first particle will be a logo particle
        const isLogo = i === 0;

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isLogo ? Math.random() * 2 + 2 : Math.random() * 1.5 + 0.5, // Logo particles are bigger
          rotation: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * 0.3, // Reduced speed
          speedY: (Math.random() - 0.5) * 0.3, // Reduced speed
          rotationSpeed: (Math.random() - 0.5) * 0.01, // Reduced rotation speed
          opacity: isLogo ? Math.random() * 0.3 + 0.4 : Math.random() * 0.4 + 0.2, // Logo particles slightly more opaque
          points: Math.floor(Math.random() * 2) + 4, // 4-5 points instead of 4-6
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          isLogo: isLogo
        });
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const animate = () => {
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw image
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        if (particle.isLogo && logoLoaded.current && logoRef.current) {
          // Draw logo with gold tint (maintain aspect ratio)
          const logoImg = logoRef.current;
          const maxSize = particle.size * 25; // Maximum size

          // Calculate dimensions maintaining aspect ratio
          const aspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
          let logoWidth, logoHeight;

          if (aspectRatio > 1) {
            // Image is wider than tall
            logoWidth = maxSize;
            logoHeight = maxSize / aspectRatio;
          } else {
            // Image is taller than wide
            logoHeight = maxSize;
            logoWidth = maxSize * aspectRatio;
          }

          // Center the logo
          const logoX = particle.x - logoWidth / 2;
          const logoY = particle.y - logoHeight / 2;

          // First draw the original logo
          ctx.drawImage(
            logoImg,
            logoX,
            logoY,
            logoWidth,
            logoHeight
          );

          // Then apply gold overlay using multiply blend mode
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = GOLD; // Brand gold
          ctx.fillRect(logoX, logoY, logoWidth, logoHeight);

          // Reset composite operation
          ctx.globalCompositeOperation = 'source-over';

          // Add extra gold glow effect
          ctx.shadowColor = GOLD;
          ctx.shadowBlur = 5; // Reduced shadow blur for better performance
          ctx.drawImage(
            logoImg,
            logoX,
            logoY,
            logoWidth,
            logoHeight
          );
          ctx.shadowBlur = 0; // Reset shadow
        } else if (imageLoaded.current && imageRef.current) {
          // Draw regular D logo particles with proper aspect ratio
          const img = imageRef.current;
          const maxSize = particle.size * 8 * 0.6; // Reduced by 40%

          // Calculate dimensions maintaining aspect ratio
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          let imgWidth, imgHeight;

          if (aspectRatio > 1) {
            // Image is wider than tall
            imgWidth = maxSize;
            imgHeight = maxSize / aspectRatio;
          } else {
            // Image is taller than wide
            imgHeight = maxSize;
            imgWidth = maxSize * aspectRatio;
          }

          // Draw the D logo with proper proportions
          ctx.drawImage(
            img,
            particle.x - imgWidth / 2,
            particle.y - imgHeight / 2,
            imgWidth,
            imgHeight
          );
        } else {
          // Fallback to circle while images are loading
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Draw connections with reduced distance, only check nearby particles
        // Only check connections for every third particle to improve performance
        if (index % 3 === 0) {
          particles.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 70) { // Reduced for better performance
                ctx.beginPath();
                ctx.strokeStyle = `rgba(215, 183, 63, ${0.1 * (1 - distance / 70)})`; // Brand gold connections
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
    loadImage(); // Load the float image
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      // No need to remove mouse listener since we're not adding it
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #000000, #111111)' }}
    />
  );
}
