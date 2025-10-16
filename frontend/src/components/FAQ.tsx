import React from 'react'

const faqs = [
  { q: 'Do you offer a free trial?', a: 'Yes. Claim a 3-day pass and try any class.' },
  { q: 'What memberships do you have?', a: 'Basic, Plus, and All-Access—cancel anytime.' },
  { q: 'Do you have personal training?', a: 'Yes. Book a 1:1 session or purchase a package.' },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20 relative z-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">FAQs</h2>
      <div 
        data-card-mask="true"
        className="max-w-4xl mx-auto px-4 divide-y divide-gray-800 rounded-2xl border border-gray-800 bg-black shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        {faqs.map((f, i) => (
          <details key={i} className="p-6 hover:bg-gray-800/50 transition-colors duration-200 group">
            <summary className="cursor-pointer heading-oswald text-xl text-white group-hover:text-blue-400 transition-colors duration-200 list-none">
              {f.q}
              <span className="float-right text-blue-400 group-hover:translate-x-1 transition-transform duration-200">+</span>
            </summary>
            <p className="text-white/80 mt-3 pl-2 border-l-2 border-blue-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
