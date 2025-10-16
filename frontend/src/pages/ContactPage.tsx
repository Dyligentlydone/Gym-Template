import React from 'react'
import ContactMinimal from '../components/ContactMinimal'
import AnimatedBackground from '../components/AnimatedBackground'

export default function ContactPage() {
  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="heading-oswald text-3xl sm:text-4xl font-extrabold text-center mb-6">Contact us</h1>
        <p className="text-center text-white/80 mb-8">Have a question or want to tour the gym? Send us a message and we’ll get back to you.</p>
        <ContactMinimal />
      </div>
    </div>
  )
}
