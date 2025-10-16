import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GoogleReviewsCarousel = () => {
  // Grand Rapids City Gym Google Reviews
  const reviews = [
    {
      id: 1,
      author: 'Alex T.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Best gym in Grand Rapids! The 24/7 access is a game changer for my schedule. The equipment is top-notch and well-maintained. The community here is welcoming and the staff is super helpful.',
    },
    {
      id: 2,
      author: 'Jamie R.',
      rating: 5,
      date: '3 weeks ago',
      text: 'I\'ve been a member for 6 months and love it here. The trainers are knowledgeable and the facility is always clean. The variety of equipment means I never have to wait, even during peak hours.',
    },
    {
      id: 3,
      author: 'Taylor M.',
      rating: 5,
      date: '1 month ago',
      text: 'The atmosphere at Grand Rapids City Gym is unbeatable. Everyone is so supportive and motivating. The classes are challenging but scalable for all fitness levels. Highly recommend!',
    },
    {
      id: 4,
      author: 'Casey B.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Clean facility with great equipment. The staff is friendly and the membership prices are very reasonable for what you get. Love the 24/7 access!',
    },
    {
      id: 5,
      author: 'Morgan K.',
      rating: 5,
      date: '1 week ago',
      text: 'Just joined and already love it here! The gym has everything I need and more. The community is welcoming and the staff is always ready to help. Best decision I made for my fitness journey!',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          centerMode: false,
          centerPadding: '0',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Force slick to remount when crossing breakpoints so it recalculates widths properly
  const [bpKey, setBpKey] = useState('init');
  useEffect(() => {
    const computeKey = () => {
      const w = window.innerWidth;
      if (w < 480) return 'xs';
      if (w < 768) return 'sm';
      if (w < 1280) return 'md';
      return 'lg';
    };
    const onResize = () => setBpKey(computeKey());
    setBpKey(computeKey());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 overflow-hidden relative z-20">
      <Slider key={bpKey} {...settings} className="py-4 sm:py-8">
        {reviews.map((review) => (
          <div key={review.id} className="px-1 sm:px-2">
            <div 
              data-card-mask="true"
              className="bg-black border border-gray-800 rounded-xl p-4 sm:p-6 h-full mx-1 sm:mx-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start sm:items-center mb-3 sm:mb-4">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center text-lg sm:text-xl font-bold">
                  {review.author.charAt(0)}
                </div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="font-semibold text-white text-sm sm:text-base">{review.author}</h4>
                  <div className="scale-90 sm:scale-100 origin-left">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-4 sm:line-clamp-5">"{review.text}"</p>
              <div className="flex items-center justify-between text-xs sm:text-sm text-white/60">
                <span>{review.date}</span>
                <div className="flex items-center bg-white/10 px-2 py-1 rounded">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                    />
                  </svg>
                  <span>Google</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GoogleReviewsCarousel;
