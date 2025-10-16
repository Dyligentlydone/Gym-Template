import React from 'react'

const faqs = [
  { q: 'Do you offer a free trial?', a: 'Yes. We offer a 24hr trial period for everyone who hasn\'t experienced the gym yet.' },
  { q: 'What are your hours?', a: 'We are open 24/7 ;)' },
  { q: 'Do you have personal training?', a: 'Yes. Book a 1:1 session or purchase a package.' },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20 relative z-20 w-full">
      <div className="w-full px-4">
        <h2 className="heading-oswald text-center text-4xl sm:text-5xl font-extrabold mb-12 text-white">Frequently Asked Questions</h2>
        <div 
          data-card-mask="true"
          className="w-full max-w-[95vw] mx-auto bg-black/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
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
      </div>
    </section>
  )
}
