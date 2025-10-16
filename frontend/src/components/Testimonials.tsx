import React from 'react'
import GoogleReviewsCarousel from './GoogleReviewsCarousel';

const testimonials = [
  { name: 'Casey M.', text: 'Best gym I\'ve joined. The energy is unmatched and the facilities are top-notch.' },
  { name: 'Taylor R.', text: 'I finally hit my fitness goals thanks to the supportive community and great equipment.' },
  { name: 'Morgan K.', text: 'Clean facility, great equipment, and a real community vibe. Highly recommend!' },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-8">
          <h2 
            data-card-mask="true"
            className="heading-oswald text-3xl sm:text-4xl font-extrabold mb-4 inline-block px-6 py-2"
          >
            What Our Members Say
          </h2>
          <p 
            data-card-mask="true"
            className="text-white/90 text-sm sm:text-base lg:text-lg xl:text-xl italic font-light leading-tight sm:leading-normal lg:leading-relaxed w-full max-w-[90vw] sm:max-w-3xl mx-auto py-3 sm:py-4 lg:py-6 px-4 sm:px-6 break-words break-all sm:break-normal hyphens-auto"
          >
            Don't just take our word for it. Here's what our members say about their gym experience.
          </p>
        </div>
        
        {/* Google Reviews Carousel */}
        <GoogleReviewsCarousel />

        {/* Rating Metrics - Moved below Google Reviews */}
        <div className="text-center mt-8">
          <div 
            data-card-mask="true" 
            className="inline-flex items-center justify-center px-8 py-4"
          >
            <div className="text-center mr-6">
              <div className="text-4xl font-bold text-white">4.9</div>
              <div className="text-white/70 text-sm">out of 5</div>
            </div>
            <div className="h-16 w-px bg-white/20"></div>
            <div className="ml-6 text-left">
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-white/80 text-sm">190+ reviews</span>
              </div>
              <div className="text-sm text-white/60">Rated #1 Gym in Grand Rapids</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
