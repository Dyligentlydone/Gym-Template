export type ServiceItem = {
  id: string
  title: string
  blurb: string
  details?: string
  icon?: string // optional icon name or URL
}

export const servicesData: ServiceItem[] = [
  {
    id: 'web',
    title: 'Web Development & Optimization',
    blurb: 'High‑level, modern, scalable websites that convert.',
    details:
      "We don’t just build websites. We build growth machines. Every site we create is high level, fast, mobile‑ready, and designed to convert visitors into customers. Beyond design, we handle technical SEO, analytics setup, diligent connections between your existing or our recommended digital assets plus ongoing optimization to keep performance high. Whether it’s rebuilding an outdated site, adding new features, or maintaining security and speed, Dyligent ensures your digital presence is sharp, modern, and future‑proof.",
  },
  {
    id: 'social',
    title: 'Social Media Management',
    blurb: 'Consistent, branded, engaging content.',
    details:
      "We transform your social media presence into a professional and engaging marketing channel. From strategy and calculated calendars to branded graphics and creative content, captions, and weekly posting, we handle everything end‑to‑end. We monitor engagement, respond to comments, and grow your audience consistently. Our approach blends creative storytelling with data‑driven insights, so your brand doesn’t just show up—it stands out and connects with the right audience.",
  },
  {
    id: 'marketing',
    title: 'Digital Marketing',
    blurb: 'Campaigns that drive awareness, leads, and sales.',
    details:
      "Visibility is nothing without results. Our digital marketing strategies are built around driving real ROI. That means SEO to rank your business higher, email campaigns that convert, ad campaigns that attract qualified leads, and retargeting systems that bring back lost visitors. We tailor campaigns to your industry and audience so every marketing dollar works harder. Whether you’re looking for more leads, more sales, or more brand awareness, we design the roadmap and execute it for you.",
  },
  {
    id: 'nextgen',
    title: 'Next‑gen Tech',
    blurb: 'AI agents, blockchain, and consulting—a look ahead.',
    details:
      "The future of business is intelligent and automated. Dyligent is already building AI agents, chatbots, and automation tools that streamline customer service, lead nurturing, and workflow efficiency. For forward‑thinking clients, we also provide blockchain development and consulting—from smart contracts to secure digital infrastructure. Even if you’re not ready for these today, we’ll keep you ahead of the curve when you are.",
  },
]
