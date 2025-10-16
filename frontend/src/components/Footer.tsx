import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-24 py-10 border-t border-white/10 text-white/70">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="heading-oswald text-white text-xl">GR City Gym</div>
          <p className="mt-2">Strong body. Strong mind.</p>
        </div>
        <div>
          <div className="heading-oswald text-white text-xl">Links</div>
          <ul className="mt-2 space-y-1">
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            <li><a href="#gallery" className="hover:text-white">Facilities</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="heading-oswald text-white text-xl">Contact</div>
          <ul className="mt-2 space-y-1">
            <li>123 Fitness Ave, Your City</li>
            <li>(555) 000-0000</li>
            <li>info@grcitygym.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-white/50 mt-8 text-sm">© {new Date().getFullYear()} GR City Gym. All rights reserved.</div>
    </footer>
  )
}
