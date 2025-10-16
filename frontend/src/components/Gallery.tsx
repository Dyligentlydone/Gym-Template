import React from 'react'

const images = Array.from({ length: 6 }).map((_, i) => ({ id: i + 1 }))

export default function Gallery() {
  return (
    <section id="gallery" className="py-20">
      <h2 className="heading-oswald text-center text-3xl sm:text-4xl font-extrabold mb-10">Facilities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-6xl mx-auto px-4">
        {images.map((img) => (
          <div key={img.id} className="aspect-video rounded-xl bg-white/10" />
        ))}
      </div>
    </section>
  )
}
