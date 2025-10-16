import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhyOrbProps {
  message: string;
  position: { x: number; y: number };
  color: string;
  index: number;
}

const WhyOrb: React.FC<WhyOrbProps> = ({ message, position, color, index }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Generate random but consistent values for this orb
  const seed = index * 1000;
  const floatDuration = 20 + (Math.sin(seed) * 5);
  const floatDelay = Math.cos(seed) * 2;
  const floatDistance = 30 + (Math.sin(seed * 2) * 10);
  const rotateAmount = 5 + (Math.cos(seed * 3) * 2);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsClicked(!isClicked);
    setIsTooltipVisible(!isClicked);
  }, [isClicked]);

  const handleMouseEnter = useCallback(() => {
    if (!isClicked) {
      setIsTooltipVisible(true);
    }
  }, [isClicked]);

  const handleMouseLeave = useCallback(() => {
    if (!isClicked) {
      setIsTooltipVisible(false);
    }
  }, [isClicked]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tooltip from closing
    const shareText = `$why\n"${message}"`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
  }, [message]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -floatDistance, 0],
        x: [-floatDistance/2, floatDistance/2, -floatDistance/2],
        rotate: [-rotateAmount, rotateAmount, -rotateAmount],
      }}
      transition={{ 
        scale: { delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 100 },
        opacity: { delay: index * 0.1, duration: 0.5 },
        y: {
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut",
          delay: floatDelay,
        },
        x: {
          repeat: Infinity,
          duration: floatDuration * 1.2,
          ease: "easeInOut",
          delay: floatDelay,
        },
        rotate: {
          repeat: Infinity,
          duration: floatDuration * 1.4,
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
      className="absolute group cursor-pointer pointer-events-auto"
      style={{ 
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: isTooltipVisible ? 50 : 1,
      }}
      whileHover={{ 
        scale: 1.2,
        transition: { duration: 0.3 }
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outermost glow - very subtle and wide */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl transition-all duration-700 ${isClicked ? 'opacity-40' : 'opacity-20 group-hover:opacity-30'}`}
        style={{ 
          background: `radial-gradient(circle at center, ${color}66 0%, ${color}00 70%)`,
          width: '70px',
          height: '70px',
        }}
      />

      {/* Middle glow layer */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-xl transition-all duration-700 ${isClicked ? 'opacity-60' : 'opacity-40 group-hover:opacity-50'}`}
        style={{ 
          background: `radial-gradient(circle at center, ${color}99 0%, ${color}00 60%)`,
          width: '45px',
          height: '45px',
          animation: 'twinkle 4s infinite ease-in-out',
        }}
      />

      {/* Core glow - brightest part */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-md group-hover:blur-lg transition-all duration-700"
        style={{ 
          background: `radial-gradient(circle at center, #FFE484 0%, ${color}99 40%, transparent 70%)`,
          width: '24px',
          height: '24px',
          animation: 'pulse 3s infinite ease-in-out',
        }}
      />

      {/* Tiny bright center */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-[1px] group-hover:blur-[2px] transition-all duration-700"
        style={{ 
          background: '#FFFFFF',
          width: '6px',
          height: '6px',
          opacity: '1 !important',
          boxShadow: '0 0 16px #FFE484, 0 0 8px #FFFFFF',
          animation: 'twinkle 2s infinite ease-in-out',
        }}
      />

      {/* Random light rays for extra realism */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 blur-sm"
          style={{
            background: `linear-gradient(${i * 45}deg, ${color}99 0%, transparent 70%)`,
            width: '40px',
            height: '3px',
            transform: `rotate(${i * 45 + Math.random() * 20}deg)`,
            animation: `ray${i} ${3 + i}s infinite ease-in-out`,
          }}
        />
      ))}

      {/* Message tooltip */}
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 pointer-events-none z-10 min-w-[200px] max-w-[300px]"
          >
            <div className={`relative bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-2xl border shadow-xl transition-colors duration-300 ${isClicked ? 'border-yellow-500/50' : 'border-white/10'}`}>
              {/* X/Twitter share button */}
              <button
                onClick={handleShare}
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto"
                title="Share on X/Twitter"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              <p className="text-center whitespace-pre-wrap break-words leading-relaxed pr-8">
                {message}
              </p>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/80 border transform rotate-45 transition-colors duration-300 ${isClicked ? 'border-yellow-500/50' : 'border-white/10'}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.8; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          @keyframes ray0 { 0%, 100% { transform: rotate(0deg) scaleX(1); } 50% { transform: rotate(5deg) scaleX(1.2); } }
          @keyframes ray1 { 0%, 100% { transform: rotate(45deg) scaleX(1); } 50% { transform: rotate(40deg) scaleX(0.8); } }
          @keyframes ray2 { 0%, 100% { transform: rotate(90deg) scaleX(1); } 50% { transform: rotate(95deg) scaleX(1.1); } }
          @keyframes ray3 { 0%, 100% { transform: rotate(135deg) scaleX(1); } 50% { transform: rotate(130deg) scaleX(0.9); } }
        `}
      </style>
    </motion.div>
  );
};

export default WhyOrb;
