import React from 'react'

type Plan = {
  name: string
  price: string
  features: string[]
  cta?: string
}

const plans: Plan[] = [
  {
    name: 'Free Workout',
    price: '$0',
    features: ['24hr free pass'],
    cta: 'Claim Offer',
  },
  {
    name: '1 Week',
    price: '$25',
    features: ['Full week access', 'All equipment', 'Locker room access'],
    cta: 'Start Today',
  },
  {
    name: '2 Weeks',
    price: '$35',
    features: ['Two full weeks', 'All equipment', 'Locker room access', '1 guest pass'],
    cta: 'Get Started',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">Come on in!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {plans.map((p) => (
          <div key={p.name} data-card-mask="true" className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
            <h3 className="heading-oswald text-2xl font-bold">{p.name}</h3>
            <div className="text-3xl font-extrabold mt-2">{p.price}</div>
            <ul className="mt-4 space-y-2 text-white/80">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><span className="text-[#39A0ED]">•</span><span>{f}</span></li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <a href="#contact" className="block text-center rounded-lg bg-[#39A0ED] hover:bg-[#2f8bd0] text-black font-semibold py-2.5">
                {p.cta || 'Join now'}
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10 relative z-10">
        <a 
          href="#contact" 
          className="inline-block rounded-lg bg-[#39A0ED] hover:bg-[#2f8bd0] text-black font-bold px-10 py-4 text-lg shadow-lg hover:scale-105 transition-all duration-300 relative z-10"
        >
          Get a membership
        </a>
      </div>
    </section>
  )
}
