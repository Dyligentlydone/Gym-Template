import React, { useCallback, useEffect, useRef, useState } from 'react'

interface ParticleMorphingProps {
  scrollProgress: number
}

interface Particle {
  x: number
  y: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  size: number
  color: string
  lineIndex: number
}

export default function ParticleMorphing({ scrollProgress }: ParticleMorphingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [debug, setDebug] = useState(false)
  const dprRef = useRef<number>(1)
  // Masking: cache current card rounded-rectangles (CSS pixels)
  const maskRectsRef = useRef<Array<{left:number; top:number; right:number; bottom:number; radius:number}>>([])
  const lastMaskSampleRef = useRef<number>(0)
  
  // Text content with mobile alternatives
  const getTextLines = useCallback(() => {
    const isMobile = window.innerWidth < 768
    return isMobile ? [
      "{ Dyligent }",
      "( creating and defining data structures )",
      "Done Dyligent."
    ] : [
      "{ Dyligent }",
      "( Code Block / Object / Function Body )",
      "Meaning: Implies Dyligent is the core logic or engine behind something powerful"
    ]
  }, [])

  // Generate particle colors (all lines brand gold)
  const getParticleColor = (_lineIndex: number) => {
    return '#d7b73f' // Brand gold
  }

  // Initialize particles from text
  const initializeParticles = useCallback(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const textLines = getTextLines()
    const particles: Particle[] = []
    
    // Create temporary canvas for text sampling
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width // device pixels
    tempCanvas.height = canvas.height // device pixels
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    // Scale temp context so drawing uses CSS pixel coordinates
    const dpr = dprRef.current || 1
    tempCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const isMobile = window.innerWidth < 768
    const baseFontSize = isMobile ? 24 : 32
    const lineSpacing = baseFontSize * 1.6
    // Use CSS pixel dimensions for layout
    const cssW = canvas.width / dpr
    const cssH = canvas.height / dpr
    const startY = cssH / 2 - ((textLines.length - 1) * lineSpacing / 2)

    textLines.forEach((text, lineIndex) => {
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      
      // Set font based on line
      let fontSize = lineIndex === 0 ? baseFontSize * 1.3 : 
                     lineIndex === 1 ? baseFontSize * 1.1 : 
                     baseFontSize * 0.9
      
      // Use JetBrains Mono for all lines for crisper small-size legibility
      const weight = lineIndex === 0 ? '800' : '700'
      tempCtx.font = `${weight} ${fontSize}px 'JetBrains Mono', monospace`
      tempCtx.fillStyle = 'white'
      tempCtx.textAlign = 'center'
      tempCtx.textBaseline = 'middle'  // Back to middle for consistent positioning
      
      const textY = startY + (lineIndex * lineSpacing)
      const centerX = cssW / 2

      // Fit text to canvas width on narrow screens to avoid clipping
      const safeRatio = cssW < 480 ? 0.9 : 0.85
      const maxTextWidth = cssW * safeRatio
      let metricsFit = tempCtx.measureText(text)
      if (metricsFit.width > maxTextWidth) {
        const scale = Math.max(0.5, maxTextWidth / Math.max(1, metricsFit.width))
        fontSize = Math.max(8, Math.floor(fontSize * scale))
        tempCtx.font = `${weight} ${fontSize}px 'JetBrains Mono', monospace`
      }

      tempCtx.fillText(text, centerX, textY)
      
      // Sample pixels to create particles
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
      const pixels = imageData.data
      
      // Particle counts per line (line 3 needs the most) — increased for denser text
      const maxParticles = lineIndex === 0 ? 2500 : lineIndex === 1 ? 3500 : 9000
      let particleCount = 0

      // Collect candidates within a tight bounding box for higher fidelity
      const solid: Array<{x:number,y:number}> = []

      const metrics = tempCtx.measureText(text)
      const textWidthCss = Math.max(1, Math.floor(metrics.width))
      const marginCss = 2
      const x0Css = Math.floor(centerX - textWidthCss / 2) - marginCss
      const x1Css = Math.ceil(centerX + textWidthCss / 2) + marginCss
      // Approx vertical bounds around the middle baseline we use (CSS px)
      const y0Css = Math.floor(textY - fontSize * 0.7) - marginCss
      const y1Css = Math.ceil(textY + fontSize * 0.4) + marginCss

      // Convert CSS bounds to device pixel bounds for sampling
      const x0 = Math.max(0, Math.floor(x0Css * dpr))
      const x1 = Math.min(tempCanvas.width, Math.ceil(x1Css * dpr))
      const y0 = Math.max(0, Math.floor(y0Css * dpr))
      const y1 = Math.min(tempCanvas.height, Math.ceil(y1Css * dpr))

      // Per-line alpha threshold (smaller lines get slightly lower threshold)
      const alphaThreshold = lineIndex === 0 ? 200 : lineIndex === 1 ? 170 : 130
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          const i = (y * tempCanvas.width + x) * 4
          const a = pixels[i + 3]
          if (a > alphaThreshold) solid.push({ x, y })
        }
      }

      // Shuffle helper
      const shuffleInPlace = <T,>(arr: T[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
      }

      shuffleInPlace(solid)

      // Pick from solid pixels only for crisper strokes
      const pickFrom = (arr: Array<{x:number,y:number}>) => {
        for (let k = 0; k < arr.length && particleCount < maxParticles; k++) {
          const { x, y } = arr[k]
          // Random start position outside canvas
          const angle = Math.random() * Math.PI * 2
          const distance = Math.max(cssW, cssH) * 0.8
          const startX = cssW / 2 + Math.cos(angle) * distance
          const startY2 = cssH / 2 + Math.sin(angle) * distance

          // Convert device pixel coords back to CSS pixel coords for placement
          const xCss = x / dpr
          const yCss = y / dpr

          particles.push({
            x: startX,
            y: startY2,
            startX,
            startY: startY2,
            targetX: xCss,
            targetY: yCss,
            // Uniform small size for all lines for finer detail
            size: 1,
            color: getParticleColor(lineIndex),
            lineIndex
          })
          particleCount++
        }
      }

      pickFrom(solid)

      // If line 3 still needs more fill, densify by adding neighbors around solid pixels
      if (lineIndex === 2 && particleCount < maxParticles && solid.length) {
        // Offsets in device pixels (converted later)
        const offsets: Array<{dx:number, dy:number}> = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
          { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
        ]
        let idx = 0
        while (particleCount < maxParticles) {
          const base = solid[idx % solid.length]
          const off = offsets[(idx / solid.length) % offsets.length | 0]
          const nx = Math.min(Math.max(x0, base.x + off.dx), x1 - 1)
          const ny = Math.min(Math.max(y0, base.y + off.dy), y1 - 1)
          const xCss = nx / dpr
          const yCss = ny / dpr
          const angle = Math.random() * Math.PI * 2
          const distance = Math.max(cssW, cssH) * 0.8
          const startX = cssW / 2 + Math.cos(angle) * distance
          const startY2 = cssH / 2 + Math.sin(angle) * distance
          particles.push({
            x: startX,
            y: startY2,
            startX,
            startY: startY2,
            targetX: xCss,
            targetY: yCss,
            size: 1,
            color: getParticleColor(lineIndex),
            lineIndex
          })
          particleCount++
          idx++
        }
      }
    })

    particlesRef.current = particles
  }, [getTextLines])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Ensure transform matches DPR each frame (in case of DPI change)
    const dpr = dprRef.current || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    // Map scroll progress to animation progress
    // Mobile-only: morph in much sooner
    const isMobileViewport = window.innerWidth < 768
    const morphDivisor = isMobileViewport ? 0.03 : 0.08
    const progress = Math.max(0, Math.min(1, scrollProgress / morphDivisor))
    
    // Global cross-fade as the services section enters the hero viewport
    // When the top of #services reaches ~75% of the viewport height, start fading
    // and be fully faded by ~45% of the viewport height.
    let crossFade = 1
    const servicesEl = document.getElementById('services')
    if (servicesEl) {
      const sr = servicesEl.getBoundingClientRect()
      const start = window.innerHeight * 0.75
      const end = window.innerHeight * 0.45
      // Reuse smoothstep: x is sr.top, transition from start (no fade) to end (full fade)
      const t = Math.min(1, Math.max(0, (start - sr.top) / Math.max(1e-6, start - end)))
      // Ease
      const te = t * t * (3 - 2 * t)
      crossFade = 1 - te
    }
    
    // Update mask rectangles at most every ~200ms
    const now = performance.now()
    if (now - lastMaskSampleRef.current > 200) {
      lastMaskSampleRef.current = now
      const nodes = document.querySelectorAll('[data-card-mask="true"]')
      const rects: Array<{left:number;top:number;right:number;bottom:number;radius:number}> = []
      nodes.forEach((el) => {
        const he = el as HTMLElement
        const r = he.getBoundingClientRect()
        // Only consider if intersects viewport
        if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) {
          const cs = getComputedStyle(he)
          // Parse top-left radius in px; assume uniform for the card
          const tl = parseFloat(cs.borderTopLeftRadius || '0') || 0
          rects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, radius: tl })
        }
      })
      maskRectsRef.current = rects
    }

    const FEATHER_PX = 24 // distance inward from the card edge to reach full mask (increased from 12)
    const INNER_ALPHA_FACTOR = 0.08 // particles at FEATHER_PX inside are 8% opacity (stronger masking)

    // Utility: point inside rounded-rect and distance to nearest border (inside only)
    const distToRoundedRectBorder = (x: number, y: number, rr: {left:number; top:number; right:number; bottom:number; radius:number}): number | null => {
      const { left, top, right, bottom, radius } = rr
      const w = right - left
      const h = bottom - top
      const r = Math.min(radius, Math.min(w, h) / 2)
      // Quick reject outside
      if (x < left || x > right || y < top || y > bottom) return null
      // Distances to non-rounded box edges
      const innerLeft = left + r
      const innerRight = right - r
      const innerTop = top + r
      const innerBottom = bottom - r
      // Inside central rectangle
      if (x >= innerLeft && x <= innerRight && y >= innerTop && y <= innerBottom) {
        const dx = Math.min(x - innerLeft, innerRight - x)
        const dy = Math.min(y - innerTop, innerBottom - y)
        return Math.min(dx, dy)
      }
      // Inside edge bands (left/right/top/bottom) excluding corners
      if (x < innerLeft && y >= innerTop && y <= innerBottom) return x - left
      if (x > innerRight && y >= innerTop && y <= innerBottom) return right - x
      if (y < innerTop && x >= innerLeft && x <= innerRight) return y - top
      if (y > innerBottom && x >= innerLeft && x <= innerRight) return bottom - y
      // Inside rounded corners: distance to the circle border
      // Determine corner center
      const cx = x < innerLeft ? innerLeft : innerRight
      const cy = y < innerTop ? innerTop : innerBottom
      const dx = x - cx
      const dy = y - cy
      const distFromCornerCenter = Math.hypot(dx, dy)
      if (distFromCornerCenter <= r) {
        // distance to border inward
        return r - distFromCornerCenter
      }
      return null
    }

    // Smoothstep helper
    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(1e-6, edge1 - edge0)))
      return t * t * (3 - 2 * t)
    }

    particlesRef.current.forEach((particle) => {
      // Smooth interpolation from start to target
      particle.x = particle.startX + (particle.targetX - particle.startX) * progress
      particle.y = particle.startY + (particle.targetY - particle.startY) * progress
      
      // Opacity based on progress
      const opacity = Math.min(1, progress * 1.2)
      
      if (opacity > 0.01) {
        ctx.save()
        // Rounded, feathered masking inside cards
        let alpha = opacity
        const pxCss = Math.round(particle.x)
        const pyCss = Math.round(particle.y)
        for (let i = 0; i < maskRectsRef.current.length; i++) {
          const m = maskRectsRef.current[i]
          const d = distToRoundedRectBorder(pxCss, pyCss, m)
          if (d !== null) {
            // d = 0 at the border, increases inward; feather to INNER_ALPHA_FACTOR at FEATHER_PX
            const t = smoothstep(0, FEATHER_PX, d)
            const target = opacity * INNER_ALPHA_FACTOR
            alpha = opacity * (1 - t) + target * t
            break
          }
        }
        // Apply global cross-fade so particles phase out under the approaching section
        ctx.globalAlpha = alpha * crossFade
        ctx.fillStyle = particle.color
        
        // No glow for maximum crispness
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
        
        // Draw particle as a crisp square (avoids anti-aliased edges)
        const px = Math.round(particle.x)
        const py = Math.round(particle.y)
        const s = Math.max(1, Math.round(particle.size))
        ctx.fillRect(px, py, s, s)
        
        ctx.restore()
      }
    })

    // Debug info - show text bounds to diagnose sampling issue
    if (debug) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(10, 10, 200, 80)
      ctx.fillStyle = 'white'
      ctx.font = '12px monospace'
      ctx.fillText(`Scroll: ${(scrollProgress * 100).toFixed(1)}%`, 20, 30)
      ctx.fillText(`Progress: ${(progress * 100).toFixed(1)}%`, 20, 45)
      ctx.fillText(`Particles: ${particlesRef.current.length}`, 20, 60)
      // Draw mask rects for debugging
      ctx.strokeStyle = 'rgba(215,183,63,0.6)'
      maskRectsRef.current.forEach(m => {
        ctx.strokeRect(m.left, m.top, m.right - m.left, m.bottom - m.top)
      })
      
      // Simple debug - back to basics
      const textLines = getTextLines()
      const baseFontSize = window.innerWidth < 768 ? 24 : 32
      const lineSpacing = baseFontSize * 1.6
      const dpr = dprRef.current || 1
      const cssW = canvas.width / dpr
      const cssH = canvas.height / dpr
      const startY = cssH / 2 - ((textLines.length - 1) * lineSpacing / 2)
      
      // Count particles per line
      const counts = [0, 0, 0]
      particlesRef.current.forEach(p => {
        if (p.lineIndex < 3) counts[p.lineIndex]++
      })
      ctx.fillText(`Particles: [${counts.join(', ')}]`, 20, 75)
      
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      textLines.forEach((text, lineIndex) => {
        const fontSize = lineIndex === 0 ? baseFontSize * 1.2 : 
                        lineIndex === 1 ? baseFontSize : 
                        baseFontSize * 0.8
        const textY = startY + (lineIndex * lineSpacing)
        
        // Draw simple bounding box
        ctx.strokeRect(cssW / 2 - 200, textY - fontSize, 400, fontSize * 1.5)
      })
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [scrollProgress, debug])

  // Canvas resize handler
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr
    const cssW = window.innerWidth
    const cssH = window.innerHeight
    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)
    // Optional: keep CSS size explicit
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`
    // Prime context transform for CSS pixel drawing
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    
    initializeParticles()
  }, [initializeParticles])

  // Setup
  useEffect(() => {
    resizeCanvas()
    
    const handleResize = () => {
      setTimeout(resizeCanvas, 100)
    }
    
    window.addEventListener('resize', handleResize)
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, resizeCanvas])

  // Debug toggle (dev only; ignore when typing; require modifier to avoid accidental toggles)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (!import.meta.env.DEV || typing) return
      if (e.key === 'd' && (e.metaKey || e.ctrlKey || e.altKey)) {
        setDebug(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ zIndex: 1000 }}
      />
    </div>
  )
}
