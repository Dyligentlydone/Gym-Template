import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import whyLogo from '../assets/images/why-logo.png'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Personal Roadmap', href: '/why' },
  { name: 'Coded Wisdom', href: '/guide' },
  { name: 'Docs', href: '/docs' },
]

const XIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header>
      <nav className="fixed w-full z-50 p-4 lg:px-8" aria-label="Global">
        {/* Logo - Fixed in top left */}
        <div className="absolute left-4 top-4">
          <a href="/" className="block">
            <img
              src={whyLogo}
              alt="Why Logo"
              className="h-16 w-auto hover:opacity-80 transition-opacity duration-300"
            />
          </a>
        </div>

        {/* Mobile menu button - Aligned right */}
        <div className="absolute right-4 top-4 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop menu - Centered */}
        <div className="hidden lg:flex lg:justify-center lg:items-center">
          <div className="flex gap-x-12 items-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-base tracking-wider leading-6 text-white hover:text-[#d7b73f] transition-all duration-300 font-['Archivo_Black'] hover:scale-105"
              >
                {item.name.toUpperCase()}
              </a>
            ))}
            <a
              href="https://x.com/whypowered_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#d7b73f] transition-all duration-300 hover:scale-105"
              aria-label="Follow us on X (Twitter)"
            >
              <XIcon />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/90 backdrop-blur-md px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <img
                src={whyLogo}
                alt="Why Logo"
                className="h-10 w-auto"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-lg leading-7 text-white hover:text-[#d7b73f] transition-all duration-300 font-['Archivo_Black'] tracking-wider"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name.toUpperCase()}
                  </a>
                ))}
                <a
                  href="https://x.com/whypowered_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg px-3 py-2 text-lg leading-7 text-white hover:text-[#d7b73f] transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XIcon />
                  <span className="ml-2 font-['Archivo_Black'] tracking-wider">X (TWITTER)</span>
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
