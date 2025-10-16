import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LocationBlock() {
  return (
    <section id="location" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">Location & Hours</h2>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          data-card-mask="true"
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="heading-oswald text-2xl font-bold mb-2">Address</h3>
          <p className="text-white/80">1625 Leonard St NE<br/>Grand Rapids, MI 49505</p>
          <h3 className="heading-oswald text-2xl font-bold mt-6 mb-2">Hours</h3>
          <ul className="text-white/80 space-y-1 mb-6">
            <li>Mon–Fri: 5:00 AM – 10:00 PM</li>
            <li>Sat: 7:00 AM – 8:00 PM</li>
            <li>Sun: 8:00 AM – 6:00 PM</li>
          </ul>
          <div className="text-center">
            <Link 
              to="/contact" 
              className="inline-block rounded-lg bg-[#39A0ED] hover:bg-[#2f8bd0] text-black font-bold px-10 py-3 text-lg shadow-lg hover:scale-105 transition-all duration-300 relative z-10"
            >
              Contact us
            </Link>
          </div>
        </div>
        <div 
          data-card-mask="true"
          className="rounded-2xl overflow-hidden border border-white/10"
        >
          <iframe
            title="Gym Map"
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019345!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzMwLjAiTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1680000000000"
          />
        </div>
      </div>
    </section>
  )
}
