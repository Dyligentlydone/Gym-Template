import React from 'react'

type Plan = {
  name: string
  price: string
  features: string[]
  cta?: string
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: '$39/mo',
    features: ['Gym floor access', 'Locker rooms', 'Open gym hours'],
    cta: 'Join Basic',
  },
  {
    name: 'Plus',
    price: '$69/mo',
    features: ['Everything in Basic', 'All classes', 'Guest pass x2/mo'],
    cta: 'Join Plus',
  },
  {
    name: 'All-Access',
    price: '$99/mo',
    features: ['24/7 access', 'Unlimited classes', 'Sauna & recovery room'],
    cta: 'Join All-Access',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">Membership Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {plans.map((p) => (
          <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
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
    </section>
  )
}
