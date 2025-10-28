import { useState, useEffect } from 'react';

export const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      if (data.success && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
      } else {
        // Fallback to default testimonials if none in database
        setTestimonials([
          {
            id: 1,
            name: "Dr. Ahmed Malik",
            role: "Registered Nurse in London",
            image_url: "/testimonial-doctor.jpg",
            testimonial_text: "The guidance I received from Duke Consultancy was exceptional. They helped me navigate the complex visa process and secure a position at a leading hospital in London. Highly recommended!"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonial = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#D6EEF5] rounded-3xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-64">
          <div className="lg:w-44 lg:flex-shrink-0">
            <img
              src={currentTestimonial.image_url || currentTestimonial.image}
              alt={currentTestimonial.name}
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          <div className="p-4 lg:p-6 flex flex-col justify-center flex-1">
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4">
              {currentTestimonial.testimonial_text || currentTestimonial.text}
            </p>
            <div className="mt-auto">
              <h4 className="text-[#00A6CE] font-bold text-base mb-0.5">{currentTestimonial.name}</h4>
              <p className="text-gray-600 text-xs font-medium">{currentTestimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Second testimonial - hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex bg-[#D6EEF5] rounded-3xl overflow-hidden flex-col lg:flex-row h-auto lg:h-64">
          <div className="lg:w-44 lg:flex-shrink-0">
            <img
              src={nextTestimonial.image_url || nextTestimonial.image}
              alt={nextTestimonial.name}
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          <div className="p-4 lg:p-6 flex flex-col justify-center flex-1">
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4">
              {nextTestimonial.testimonial_text || nextTestimonial.text}
            </p>
            <div className="mt-auto">
              <h4 className="text-[#00A6CE] font-bold text-base mb-0.5">{nextTestimonial.name}</h4>
              <p className="text-gray-600 text-xs font-medium">{nextTestimonial.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={goToPrevious}
          className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-[#00A6CE]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={goToNext}
          className="w-14 h-14 rounded-full bg-[#00A6CE] flex items-center justify-center hover:bg-[#008fb5] transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
