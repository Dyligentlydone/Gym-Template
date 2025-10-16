import React from 'react'

const trainers = [
  { name: 'Alex Carter', role: 'Strength & Conditioning', blurb: 'CSCS, 6+ years coaching athletes and beginners.' },
  { name: 'Jordan Lee', role: 'HIIT & Functional', blurb: 'High-energy classes focused on form and intensity.' },
  { name: 'Sam Rivera', role: 'Mobility & Recovery', blurb: 'Improve range of motion and prevent injuries.' },
]

export default function Trainers() {
  return (
    <section id="trainers" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">Coaches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {trainers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-40 rounded-xl bg-white/10 mb-4"></div>
            <h3 className="heading-oswald text-2xl font-bold">{t.name}</h3>
            <div className="text-white/70">{t.role}</div>
            <p className="text-white/80 mt-2">{t.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
