import React from 'react'

const testimonials = [
  { name: 'Casey M.', text: 'Best gym I’ve joined. Coaches actually care and the energy is unmatched.' },
  { name: 'Taylor R.', text: 'I finally hit my goals. Classes are tough, form-focused, and fun.' },
  { name: 'Morgan K.', text: 'Clean facility, great equipment, and a real community vibe.' },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">What members say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {testimonials.map((t) => (
          <div key={t.name} data-card-mask="true" className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/90">“{t.text}”</p>
            <div className="mt-4 text-white/60">— {t.name}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
