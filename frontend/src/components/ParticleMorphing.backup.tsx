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
  opacity: number
  color: string
  speed: number
  active: boolean
  activationThreshold: number
  textGroup: number // Which text line the particle belongs to
}

export default function ParticleMorphing({ scrollProgress }: ParticleMorphingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [debug, setDebug] = useState(false) // Disable for production
  const [initialized, setInitialized] = useState(false) // Track if particles are initialized
  
  // Text content for each line - with responsive alternatives for mobile
  const [textLines, setTextLines] = useState<string[]>([
    "{ Dyligent }", // First line
    "( Code Block / Object / Function Body )", // Second line with parentheses
    "Meaning: Implies Dyligent is the core logic or engine behind something powerful" // Full third line
  ])

  // Mobile-friendly text alternatives
  const mobileTextLines = [
    "{ Dyligent }", // First line remains the same
    "( creating and defining data structures )", // Custom second line
    "Done Dyligent." // Custom third line
  ]

  // Store animation state and scroll tracking in refs to avoid re-renders
  const lastScrollProgressRef = useRef<number>(0)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  
  // Update scroll direction
  useEffect(() => {
    if (scrollProgress > lastScrollProgressRef.current) {
      scrollDirectionRef.current = 'down'
    } else if (scrollProgress < lastScrollProgressRef.current) {
      scrollDirectionRef.current = 'up'
    }
    
    // Save for next comparison
    lastScrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  // Check if device is mobile-sized
  const checkIfMobile = useCallback(() => {
    const isMobile = window.innerWidth < 768
    // Use appropriate text content based on screen size
    setTextLines(isMobile ? mobileTextLines : [
      "{ Dyligent }", // First line
      "( Code Block / Object / Function Body )", // Second line with parentheses
      "Meaning: Implies Dyligent is the core logic or engine behind something powerful" // Full third line
    ])
  }, [mobileTextLines])

  // Initialize particles
  const initializeParticles = useCallback(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate base font size and line spacing with improved mobile responsiveness
    const isMobile = window.innerWidth < 768
    const baseScale = isMobile ? 0.055 : 0.07 // Reduced scale on mobile
    const baseFontSize = Math.max(isMobile ? 20 : 30, Math.min(isMobile ? 40 : 50, Math.min(canvas.width, canvas.height) * baseScale))
    const lineSpacing = baseFontSize * (isMobile ? 1.1 : 1.3) // Tighter spacing on mobile
    
    // Calculate text positions
    const textX = canvas.width / 2
    const startY = (canvas.height / 2) - ((textLines.length - 1) * lineSpacing / 2)

    // Create a temporary canvas to get pixel data
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    // Collect points for all text lines
    const textPointsGroups: { x: number, y: number, group: number }[] = []
    
    textLines.forEach((textLine, lineIndex) => {
      // Calculate font size for this line - third line properly sized now
      const fontSize = lineIndex === 0 ? baseFontSize * 1.3 : // Main text much larger
                      lineIndex === 1 ? baseFontSize * 1.0 : // Second line at full base size
                      baseFontSize * 0.75 // Third line slightly larger but still compact
      
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      // Use a more legible font stack
      tempCtx.font = `${lineIndex === 0 ? 'bold' : 'normal'} ${fontSize}px 'Helvetica', 'Arial', sans-serif`
      tempCtx.fillStyle = 'white'
      tempCtx.textAlign = 'center'
      tempCtx.textBaseline = 'middle'
      
      // Add stroke for better definition
      tempCtx.lineWidth = lineIndex === 0 ? 3 : 2 // Thicker stroke
      tempCtx.strokeStyle = 'white'
      
      // Add background to increase contrast
      if (lineIndex === 1) {
        tempCtx.fillStyle = 'rgba(0, 0, 0, 0.6)' // Semi-transparent background for second line
      } else if (lineIndex === 2) {
        tempCtx.fillStyle = 'rgba(0, 0, 0, 0.7)' // Darker background for third line
      } else {
        tempCtx.fillStyle = 'rgba(0, 0, 0, 0.5)' // Light background for first line
      }
      
      // Calculate Y position for this line
      const textY = startY + (lineIndex * lineSpacing)
      
      // Draw the text with stroke for better definition
      tempCtx.strokeText(textLine, textX, textY)
      
      // Reset fill color to white for actual text
      tempCtx.fillStyle = 'white'
      tempCtx.fillText(textLine, textX, textY)
      
      // Get pixel data for this line
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
      const pixels = imageData.data

      // Collect points where text is drawn (non-transparent pixels)
      // Balanced sampling for performance and readability
      const sampleRate = lineIndex === 0 ? 2 : // Reduced sampling for first line
                       lineIndex === 1 ? 2 : // Better sampling for second line readability
                       2; // Better sampling for third line readability
      for (let y = 0; y < tempCanvas.height; y += sampleRate) { 
        for (let x = 0; x < tempCanvas.width; x += sampleRate) {
          const i = (y * tempCanvas.width + x) * 4
          // Only consider pixels with sufficient opacity but lower threshold for denser sampling
          if (pixels[i + 3] > 100) { // Lower threshold to capture more edge pixels
            textPointsGroups.push({ x, y, group: lineIndex })
          }
        }
      }
    })

    // Create particles - reduce count for better performance while maintaining legibility
    const newParticles: Particle[] = []
    
    // Line-specific particle counts - closer to original values
    const getMaxParticlesForLine = (lineIndex: number) => {
      // Particle counts similar to original
      if (lineIndex === 0) return 1500; // First line - closer to original 1800
      if (lineIndex === 1) return 1200; // Second line - original value
      return 2800; // Third line - closer to original 3500
    }
    
    // Generate colors based on text group
    const generateColor = (group: number) => {
      // Much less variation for more consistent colors
      const variation = Math.floor(Math.random() * 10)
      
      if (group === 0) { // First line - gold color
        const r = 255
        const g = 215 - variation
        const b = 0
        return `rgb(${r}, ${g}, ${b})`
      } else if (group === 1) { // Second line - vibrant cyan for better visibility
        const r = 0
        const g = 230 - variation
        const b = 255
        return `rgb(${r}, ${g}, ${b})`
      } else { // Third line - brighter white with slight yellow tint for better visibility
        return `rgb(255, 255, 240)`
      }
    }
    
    // Process each text group separately
    const textLineGroups = textPointsGroups.reduce((groups, point) => {
      if (!groups[point.group]) groups[point.group] = []
      groups[point.group].push(point)
      return groups
    }, {} as Record<number, {x: number, y: number, group: number}[]>)
    
    // Create particles for each line
    Object.entries(textLineGroups).forEach(([groupIdStr, points]) => {
      const groupId = parseInt(groupIdStr)
      const particleCount = Math.min(points.length, getMaxParticlesForLine(groupId))
      
      for (let i = 0; i < particleCount; i++) {
        // Use random points for more organic look
        const pointIndex = Math.floor(Math.random() * points.length)
        const point = points[pointIndex]
        
        // Generate start position outside canvas
        let startX, startY
        const margin = 100 // Distance outside canvas
        
        // Random positions outside the canvas boundaries
        const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
        
        switch(side) {
          case 0: // top
            startX = Math.random() * (canvas.width + margin * 2) - margin
            startY = -margin * Math.random()
            break
          case 1: // right
            startX = canvas.width + margin * Math.random()
            startY = Math.random() * (canvas.height + margin * 2) - margin
            break
          case 2: // bottom
            startX = Math.random() * (canvas.width + margin * 2) - margin
            startY = canvas.height + margin * Math.random()
            break
          case 3: // left
            startX = -margin * Math.random()
            startY = Math.random() * (canvas.height + margin * 2) - margin
            break
          default:
            startX = 0
            startY = 0
        }

        // Set specific activation thresholds by line for clearer formation
        // Ensure third line appears at similar time as the others
        let activationThreshold = 0.05 + Math.random() * 0.15 + (groupId === 2 ? 0.05 : groupId * 0.10) // Lower threshold for third line
        
        if (i < particleCount * 0.2) { // First 20% of particles in this line
          activationThreshold += (i / (particleCount * 0.2)) * 0.2 // 0 to 0.2
        } else {
          activationThreshold += 0.2 + ((i - particleCount * 0.2) / (particleCount * 0.8)) * 0.3 // 0.2 to 0.5
        }
        
        // Clamp activation threshold to max 0.8 to ensure all particles appear
        activationThreshold = Math.min(0.8, activationThreshold)

        const newParticle: Particle = {
          startX,
          startY,
          x: startX,
          y: startY,
          targetX: point.x,
          targetY: point.y,
          // Size based on text group - increased third line particle size
          size: groupId === 0 ?
                Math.random() * 0.4 + 0.2 : // Unchanged for first line
                groupId === 1 ?
                Math.random() * 0.35 + 0.2 : // Unchanged for second line
                Math.random() * 0.25 + 0.15, // Larger particles for third line visibility
          
          // Increased opacity across the board for better visibility with smaller particles
          opacity: groupId === 2 ?
                  Math.random() * 0.05 + 0.95 : // Maximum opacity for third line
                  Math.random() * 0.1 + 0.9, // High opacity for others
          color: generateColor(groupId),
          speed: Math.random() * 0.02 + 0.01,
          active: false,
          activationThreshold: activationThreshold,
          textGroup: groupId
        }

        newParticles.push(newParticle)
      }
    })

    // Sort particles by activation threshold for smoother reveal
    newParticles.sort((a, b) => a.activationThreshold - b.activationThreshold)
    particlesRef.current = newParticles
    
    // Set initialization flag when particles are ready
    setInitialized(true)
  }, [textLines])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate activation progress - narrower scroll range for faster text formation
    const minScroll = 0.0
    const maxScroll = 0.08 // Narrower range to form text more quickly and clearly
    
    // For debugging - print scroll progress value
    if (debug) console.log('📜 Current scroll value:', scrollProgress)
    
    // Ensure progress calculation works correctly
    // This maps scroll from 0-10% to progress 0-100%
    const progress = Math.max(0, Math.min(1, (scrollProgress - minScroll) / (maxScroll - minScroll)))
    
    // For debugging
    if (debug) console.log('Progress mapped to 0-1:', progress.toFixed(3))
    
    // Process all particles only if initialization is complete
    let activeCount = 0
    let visibleCount = 0
    
    // Skip drawing particles if not initialized yet
    if (!initialized) {
      // Continue animation loop but don't draw anything
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    
    particlesRef.current.forEach((particle, index) => {
      // At 0% scroll, particles should be completely invisible
      if (progress <= 0) {
        return // Skip drawing entirely
      }
      
      // Each particle has its own activation threshold
      // This creates a phased appearance as you scroll
      const startThreshold = particle.activationThreshold * 0.4 // Reduced to make text appear earlier
      
      // Only process particles that should be visible based on scroll progress
      if (progress > startThreshold) {
        visibleCount++
        
        // Calculate how much this particle has progressed
        // Map the particle's movement from its start threshold to full formation
        const particleProgress = Math.min(1, (progress - startThreshold) / (1 - startThreshold))
        
        // Linear interpolation between start and target positions
        particle.x = particle.startX + (particle.targetX - particle.startX) * particleProgress
        particle.y = particle.startY + (particle.targetY - particle.startY) * particleProgress
        
        // Opacity scales with progress - completely transparent at 0
        // Minimum opacity at startThreshold, full opacity when fully formed
        const opacity = particleProgress * particle.opacity
        
        // Only draw if there's some visibility
        if (opacity > 0.01) {
          activeCount++
          particle.active = true
          
          ctx.save()
          ctx.globalAlpha = opacity
          
          // Add minimal glow effects for better readability
          // First line gets full glow, other lines get smaller glow
          if (particle.textGroup === 0) {
            ctx.shadowBlur = particleProgress * 1.5 // Reduced blur amount
            ctx.shadowColor = particle.color
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
          } else {
            // Add minimal glow to lines 2 and 3 for better readability
            ctx.shadowBlur = particleProgress * 0.8
            ctx.shadowColor = particle.color
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
          }
          ctx.fillStyle = particle.color
          
          // Draw the particle with outline for better definition
          const particleRadius = particle.size * Math.max(0.5, particleProgress)
          
          // Fill the particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particleRadius, 0, Math.PI * 2)
          ctx.fill()
          
          // Add outline to all particles, but with varying thickness for better balance
          ctx.strokeStyle = particle.color
          // Use thinner lines for better performance while maintaining readability
          ctx.lineWidth = particle.textGroup === 0 ? 0.5 : 0.3
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particleRadius + (particle.textGroup === 0 ? 0.2 : 0.1), 0, Math.PI * 2)
          ctx.stroke()
          
          ctx.restore()
        }
      }
    })
    
    // Debug info
    if (debug) console.log(`Visible/Active/Total: ${visibleCount}/${activeCount}/${particlesRef.current.length}`)
    
    // Draw debug info
    drawDebugInfo(ctx)
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate)
  }, [debug, scrollProgress])

  // Draw debug information on the canvas
  const drawDebugInfo = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!debug) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    // Count active particles by group
    const particlesByGroup: Record<number, {active: number, total: number}> = {}
    textLines.forEach((_, index) => {
      particlesByGroup[index] = { active: 0, total: 0 }
    })

    particlesRef.current.forEach(p => {
      if (!particlesByGroup[p.textGroup]) particlesByGroup[p.textGroup] = { active: 0, total: 0 }
      particlesByGroup[p.textGroup].total++
      if (p.active) particlesByGroup[p.textGroup].active++
    })

    // Draw debug info background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(20, 20, 300, 110)

    ctx.font = '14px monospace'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    // General info
    ctx.fillText(`Scroll Progress: ${(scrollProgress * 100).toFixed(1)}%`, 30, 30)
    
    // Per text line info
    Object.entries(particlesByGroup).forEach(([group, counts], idx) => {
      ctx.fillText(`Line ${parseInt(group) + 1}: ${counts.active}/${counts.total}`, 30, 50 + idx * 20)
    })
  }, [debug, scrollProgress, textLines])

  // Canvas resize handler
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Check if mobile and adjust text content
    checkIfMobile()
    
    // Re-initialize particles with new dimensions and text
    initializeParticles()
  }, [initializeParticles, checkIfMobile])

  // Initial check for mobile
  useEffect(() => {
    checkIfMobile()
  }, [])

  // Set up canvas and animation
  useEffect(() => {
    resizeCanvas()
    // Add debounced resize handler to prevent excessive particle recalculation
    let resizeTimer: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeCanvas()
      }, 250) // Debounce resize events
    }
    
    window.addEventListener('resize', handleResize)
    
    // Start animation at full frame rate
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initializeParticles, resizeCanvas])
  
  // Add keyboard shortcut to toggle debug mode (press 'd')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd') {
        setDebug(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ zIndex: 1000 }}
      />
      {debug && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded text-sm">
          <div>Scroll: {(scrollProgress * 100).toFixed(1)}%</div>
          <div>Activation: {Math.min(100, Math.round((scrollProgress - 0.0) / 0.08 * 100))}%</div>
          <div>Particles: {particlesRef.current.length}</div>
          <div>Visible: {particlesRef.current.filter(p => {
            const minScroll = 0.0
            const maxScroll = 0.08
            const progress = Math.max(0, Math.min(1, (scrollProgress - minScroll) / (maxScroll - minScroll)))
            return progress > p.activationThreshold * 0.4
          }).length}</div>
          <div>Direction: {scrollDirectionRef.current}</div>
          <button 
            className="mt-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            onClick={() => setDebug(false)}
          >
            Hide Debug
          </button>
        </div>
      )}
    </div>
  )
}
