import React from 'react'

const faqs = [
  { q: 'Do you offer a free trial?', a: 'Yes. Claim a 3-day pass and try any class.' },
  { q: 'What memberships do you have?', a: 'Basic, Plus, and All-Access—cancel anytime.' },
  { q: 'Do you have personal training?', a: 'Yes. Book a 1:1 session or purchase a package.' },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">FAQs</h2>
      <div 
        data-card-mask="true"
        className="max-w-4xl mx-auto px-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5"
      >
        {faqs.map((f, i) => (
          <details key={i} className="p-5">
            <summary className="cursor-pointer heading-oswald text-xl">{f.q}</summary>
            <p className="text-white/80 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
