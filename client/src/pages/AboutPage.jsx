import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TestimonialCarousel } from '../components/TestimonialCarousel';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-[#D6EEF5] rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4">
      <button 
        onClick={onClick}
        className="w-full flex items-start justify-between text-left"
      >
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base pr-3 sm:pr-4">{question}</h3>
        <svg 
          className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 sm:mt-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
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
      <Header currentPage="about" />

      {/* Hero Section */}
      <section className="w-full py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-[#37AFCD]/40 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#00A6CE] text-xs sm:text-sm font-medium">Guiding You To Success</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Training. Placement.<br />Success. Growth.
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            We equip healthcare professionals with top-tier training, licensing support, and ethical placements to thrive in international careers.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="w-full py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Text Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Who We Are</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                At Duke Consultancy, we open doors to global careers and connect healthcare professionals to jobs.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                As a trusted international training and recruitment partner, we prepare skilled healthcare workers to thrive in world-class healthcare systems through targeted training, streamlined credentialing, and ethical placements.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                Our mission is rooted in excellence, integrity, and empowerment, ensuring every candidate is equipped not only with professional qualifications but also with a clear path forward.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                With us, it's a placement with a pathway to purpose, growth, and global impact.
              </p>

              {/* Mission & Vision - 2 columns side-by-side on ALL screen sizes including mobile */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-0">
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Mission</h3>
                  <ul className="space-y-1 sm:space-y-1.5">
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Prepare</li>
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Empower</li>
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Facilitate</li>
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Vision</h3>
                  <ul className="space-y-1 sm:space-y-1.5">
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Lead</li>
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Bridge</li>
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Empower</li>
                    <li className="text-gray-700 text-xs sm:text-sm lg:text-base">• Elevate</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Image with Apply Now button - shows on desktop, hidden on mobile in this position */}
            <div className="hidden lg:block rounded-2xl sm:rounded-3xl overflow-hidden relative">
              <img 
                src="/about-office.png" 
                alt="Team working" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2">
                <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>

          {/* Image for mobile - shows AFTER text and Mission/Vision on mobile only */}
          <div className="lg:hidden mt-6 rounded-2xl overflow-hidden relative">
            <img 
              src="/about-office.png" 
              alt="Team working" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6 py-2.5 rounded-full text-sm font-semibold">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <img 
                  src="/icon-certification.png" 
                  alt="Certification Icon" 
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg leading-tight">
                International Certification & Licensing Support
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Expert guidance to help you prepare, qualify, and meet global standards.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <img 
                  src="/icon-job-process.png" 
                  alt="Job Process Icon" 
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg leading-tight">
                Streamlined Job Application Process
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We simplify every step, ensuring a smooth and fast application journey.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <img 
                  src="/icon-placement.png" 
                  alt="Placement Icon" 
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg leading-tight">
                Guaranteed Job Placement Pathways
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Access verified global opportunities with trusted healthcare employers.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <img 
                  src="/icon-support.png" 
                  alt="Support Icon" 
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg leading-tight">
                End-to-End Support & Cultural Readiness
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                From visa prep to cultural training, we have got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Development Section */}
      <section className="w-full py-10 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image - Order 2 on mobile, Order 1 on desktop */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden order-2 lg:order-1">
              <img 
                src="/about-nurses.png" 
                alt="Healthcare professionals" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Text - Order 1 on mobile, Order 2 on desktop */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Comprehensive Career Development & Skill Enhancement
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                At Duke Consultancy, we believe that continuous professional development is key to career advancement. We offer comprehensive training programs designed to help healthcare professionals enhance their skills and stay competitive in the global healthcare market.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                Our programs include clinical skills training, language proficiency courses, cultural orientation, and specialized certifications. We provide both theoretical knowledge and practical hands-on experience to ensure you're fully prepared for international healthcare settings.
              </p>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Duke?</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Our industry-leading team specializes in navigating complex overseas and international processes. We don't just prepare documents - we guide your entire career transition, ensuring you're equipped for long-term success in international healthcare environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="bg-[#00A6CE] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-[#3D7A8A] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">10K+</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed">
                  Nurses and healthcare professionals supported in building global careers.
                </p>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">2,650+</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed">
                  Candidates placed successfully with trusted international employers.
                </p>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">15+</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed">
                  Years of combined expertise in healthcare recruitment and training.
                </p>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">100%</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed">
                  Commitment to ethical, transparent, and candidate-first recruitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-10 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
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
      <section className="w-full py-10 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-black">Testimonials From Our </span>
              <span className="text-[#00A6CE]">Satisfied</span>
              <span className="text-black"> Candidates</span>
            </h2>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full relative py-16 sm:py-24 lg:py-32 bg-cover bg-center" style={{ backgroundImage: 'url(/cta-background.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            Start Your Professional Journey Here
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8 sm:px-10 py-5 sm:py-6 rounded-full text-sm sm:text-base font-semibold w-full sm:w-auto">
              Get Registered
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#00A6CE] bg-transparent px-8 sm:px-10 py-5 sm:py-6 rounded-full text-sm sm:text-base font-semibold w-full sm:w-auto">
              Learn More →
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
