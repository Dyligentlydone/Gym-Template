import { motion, useAnimationControls, useInView, useReducedMotion } from 'framer-motion'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type ServiceCardProps = {
  title: string
  blurb: string
  details?: string
  icon?: React.ReactNode
}

const revealVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 6, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.9, bounce: 0.25 }, // slower opacity-in
  },
}

export default function ServiceCard({ title, blurb, details, icon }: ServiceCardProps) {
  const prefersReduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(cardRef, { amount: 0.3, margin: '0px 0px -10% 0px' })
  const controls = useAnimationControls()
  const [flipped, setFlipped] = useState(false)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const heightWrapperRef = useRef<HTMLDivElement | null>(null)
  const frontRef = useRef<HTMLDivElement | null>(null)
  const backRef = useRef<HTMLDivElement | null>(null)
  const [lockedH, setLockedH] = useState<number | undefined>(undefined)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [mousePos, setMousePos] = useState({ mx: 0.5, my: 0.5 }) // 0..1 within card
  const frontContentRef = useRef<HTMLDivElement | null>(null)
  const backContentRef = useRef<HTMLDivElement | null>(null)

  const MAX_DEG = 6 // balanced intensity

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (flipped) return
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const pctX = (x / rect.width) * 2 - 1 // -1..1
    const pctY = (y / rect.height) * 2 - 1 // -1..1
    const ry = pctX * MAX_DEG
    const rx = -pctY * MAX_DEG
    setTilt({ rx, ry })
    setMousePos({ mx: x / rect.width, my: y / rect.height })
  }

  const handlePointerLeave: React.PointerEventHandler<HTMLDivElement> = () => {
    setTilt({ rx: 0, ry: 0 })
  }

  const style3d: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
    transition: 'transform 180ms ease',
  }

  // Lock height: fit front by default; when flipped, expand to fit back
  useLayoutEffect(() => {
    const measure = () => {
      const { fh, bh } = measureHeights()
      const base = Math.max(fh, 150)
      const expanded = Math.max(fh, bh, 150)
      setLockedH(flipped ? expanded : base)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (frontRef.current) ro.observe(frontRef.current)
    if (backRef.current) ro.observe(backRef.current)
    return () => ro.disconnect()
  }, [flipped])

  // Keyboard accessibility for flip
  const onKeyToggle: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((v) => !v)
    }
  }

  // Helpers to control height during flip actions
  const measureHeights = () => {
    const fc = frontContentRef.current
    const bc = backContentRef.current
    const fh = Math.max(fc?.scrollHeight || 0, 150)
    const bh = Math.max(bc?.scrollHeight || 0, 150)
    return { fh, bh }
  }

  const setExpandedHeight = () => {
    const { fh, bh } = measureHeights()
    const expanded = Math.max(fh, bh)
    setLockedH(expanded)
  }
  const setCompactHeight = () => {
    const { fh } = measureHeights()
    setLockedH(fh)
  }

  // When flip state changes, re-affirm the intended height on the next frame
  useEffect(() => {
    let raf = 0
    if (flipped) {
      raf = requestAnimationFrame(() => setExpandedHeight())
    } else {
      raf = requestAnimationFrame(() => setCompactHeight())
    }
    return () => cancelAnimationFrame(raf)
  }, [flipped])

  // Dynamic shadow based on tilt magnitude (soft and balanced)
  const shadowOffsetX = tilt.ry * 0.6 // horizontal shadow reacts to rotateY
  const shadowOffsetY = Math.max(0, tilt.rx) * 1.2 + 6 // more shadow when tilting away + base
  const shadowBlur = 24 + Math.abs(tilt.rx) * 2 + Math.abs(tilt.ry) * 2
  const styleShadow: React.CSSProperties = prefersReduced
    ? {}
    : { boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,0.35)` }

  // Animate on scroll: fade in when in view, fade out when out of view
  useEffect(() => {
    if (!controls) return
    if (inView) {
      controls.start('show')
    } else {
      controls.start('hidden')
    }
  }, [inView, controls])

  return (
    <motion.div
      ref={cardRef}
      className="relative w-[calc(100vw-2rem)] md:w-full mx-auto min-w-0 group rounded-xl border border-white/10 bg-black/[0.65] backdrop-blur-md overflow-hidden will-change-transform"
      data-card-mask="true"
      variants={revealVariants}
      initial="hidden"
      animate={controls}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={prefersReduced ? undefined : { ...style3d, ...styleShadow, ['--mx' as any]: mousePos.mx, ['--my' as any]: mousePos.my }}
    >
      {/* Background grid layer (deep plane) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-50"
        style={{
          transform: 'translateZ(-12px)',
          background:
            'linear-gradient(transparent 95%, rgba(255,255,255,0.06) 95%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.06) 95%)',
          backgroundSize: '20px 20px, 20px 20px',
          backgroundPosition: '0 0, 0 0'
        }}
      />

      {/* Background glow layer (mid plane) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-300"
        style={{
          transform: 'translateZ(-6px)',
          background:
            'radial-gradient(1200px 300px at 10% -20%, rgba(215,183,63,0.12), transparent), radial-gradient(1200px 300px at 110% 120%, rgba(215,183,63,0.12), transparent)'
        }}
      />

      {/* Neon edge (pseudo via extra element) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 24px rgba(215,183,63,0.18)'
        }}
      />

      {/* Specular highlight that follows pointer (desktop only) */}
      {!prefersReduced && !flipped && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            mixBlendMode: 'screen',
            background:
              'radial-gradient(400px 200px at calc(var(--mx) * 100%) calc(var(--my) * 100%), rgba(255,255,255,0.12), transparent 60%)'
          }}
        />
      )}

      {/* Content layer (parallax: translateZ) */}
      <div
        ref={heightWrapperRef}
        className="relative p-0 w-full"
        style={{ transform: 'translateZ(0px)', height: lockedH ? `${lockedH}px` : undefined, transition: 'height 300ms ease' }}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'height' && !flipped) {
            // After shrink completes, release explicit height back to auto
            setLockedH(undefined)
          }
        }}
      >
        <div
          ref={innerRef}
          className="relative p-5 md:p-6 w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            transform: `translateZ(0) rotateY(${flipped ? 180 : 0}deg)`
          }}
        >
          {/* Front face */}
          <div
            ref={frontRef}
            className="absolute inset-0 w-full h-full backface-hidden overflow-hidden"
            style={{ transform: 'translateZ(0px)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            aria-hidden={flipped}
          >
            <div ref={frontContentRef} className="pt-6 md:pt-8 pb-6 md:pb-8 px-0">
              <div className="mb-2.5 md:mb-3 flex items-center justify-center gap-3 text-center" style={{ transform: 'translateZ(8px)' }}>
                {icon && <div className="text-[#d7b73f]">{icon}</div>}
                <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
              </div>
              <p className="text-gray-300 text-center text-sm sm:text-base" style={{ transform: 'translateZ(6px)' }}>
                {blurb}
              </p>
              <div className="mt-4 md:mt-5 flex justify-center" style={{ transform: 'translateZ(10px)' }}>
                <button
                  className="px-3 py-1.5 text-sm rounded-full border border-white/10 bg-white/5 hover:border-[#d7b73f] hover:text-[#d7b73f] transition-colors"
                  onClick={() => { setExpandedHeight(); setFlipped(true) }}
                  aria-expanded={flipped}
                  aria-controls={`svc-${title.replace(/\s+/g, '-').toLowerCase()}-back`}
                  onKeyDown={onKeyToggle}
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* Back face */}
          <div
            ref={backRef}
            className="absolute inset-0 w-full h-full backface-hidden overflow-auto"
            style={{ transform: 'translateZ(0px) rotateY(180deg)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            aria-hidden={!flipped}
          >
            <div ref={backContentRef} className="flex h-auto w-full flex-col justify-between gap-4 pr-1 text-center py-6 md:py-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {details || 'More information coming soon.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm rounded-full border border-white/10 bg-white/5 hover:border-[#d7b73f] hover:text-[#d7b73f] transition-colors"
                  onClick={() => { setCompactHeight(); setFlipped(false) }}
                  onKeyDown={onKeyToggle}
                >
                  Back
                </button>
                <a
                  href="#contact"
                  className="px-3 py-1.5 text-sm rounded-full border border-[#d7b73f]/50 text-[#d7b73f] hover:border-[#d7b73f] hover:bg-[#d7b73f]/10 transition-colors"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Idle micro-float animation */}
      {!prefersReduced && (
        <div aria-hidden className="absolute inset-0 animate-[float_6s_ease-in-out_infinite] pointer-events-none" />
      )}

      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-2px); } 100% { transform: translateY(0px); } }
      `}</style>
    </motion.div>
  )
}
