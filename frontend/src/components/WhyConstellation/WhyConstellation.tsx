import React, { useState, useEffect, useCallback } from 'react';
import WhyOrb from './WhyOrb';

interface Why {
  id: number;
  message: string;
  position: {
    x: number;
    y: number;
  };
  color: string;
  created_at: string;
}

// API URL will be different in production vs development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const COLORS = [
  '#FFFFFF', // White/blue-white star (like Sirius)
  '#B5CEE3', // Blue-white star (like Vega)
  '#FFF4E8', // Yellow-white star (like our Sun)
  '#FFE5BC', // Orange star (like Arcturus)
  '#FFD2A1', // Orange-red star (like Antares)
  '#FFF7E8', // Pale yellow star (like Capella)
];

const WhyConstellation: React.FC = () => {
  const [whys, setWhys] = useState<Why[]>([]);
  const [newWhy, setNewWhy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all whys
  const fetchWhys = useCallback(async () => {
    try {
      console.log('Fetching whys from:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/api/whys`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log('Fetched whys:', data);
      setWhys(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching whys:', {
        message: error.message,
        url: API_BASE_URL,
        error
      });
      setError(`Failed to load messages: ${error.message}`);
    }
  }, []);

  // Fetch whys initially and set up polling
  useEffect(() => {
    fetchWhys();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchWhys, 10000);
    return () => clearInterval(interval);
  }, [fetchWhys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhy.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting why to:', API_BASE_URL);
      // Generate random position with some padding from edges
      const position = {
        x: Math.random() * 80 + 10, // 10% to 90% of width
        y: Math.random() * 60 + 20, // 20% to 80% of height
      };

      // Generate a random gold-like color
      const hue = Math.random() * 40 + 30; // 30-70 (gold range)
      const saturation = Math.random() * 20 + 80; // 80-100%
      const lightness = Math.random() * 20 + 50; // 50-70%
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      const response = await fetch(`${API_BASE_URL}/api/why`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newWhy,
          position,
          color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const newWhyData = await response.json();
      console.log('Created new why:', newWhyData);
      setWhys(prev => [...prev, newWhyData]);
      setNewWhy('');
      setError(null);
    } catch (error: any) {
      console.error('Error submitting why:', {
        message: error.message,
        url: API_BASE_URL,
        error
      });
      setError(`Failed to share your message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async (message: string) => {
    const shareText = `My reason why: "${message}" \nDiscover your why at: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to clipboard on share error
        navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Input form - floating at the bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4 pointer-events-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={newWhy}
              onChange={(e) => setNewWhy(e.target.value)}
              placeholder="What's your why..."
              maxLength={100}
              className="flex-1 px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d7b73f]"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newWhy.trim()}
              className="px-6 py-2 bg-[#d7b73f] text-black font-semibold rounded-lg hover:bg-[#d7b73f] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sharing...' : 'Share'}
            </button>
          </div>
          
          {error && (
            <div className="absolute -top-8 left-0 right-0 text-center text-red-400 text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Instructions text */}
        <div className="text-center text-sm text-gray-400 mt-4 max-w-xl mx-auto">
          Click the glowing stars and see "why", share your favorite one on X. We will pick our favorite and make a custom piece of art daily then post it on our main page!
        </div>

        {/* Empty state - only show when no whys */}
        {whys.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-400 text-lg pointer-events-none">
          </div>
        )}
      </div>

      {/* Constellation display - covers entire screen */}
      <div className="absolute inset-0">
        {whys.map((why) => (
          <WhyOrb
            key={why.id}
            message={why.message}
            position={why.position}
            color={why.color}
            index={why.id}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyConstellation;
