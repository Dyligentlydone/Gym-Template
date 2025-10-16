import React, { useState } from 'react'

export default function ContactMinimal() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [trap, setTrap] = useState('') // honeypot

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (trap) return // simple bot check
    setBusy(true)
    setOk(null)
    setErr(null)
    // Prefer build-time env; if missing in production, fall back to deployed backend URL
    const built = (import.meta.env.VITE_API_URL as string) || ''
    const prodFallback = 'https://web-production-7551.up.railway.app'
    const apiBase = built || (import.meta.env.PROD ? prodFallback : 'http://localhost:5002')
    fetch(`${apiBase.replace(/\/$/, '')}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    })
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({}))
          throw new Error(data.error || `HTTP ${r.status}`)
        }
        return r.json()
      })
      .then(() => {
        setOk('Message sent! We will get back to you shortly.')
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch((e: any) => {
        setErr(e.message || 'Failed to send message')
      })
      .finally(() => setBusy(false))
  }

  return (
    <section aria-labelledby="contact-heading" className="w-full">
      <div className="max-w-3xl mx-auto">
        <h2 id="contact-heading" className="text-center font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl mb-6">
          Contact us
        </h2>
        <form
          onSubmit={handleSubmit}
          data-card-mask="true"
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-5">
            {/* Honeypot */}
            <div className="hidden">
              <label htmlFor="website">Website</label>
              <input id="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm text-white/70 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-transparent border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d7b73f]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-white/70 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-transparent border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d7b73f]"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-white/70 mb-1">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-lg bg-transparent border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d7b73f]"
                placeholder="How can we help?"
              />
            </div>
            {(ok || err) && (
              <div className={`text-sm text-center ${ok ? 'text-green-400' : 'text-red-400'}`}>{ok || err}</div>
            )}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-3 rounded-lg bg-[#39A0ED] hover:bg-[#2f8bd0] text-black font-bold transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
              >
                {busy ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
