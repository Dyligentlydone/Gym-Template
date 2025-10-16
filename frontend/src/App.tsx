import './App.css'
import AnimatedBackground from './components/AnimatedBackground'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import ParticleMorphing from './components/ParticleMorphing'
// Rotating roles removed for gym template
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import LocationBlock from './components/Location'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { Link } from 'react-router-dom'

function App() {
  // Track scroll progress (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0)
  // Per-interaction slow control: slow the first event after an idle gap
  const GLOBAL_SCROLL_FACTOR = 0.25 // 25% of normal speed for all wheel events
  const MAX_PER_EVENT_PX = 120 // clamp momentum to feel natural
  // Set up scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down the page we've scrolled (0 to 1)
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrollTop / docHeight))
      setScrollProgress(progress)
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll)
    // Trigger initial calculation
    handleScroll()

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debug log for scroll progress
  useEffect(() => {
    console.log('Current scroll progress:', scrollProgress)
  }, [scrollProgress])

  // Uniform slowdown for all wheel events (no interaction-based damping)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Normalize delta in case deltaMode is lines/pages
      const lineHeight = 16
      const normalizedDelta =
        e.deltaMode === 1 ? e.deltaY * lineHeight : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      // Apply uniform slowdown with clamp
      e.preventDefault()
      const clamped = Math.max(-MAX_PER_EVENT_PX, Math.min(MAX_PER_EVENT_PX, normalizedDelta))
      window.scrollBy({ top: clamped * GLOBAL_SCROLL_FACTOR, behavior: 'auto' })
    }

    // passive: false so we can call preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      <ParticleMorphing scrollProgress={scrollProgress} />
      
      {/* Gym Logo */}
      <div className="relative z-10 w-full flex justify-center pt-2">
        <img 
          src="/assets/gym-logo.png"
          alt="GR City Gym Logo"
          className="h-36 w-auto object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
      {/* Top navigation removed per request */}
      <div className="container mx-auto px-4 pt-4 sm:pt-8 md:pt-12 flex flex-col items-center min-h-screen">
        {/* Hero at the very top */}
        <section className="w-full max-w-4xl text-center pb-8">
          <h1 className="text-white font-extrabold tracking-tight leading-tight text-3xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Oswald, sans-serif' }}>
            Fitness Hub Of Grand Rapids
          </h1>
          <p className="mx-auto mt-3 text-white/90 max-w-2xl text-base sm:text-lg">
            Where everyone belongs, and getting fit feels easy.
          </p>
          <div className="flex gap-3 mt-5 justify-center">
            <a href="#pricing" className="rounded-lg bg-[#39A0ED] hover:bg-[#2f8bd0] text-black font-semibold px-5 py-2.5">Join now</a>
            <a href="#location" className="rounded-lg border border-white/30 hover:border-white/60 text-white font-semibold px-5 py-2.5">Book a tour</a>
          </div>
        </section>

        {/* Spacer opening where particle morphing comes together */}
        <div className="w-full" aria-hidden>
          <div className="h-[58vh] sm:h-[60vh] md:h-[62vh]"></div>
        </div>

        {/* Removed What we do section for gym template */}

        {/* Pricing */}
        <div id="pricing" className="w-full">
          <Pricing />
        </div>

        {/* Facilities section removed from home */}

        {/* Testimonials */}
        <Testimonials />

        {/* Location / Hours */}
        <LocationBlock />

        {/* FAQ */}
        <FAQ />

        {/* Owner's Quote */}
        <div className="w-full max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <blockquote 
              data-card-mask="true"
              className="text-white/90 text-lg sm:text-xl md:text-2xl italic font-light leading-relaxed max-w-3xl mx-auto py-8 px-4"
            >
              "My dream is to provide a gym for the community that breaks down the barriers for people to work out. Getting to the gym can be hard enough already, so my goal is to make the gym the fitness hub of Grand Rapids."
              <footer className="mt-6 not-italic font-semibold text-white text-lg">— Jeff Phillips, Owner</footer>
            </blockquote>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
