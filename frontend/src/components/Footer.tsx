import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 py-16 bg-black border-t border-gray-800 text-white/70 relative z-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="heading-oswald text-white text-xl">GR City Gym</div>
          <p className="mt-2">Your premier fitness destination in Grand Rapids</p>
          <p className="mt-2 text-sm">Strong body. Strong mind. Stronger you.</p>
        </div>
        <div>
          <div className="heading-oswald text-white text-xl">Links</div>
          <ul className="mt-2 space-y-1">
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            <li><a href="#gallery" className="hover:text-white">Facilities</a></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="heading-oswald text-white text-xl">Visit Us</div>
          <ul className="mt-2 space-y-1">
            <li>1625 Leonard St NE</li>
            <li>Grand Rapids, MI 49505</li>
            <li className="mt-2">
              <a href="mailto:info@grcitygym.com" className="hover:text-white">info@grcitygym.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-white/50 mt-8 text-sm">© {new Date().getFullYear()} GR City Gym. All rights reserved.</div>
    </footer>
  )
}
