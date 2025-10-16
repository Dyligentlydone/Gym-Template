import React, { useEffect, useRef, useState } from 'react'

interface ParticleMorphingProps {
  scrollProgress: number
}

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  opacity: number
  color: string
  speed: number
  active: boolean
  activationThreshold: number
}

export default function ParticleMorphing({ scrollProgress }: ParticleMorphingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [debug, setDebug] = useState(true)
  const text = '{ Dyligent }'
  
  // Store animation state and scroll tracking in refs to avoid re-renders
  const lastScrollProgressRef = useRef<number>(0)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')

  // Generate particles from text
  const generateParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas and set up text
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = 'bold 120px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    // Get text pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const particles: Particle[] = []

    // Sample pixels to create particles (use a step size to control density)
    const stepSize = 3
    for (let y = 0; y < canvas.height; y += stepSize) {
      for (let x = 0; x < canvas.width; x += stepSize) {
        const index = (y * canvas.width + x) * 4
        const alpha = data[index + 3]

        if (alpha > 100) {
          // Create particle with random starting position from edges
          const startPosition = getRandomEdgePosition(canvas.width, canvas.height)
          
          // Each particle gets an activation threshold between 0 and 1
          // This will be compared against normalized scroll progress (0-1)
          const particle: Particle = {
            x: startPosition.x,
            y: startPosition.y,
            targetX: x,
            targetY: y,
            size: Math.random() * 1.5 + 1.5, // Size between 1.5 and 3
            opacity: Math.random() * 0.3 + 0.7, // Opacity between 0.7 and 1.0
            color: `rgba(255, ${Math.floor(Math.random() * 40) + 200}, ${Math.floor(Math.random() * 60)}, 1)`,
            speed: Math.random() * 0.02 + 0.01, // Speed between 0.01 and 0.03
            active: false,
            activationThreshold: Math.random() // Random threshold between 0 and 1
          }
          particles.push(particle)
        }
      }
    }

    // Sort particles by activation threshold for smoother reveal
    particles.sort((a, b) => a.activationThreshold - b.activationThreshold)
    
    // Distribute activation thresholds evenly from 0 to 1
    particles.forEach((particle, index) => {
      particle.activationThreshold = index / particles.length
    })

    particlesRef.current = particles
    console.log(`Generated ${particles.length} particles`)
  }

  // Get random position from canvas edges
  const getRandomEdgePosition = (width: number, height: number) => {
    const edge = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    
    switch (edge) {
      case 0: // top
        return { x: Math.random() * width, y: 0 }
      case 1: // right
        return { x: width, y: Math.random() * height }
      case 2: // bottom
        return { x: Math.random() * width, y: height }
      case 3: // left
        return { x: 0, y: Math.random() * height }
      default:
        return { x: 0, y: 0 }
    }
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate activation progress (1% to 23% scroll)
    const minScroll = 0.01
    const maxScroll = 0.23
    const progress = Math.max(0, Math.min(1, (scrollProgress - minScroll) / (maxScroll - minScroll)))

    // Update scroll direction
    if (scrollProgress > lastScrollProgressRef.current) {
      scrollDirectionRef.current = 'down'
    } else if (scrollProgress < lastScrollProgressRef.current) {
      scrollDirectionRef.current = 'up'
    }
    lastScrollProgressRef.current = scrollProgress
    
    if (debug) {
      console.log('🔄 Scroll progress:', (scrollProgress * 100).toFixed(2) + '%', 'Direction:', scrollDirectionRef.current)
    }
    
    // Process particles based on scroll progress
    particlesRef.current.forEach(particle => {
      // Activate particles based on scroll progress and their threshold
      if (progress >= particle.activationThreshold && !particle.active) {
        particle.active = true
      } else if (progress < particle.activationThreshold && particle.active) {
        particle.active = false
      }
      
      // Only draw and move active particles
      if (particle.active) {
        // Move particle towards target
        const dx = particle.targetX - particle.x
        const dy = particle.targetY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 1) {
          particle.x += dx * particle.speed
          particle.y += dy * particle.speed
        }
        
        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.shadowBlur = 8
        ctx.shadowColor = particle.color
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate)
  }

  // Handle canvas resize and setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Regenerate particles when canvas is resized
      generateParticles()
    }

    // Initial setup
    resizeCanvas()
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate)
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Effect to handle scroll progress changes
  useEffect(() => {
    // No need to do anything special here - the animate function
    // already uses the latest scrollProgress value
  }, [scrollProgress])

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
          <div>Activation: {Math.min(100, Math.round((scrollProgress - 0.01) / 0.22 * 100))}%</div>
          <div>Particles: {particlesRef.current.length}</div>
          <div>Active: {particlesRef.current.filter(p => p.active).length}</div>
          <div>Direction: {scrollDirectionRef.current}</div>
        </div>
      )}
    </div>
  )
}
