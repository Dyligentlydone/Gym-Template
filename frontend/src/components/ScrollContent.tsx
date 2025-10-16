import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ScrollContentProps {
  scrollProgress: number
}

export default function ScrollContent({ scrollProgress }: ScrollContentProps) {
  // Content emerges immediately when scrolling DOWN (like social media)
  const contentOpacity = scrollProgress > 0.05 ? Math.min((scrollProgress - 0.05) * 3, 1) : 0;
  const contentY = scrollProgress > 0.05 ? 0 : 100;

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        opacity: contentOpacity,
        y: contentY
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="text-center max-w-4xl">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: contentOpacity,
            scale: 0.5 + (contentOpacity * 0.5)
          }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {"{ Dyligent } - Code Block / Object / Function Body"}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentOpacity }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Meaning: implies Dyligent is the core logic or engine behind something powerful.
        </motion.p>

        {/* Debug info */}
        <motion.div
          className="text-sm text-black mt-4 p-4 bg-white/90 rounded shadow-lg border"
          animate={{ opacity: contentOpacity }}
        >
          <p>Scroll Progress: {(scrollProgress * 100).toFixed(1)}%</p>
          <p>Content Opacity: {contentOpacity.toFixed(2)}</p>
          <p>Threshold: 20% scroll</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
