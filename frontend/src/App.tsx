import './App.css'
import AnimatedBackground from './components/AnimatedBackground'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import ParticleMorphing from './components/ParticleMorphing'
import ServiceCard from './components/ServiceCard'
import { servicesData } from './services/data'
// Rotating roles removed for gym template
import ContactMinimal from './components/ContactMinimal'
import Pricing from './components/Pricing'
import Trainers from './components/Trainers'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import LocationBlock from './components/Location'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

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
      {/* Top navigation centered; single-line fit on mobile with abbreviated labels */}
      <nav className="absolute top-0 left-0 w-full z-30">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-center max-w-full overflow-visible">
          <ul className="flex items-center gap-2 sm:gap-7 text-[11px] sm:text-sm whitespace-nowrap flex-nowrap">
            <li>
              <a href="#services" className="text-white visited:text-white inline-block px-2 sm:px-3 py-1 rounded-full border border-transparent transition-colors hover:text-[#d7b73f] hover:border-[#d7b73f]">
                <span className="sm:hidden">What we do</span>
                <span className="hidden sm:inline">What we do</span>
              </a>
            </li>
            <li>
              <a href="#about" className="text-white visited:text-white inline-block px-2 sm:px-3 py-1 rounded-full border border-transparent transition-colors hover:text-[#d7b73f] hover:border-[#d7b73f]">
                <span className="sm:hidden">About</span>
                <span className="hidden sm:inline">About us</span>
              </a>
            </li>
            <li>
              <a href="#work" className="text-white visited:text-white inline-block px-2 sm:px-3 py-1 rounded-full border border-transparent transition-colors hover:text-[#d7b73f] hover:border-[#d7b73f]">
                <span className="sm:hidden">Projects</span>
                <span className="hidden sm:inline">Done Dyligents</span>
              </a>
            </li>
            <li>
              <a href="#contact" className="text-white visited:text-white inline-block px-2 sm:px-3 py-1 rounded-full border border-transparent transition-colors hover:text-[#d7b73f] hover:border-[#d7b73f]">
                <span className="sm:hidden">Contact us</span>
                <span className="hidden sm:inline">Contact us</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Hero heading pinned to top */}
        <div className="absolute left-0 w-full z-20 top-16 sm:top-20 md:top-24 lg:top-28">
          <div className="container mx-auto px-4 pt-4 pb-4 flex flex-col items-center gap-3 sm:gap-4">
            <h1 className="text-center text-white font-extrabold tracking-tight leading-tight text-2xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Train Hard. Evolve Strong.
            </h1>
            <p className="text-center text-white/90 max-w-3xl text-sm sm:text-base md:text-lg leading-snug sm:leading-snug md:leading-normal">
              Strength. Conditioning. Community. Everything you need to level up—under one roof.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#pricing" className="rounded-lg bg-[#39A0ED] hover:bg-[#2f8bd0] text-black font-semibold px-4 py-2">Join now</a>
              <a href="#location" className="rounded-lg border border-white/30 hover:border-white/60 text-white font-semibold px-4 py-2">Book a tour</a>
            </div>
          </div>
        </div>

        <div id="services" className="mt-[58vh] sm:mt-[68vh] md:mt-[77vh] lg:mt-[88vh] py-32">
          <h2 className="text-center font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl mb-8">What we do</h2>
          <div className="w-full grid grid-cols-1 gap-8 place-items-stretch cards-grid-2-wide max-w-[1700px] mx-auto">
            {servicesData.map((svc) => (
              <ServiceCard key={svc.id} title={svc.title} blurb={svc.blurb} details={svc.details} />
            ))}
          </div>
        </div>

        {/* Pricing */}
        <Pricing />

        {/* Trainers */}
        <Trainers />

        {/* Gallery */}
        <Gallery />

        {/* Testimonials */}
        <Testimonials />

        {/* Contact Section */}
        <div id="contact" className="w-full px-4 pb-24 mt-24">
          <ContactMinimal />
        </div>

        {/* Location / Hours */}
        <LocationBlock />

        {/* FAQ */}
        <FAQ />
      </div>
      <Footer />
    </div>
  )
}

export default App
