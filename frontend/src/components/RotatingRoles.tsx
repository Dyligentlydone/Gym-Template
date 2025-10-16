import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface RotatingRolesProps {
  roles: string[]
  intervalMs?: number
}

export default function RotatingRoles({ roles, intervalMs = 2000 }: RotatingRolesProps) {
  const [index, setIndex] = useState(0)
  const [seq, setSeq] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const [scale, setScale] = useState(1)
  const intervalRef = useRef<number | null>(null)
  const rafPendingRef = useRef(false)

  useEffect(() => {
    const start = () => {
      if (intervalRef.current != null) return
      intervalRef.current = window.setInterval(() => {
        setIndex((i) => {
          // bump sequence so AnimatePresence gets a new key every time
          setSeq((s) => s + 1)
          return (i + 1) % roles.length
        })
      }, intervalMs)
    }
    const stop = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Start initially
    start()

    // Pause when tab is hidden to avoid catch-up bursts and flashing
    const onVis = () => {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      stop()
    }
  }, [intervalMs, roles.length])

  // Measure and fit text to one line by scaling down if needed
  const fitText = () => {
    const c = containerRef.current
    const t = textRef.current
    if (!c || !t) return
    // Debounce into next frame and avoid resetting scale to prevent flicker
    if (rafPendingRef.current) return
    rafPendingRef.current = true
    requestAnimationFrame(() => {
      rafPendingRef.current = false
      const cw = c.clientWidth
      const tw = t.scrollWidth // width if not clipped
      if (cw <= 0 || tw <= 0) {
        setScale(1)
        return
      }
      // Slight padding factor so it doesn't touch edges
      const isMobile = window.innerWidth < 768
      const minScale = isMobile ? 0.3 : 0.5
      const nextScale = Math.min(1, Math.max(minScale, (cw * 0.96) / tw))
      setScale(nextScale)
    })
  }

  useEffect(() => {
    fitText()
    const ro = new ResizeObserver(() => fitText())
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // refit when the text changes
    fitText()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center select-none">
        <div className="text-2xl sm:text-3xl md:text-4xl text-white/80 mb-1 leading-none">We're not your</div>
        <div
          ref={containerRef}
          className="relative h-[2.8rem] sm:h-[3rem] md:h-[3.5rem] w-full max-w-4xl flex items-center justify-center px-3 sm:px-4 whitespace-nowrap overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${roles[index]}-${seq}`}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
            >
              <span
                ref={textRef}
                className="inline-block text-xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent whitespace-nowrap leading-none capitalize"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  backgroundImage: 'linear-gradient(90deg, #caa92e 0%, #d7b73f 40%, #f0de8a 100%)'
                }}
              >
                {roles[index]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-2xl sm:text-3xl md:text-4xl text-white/80 mt-1 leading-none">we are all of them.</div>
      </div>
    </div>
  )
}
