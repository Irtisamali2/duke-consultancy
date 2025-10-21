import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Dr. Ahmed Malik",
    role: "Registered Nurse in London",
    image: "/testimonial-doctor.jpg",
    text: "The guidance I received from Duke Consultancy was exceptional. They helped me navigate the complex visa process and secure a position at a leading hospital in London. Highly recommended!"
  },
  {
    id: 2,
    name: "Ayesha Rahman",
    role: "Healthcare Professional in Germany",
    image: "/testimonial-nurse1.jpg",
    text: "Duke Consultancy made my dream of working abroad a reality. Their team was professional, supportive, and guided me through every step of the application process."
  },
  {
    id: 3,
    name: "Zainab Hussain",
    role: "Nurse Practitioner in UAE",
    image: "/testimonial-nurse2.jpg",
    text: "I'm grateful for the comprehensive support Duke Consultancy provided. From training to placement, they were with me every step of the way. Now I'm successfully working in Dubai!"
  }
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonial = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#D6EEF5] rounded-3xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-56 lg:flex-shrink-0">
            <img
              src={currentTestimonial.image}
              alt={currentTestimonial.name}
              className="w-full h-64 lg:h-full object-cover"
            />
          </div>
          <div className="p-6 lg:p-8 flex flex-col justify-center flex-1">
            <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-6">
              {currentTestimonial.text}
            </p>
            <div className="mt-auto">
              <h4 className="text-[#00A6CE] font-bold text-lg mb-1">{currentTestimonial.name}</h4>
              <p className="text-gray-600 text-sm font-medium">{currentTestimonial.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#D6EEF5] rounded-3xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-56 lg:flex-shrink-0">
            <img
              src={nextTestimonial.image}
              alt={nextTestimonial.name}
              className="w-full h-64 lg:h-full object-cover"
            />
          </div>
          <div className="p-6 lg:p-8 flex flex-col justify-center flex-1">
            <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-6">
              {nextTestimonial.text}
            </p>
            <div className="mt-auto">
              <h4 className="text-[#00A6CE] font-bold text-lg mb-1">{nextTestimonial.name}</h4>
              <p className="text-gray-600 text-sm font-medium">{nextTestimonial.role}</p>
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
