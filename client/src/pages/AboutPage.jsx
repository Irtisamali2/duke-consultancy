import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TestimonialCarousel } from '../components/TestimonialCarousel';

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
      <Header currentPage="about" />

      {/* Hero Section */}
      <section className="w-full py-16 lg:py-24 bg-[#E8F7FB]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#00A6CE] text-sm font-medium">Guiding You To Success</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Training. Placement.<br />Success. Growth.
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We equip healthcare professionals with top-tier training, licensing support, and ethical placements to thrive in international careers.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="w-full py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Duke Consultancy, we open doors to global careers and connect healthcare professionals to jobs.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                As a trusted international training and recruitment partner, we prepare skilled healthcare workers to thrive in world-class healthcare systems through targeted training, streamlined credentialing, and ethical placements.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our mission is rooted in excellence, integrity, and empowerment, ensuring every candidate is equipped not only with professional qualifications but also with a clear path forward.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With us, it's a placement with a pathway to purpose, growth, and global impact.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden relative">
              <img 
                src="/about-office.png" 
                alt="Team working" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8 py-3 rounded-full text-base font-semibold">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>

          {/* Mission & Vision within Who We Are */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <ul className="space-y-4">
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

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <ul className="space-y-4">
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
            <Card className="border-none bg-[#E8F7FB] p-6 text-center rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-3">International Certification & Licensing Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Expert guidance to help you prepare, qualify, and meet global standards
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#E8F7FB] p-6 text-center rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-3">Streamlined Job Application Process</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We simplify every step, ensuring a smooth and hassle-free application journey
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#E8F7FB] p-6 text-center rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-3">Guaranteed Job Placement Pathways</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Access verified global opportunities with trusted healthcare employers
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#E8F7FB] p-6 text-center rounded-3xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-3">End-to-End Support & Cultural Readiness</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  From initial prep to settling in abroad, we have got you covered
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

      <Footer />
    </div>
  );
};
