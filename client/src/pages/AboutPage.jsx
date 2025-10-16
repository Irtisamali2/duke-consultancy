import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const TestimonialCarousel = () => {
  const testimonials = [
    {
      name: "Dr. Ahmed Malik",
      role: "Registered Nurse in London",
      text: "The guidance I received from Duke Consultancy was exceptional. They helped me navigate the complex visa process and secure a position at a leading hospital in London. Highly recommended!",
      image: "/pexels-tima-miroshnichenko-8376309 1_1760620436958.png"
    },
    {
      name: "Ayesha Rahman",
      role: "Healthcare Professional in Germany",
      text: "Duke Consultancy made my dream of working abroad a reality. Their team was professional, supportive, and guided me through every step of the application process.",
      image: "/Image (6)_1760620436963.png"
    },
    {
      name: "Zainab Hussain",
      role: "Nurse Practitioner in UAE",
      text: "I'm grateful for the comprehensive support Duke Consultancy provided. From training to placement, they were with me every step of the way. Now I'm successfully working in Dubai!",
      image: "/pexels-tima-miroshnichenko-8376309 1_1760620436958.png"
    }
  ];

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

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-[#D6EEF5] rounded-2xl p-6 mb-4">
      <button 
        onClick={onClick}
        className="w-full flex items-start justify-between text-left"
      >
        <h3 className="text-gray-900 font-semibold text-base pr-4">{question}</h3>
        <svg 
          className={`w-6 h-6 text-gray-600 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-700 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export const AboutPage = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What are the eligibility requirements for healthcare professionals seeking for overseas job opportunities in the UK/GCC?",
      answer: "Healthcare professionals must have relevant qualifications recognized by the destination country, minimum years of experience (typically 1-2 years), English language proficiency (IELTS/OET), valid registration with professional bodies, and meet specific licensing requirements of the destination country."
    },
    {
      question: "Do you provide housing and travel support once I am selected for an overseas job opportunity?",
      answer: "Yes, we provide comprehensive relocation support including assistance with accommodation arrangements, travel coordination, and settlement guidance. Our team helps you connect with housing resources and provides detailed information about living in your destination country."
    },
    {
      question: "How long does it take to secure a job placement opportunity?",
      answer: "The timeline varies depending on factors such as your qualifications, destination country, and job availability. Typically, the process takes 3-6 months from application to placement, including credential verification, interviews, and visa processing."
    },
    {
      question: "What is one of the most crucial importance for health applicants (OSCE)?",
      answer: "The OSCE (Objective Structured Clinical Examination) is crucial as it assesses your practical clinical skills and competencies required for registration in countries like the UK. We provide comprehensive OSCE preparation and training to ensure you're fully prepared for this essential assessment."
    },
    {
      question: "What is one of the most crucial importance for health applicants (OSCE)?",
      answer: "The OSCE assessment is vital for demonstrating your clinical competence and patient care abilities. It evaluates communication skills, clinical examination techniques, and professional behavior essential for practicing in international healthcare settings."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 lg:px-20 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-[#00A6CE]">Home</a>
            <a href="/about" className="text-[#00A6CE] font-semibold">About Us</a>
            <a href="#" className="text-gray-700 hover:text-[#00A6CE]">Services</a>
            <a href="#" className="text-gray-700 hover:text-[#00A6CE]">Contact Us</a>
          </nav>
          <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6">
            Get Registered
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-white to-[#E8F7FB]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#00A6CE] text-sm font-semibold mb-4">Welcome To Duke Consultancy & Training</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Training. Placement.<br />Success. Growth.
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We equip healthcare professionals with top-tier training, enabling support, and tailored placements to thrive in international markets.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="w-full py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Duke Consultancy, we have been a global pioneer and unrivaled force in the international healthcare recruitment sector. Our expertise lies in seamlessly connecting exceptional healthcare professionals with leading hospitals and healthcare organizations.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through a seamless process of training to documentation, onboarding, recruitment, counseling, and training, we ensure that healthcare professionals are well-prepared and confident in their new roles. Our commitment extends beyond placement - we provide ongoing support and resources to help our candidates thrive in their international careers.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden">
              <img 
                src="/about-office.png" 
                alt="Team working" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#00A6CE] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">To empower</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#00A6CE] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">To provide</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#00A6CE] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">To educate</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#00A6CE] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">To lead</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#00A6CE] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">To build</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#00A6CE] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">To innovate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none bg-[#E8F7FB] p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Comprehensive Candidate Preparation</h3>
                <p className="text-gray-600 text-sm">
                  Tailored guidance to help you prepare for international healthcare opportunities
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#E8F7FB] p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Streamlined Job Placement</h3>
                <p className="text-gray-600 text-sm">
                  We handle every aspect from job searching to final placement
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#E8F7FB] p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Documentation & Compliance Support</h3>
                <p className="text-gray-600 text-sm">
                  Smooth and reliable processing of essential documents
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#E8F7FB] p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Post-placement Training and Support</h3>
                <p className="text-gray-600 text-sm">
                  Continued support to ensure you excel in your position
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Career Development Section */}
      <section className="w-full py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden">
              <img 
                src="/about-nurses.png" 
                alt="Healthcare professionals" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Career Development & Skill Enhancement
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Duke Consultancy, we believe that continuous professional development is key to career advancement. We offer comprehensive training programs designed to help healthcare professionals enhance their skills and stay competitive in the global healthcare market.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our programs include clinical skills training, language proficiency courses, cultural orientation, and specialized certifications. We provide both theoretical knowledge and practical hands-on experience to ensure you're fully prepared for international healthcare settings.
              </p>
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Duke?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our industry-leading team specializes in navigating complex overseas and international processes. We don't just prepare documents - we guide your entire career transition, ensuring you're equipped for long-term success in international healthcare environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-[#00A6CE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">10K+</h3>
              <p className="text-white/90 text-sm">Successful Placements</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">2,650+</h3>
              <p className="text-white/90 text-sm">Healthcare Professionals</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">15+</h3>
              <p className="text-white/90 text-sm">Countries Served</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">100%</h3>
              <p className="text-white/90 text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-black">Testimonials From Our </span>
              <span className="text-[#00A6CE]">Satisfied</span>
              <span className="text-black"> Candidates</span>
            </h2>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full relative py-24 lg:py-32 bg-cover bg-center" style={{ backgroundImage: 'url(/cta-background.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Start Your Professional Journey Here
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-10 py-6 rounded-full text-base font-semibold">
              Get Registered
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#00A6CE] bg-transparent px-10 py-6 rounded-full text-base font-semibold">
              Learn More →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-b from-white to-[#B3E0EC] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div className="space-y-5">
              <img
                src="/Group_1760620436964.png"
                alt="Duke Consultancy Logo"
                className="h-12"
              />
              <p className="text-gray-800 text-sm leading-relaxed max-w-xs">
                Connecting skilled healthcare professionals from Pakistan to leading hospitals across Europe, the UK, and beyond.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-[#00A6CE] flex items-center justify-center hover:bg-[#0090B5] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#00A6CE] flex items-center justify-center hover:bg-[#0090B5] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#00A6CE] flex items-center justify-center hover:bg-[#0090B5] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-3 text-gray-800 text-sm">
                <li><a href="#" className="hover:text-[#00A6CE]">Professional Training</a></li>
                <li><a href="#" className="hover:text-[#00A6CE]">Healthcare Recruitment</a></li>
                <li><a href="#" className="hover:text-[#00A6CE]">Job Placement Abroad</a></li>
                <li><a href="#" className="hover:text-[#00A6CE]">Application & Visa Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3 text-gray-800 text-sm">
                <li><a href="#" className="hover:text-[#00A6CE]">About us</a></li>
                <li><a href="#" className="hover:text-[#00A6CE]">Careers</a></li>
                <li><a href="#" className="hover:text-[#00A6CE]">Blogs</a></li>
                <li><a href="#" className="hover:text-[#00A6CE]">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
