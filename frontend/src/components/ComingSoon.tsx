import { useEffect, useState } from 'react';

export default function ComingSoon() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMTY1LCAwLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Glowing circle behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFA500] rounded-full opacity-10 blur-3xl animate-pulse"></div>

        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFA500] to-yellow-500 bg-clip-text text-transparent">
          Coded Wisdom
        </h1>
        
        <div className="relative">
          <h2 className="text-4xl font-semibold mb-8 inline-block">
            Coming Soon{dots}
          </h2>
        </div>

        {/* Animated loading indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-[#FFA500] rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        <p className="text-lg text-gray-300 max-w-md mx-auto">
          We're crafting something extraordinary. Your personal 1 on 1 assistant for deep insights and practical wisdom.
        </p>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-1 bg-[#FFA500] rounded-full opacity-50"
              style={{
                animation: 'pulse 2s infinite',
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}
