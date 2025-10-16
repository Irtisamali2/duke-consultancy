import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";

const navigationItems = ["HOME", "ABOUT US", "BLOGS", "CONTACT US"];

const testimonials = [
  {
    id: 1,
    name: "Dr. Ahmed Malik",
    role: "Medical Officer, UK",
    image: "/doctor-male.jpg",
    text: '"Duke Consultancy made my dream of working in the UK a reality. Their support throughout the entire process was exceptional, from documentation to my first day at work."'
  },
  {
    id: 2,
    name: "Ayesha Rahman",
    role: "Registered Nurse, Germany",
    image: "/nurse-female-1.jpg",
    text: '"Professional, reliable, and genuinely caring. The team at Duke Consultancy guided me through every step and I\'m now working at a top hospital in Germany."'
  },
  {
    id: 3,
    name: "Zainab Hussain",
    role: "Healthcare Specialist, UAE",
    image: "/nurse-female-2.jpg",
    text: '"Duke Consultancy\'s dedication to finding the perfect match for my skills was impressive. Within months I secured an excellent position in Dubai."'
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonial = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Testimonial Card 1 */}
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

        {/* Testimonial Card 2 */}
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

      {/* Navigation Arrows and Dots */}
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

export const HomePage = () => {
  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header */}
      <header className="w-full bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex items-center justify-between">
          <img
            src="/Group_1760620436964.png"
            alt="Duke Consultancy Logo"
            className="h-14"
          />
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="/" className="text-sm font-medium text-[#00A6CE] transition-colors">HOME</a>
            <a href="/about" className="text-sm font-medium text-gray-800 hover:text-[#00A6CE] transition-colors">ABOUT US</a>
            <a href="#" className="text-sm font-medium text-gray-800 hover:text-[#00A6CE] transition-colors">BLOGS</a>
            <a href="#" className="text-sm font-medium text-gray-800 hover:text-[#00A6CE] transition-colors">CONTACT US</a>
          </nav>

          <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8 py-3 rounded-full font-medium">
            Register
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-white pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-[#00A6CE]">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-base font-medium">#1 Choice for Global Healthcare Job Placement</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-black">Empowering Healthcare Professionals for Global </span>
                <span className="text-[#2C5F6F]">Career Success</span>
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                We meticulously prepare healthcare workers for successful international placements through world-class training, ethical recruitment, and dedicated career guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-10 py-6 rounded-full text-base font-medium">
                  Apply Now
                </Button>
                <Button variant="outline" className="border-2 border-[#00A6CE] text-[#00A6CE] hover:bg-[#E8F7FB] px-10 py-6 rounded-full text-base font-medium flex items-center gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/Mask group (1)_1760620861162.png"
                  alt="Healthcare Professional"
                  className="w-full h-auto"
                />
                
                {/* Top right badge - 10K+ */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg text-right">
                  <div className="text-4xl font-bold text-[#00A6CE]">10K+</div>
                  <div className="text-sm text-gray-600 mt-1">Assign Jobs To<br/>Nurses</div>
                </div>
              </div>
              
              {/* Bottom left badge - Candidates */}
              <div className="absolute -bottom-8 left-4 bg-white rounded-2xl px-6 py-5 shadow-2xl flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 border-3 border-white"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-400 border-3 border-white"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-500 border-3 border-white"></div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00A6CE]">2,650+</div>
                  <div className="text-sm text-gray-600 whitespace-nowrap">Candidate have trusted us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building Global Healthcare Section */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/Image (6)_1760620436963.png"
                alt="Healthcare Team"
                className="w-full rounded-3xl shadow-xl"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2C5F6F]">
                Building Global Healthcare Career Pathways
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Duke Consultancy is a healthcare recruitment and placement firm dedicated to bridging the gap between skilled professionals in Pakistan and healthcare institutions across Europe, the UK, and other international destinations.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                With years of experience and a trusted process, we ensure every candidate is guided through documentation, compliance, and visa procedures smoothly, so they can focus on their careers.
              </p>

              <Button variant="link" className="text-[#00A6CE] text-base p-0 h-auto">
                Read More →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3">
              <span className="text-black">How it </span>
              <span className="text-[#00A6CE]">works</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm">
              We make the recruitment process simple, transparent, and stress-free. Our step-by-step approach ensures that every candidate moves smoothly from registration to placement.
            </p>
          </div>

          <div className="space-y-28">
            {/* Step 01 - Register Online */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="relative min-h-[280px]">
                <div className="absolute -top-4 -left-12 text-[120px] font-bold text-gray-200 leading-none z-10">01</div>
                <img
                  src="/Ellipse 1328 (2)_1760621468329.png"
                  alt="Circle background"
                  className="absolute top-0 left-8 w-[400px] h-auto z-0"
                />
                <div className="absolute top-16 left-0 bg-white rounded-xl shadow-2xl p-6 w-[280px] z-20">
                  <h4 className="text-base font-medium text-gray-800 mb-5 text-center">Register Online</h4>
                  <div className="space-y-2.5">
                    <div className="h-1.5 bg-gray-200 rounded-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full ml-2"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full ml-3"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full ml-2"></div>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-7 py-1.5 rounded-full text-sm font-medium">
                      Sign up
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-8">
                <h3 className="text-xl font-semibold text-[#00A6CE]">Register Online</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  we know your home is more than just a place to live, that's why we're committed to providing the best home loan
                </p>
              </div>
            </div>

            {/* Step 02 - Browse Jobs */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-2 pt-8">
                <h3 className="text-xl font-semibold text-[#00A6CE]">Browse Jobs</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center
                </p>
              </div>

              <div className="relative min-h-[240px]">
                <div className="absolute -top-4 -right-12 text-[120px] font-bold text-gray-200 leading-none z-10">02</div>
                <img
                  src="/Ellipse 1328 (1)_1760621468329.png"
                  alt="Circle background"
                  className="absolute top-0 right-8 w-[400px] h-auto z-0"
                />
                <div className="absolute top-16 right-0 bg-white rounded-xl shadow-2xl p-5 w-[280px] z-20">
                  <h4 className="text-base font-normal text-gray-800 mb-4 text-center">Search</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm placeholder-gray-400"
                      readOnly
                    />
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <div className="w-px h-5 bg-gray-300"></div>
                      <svg className="w-4 h-4 text-[#00A6CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 03 - Apply & Track */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="relative min-h-[240px]">
                <div className="absolute -top-4 -left-12 text-[120px] font-bold text-gray-200 leading-none z-10">03</div>
                <img
                  src="/Ellipse 1328_1760621468330.png"
                  alt="Circle background"
                  className="absolute top-0 left-8 w-[400px] h-auto z-0"
                />
                <div className="absolute top-20 left-0 bg-white rounded-xl shadow-2xl p-8 w-[260px] flex justify-center gap-3 z-20">
                  <div className="text-4xl">😮</div>
                  <div className="text-4xl">😠</div>
                  <div className="text-4xl">❤️</div>
                </div>
              </div>

              <div className="space-y-2 pt-8">
                <h3 className="text-xl font-semibold text-[#00A6CE]">Apply & Track</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  It's about you and your family, having a comfortable payment, exceptional service and a lender.
                </p>
              </div>
            </div>

            {/* Step 04 - Screening & Interviews */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-2 pt-8">
                <h3 className="text-xl font-semibold text-[#00A6CE]">Screening & Interviews</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center
                </p>
              </div>

              <div className="relative min-h-[240px]">
                <div className="absolute -top-4 -right-12 text-[120px] font-bold text-gray-200 leading-none z-10">04</div>
                <img
                  src="/Ellipse 1328 (2)_1760621468329.png"
                  alt="Circle background"
                  className="absolute top-0 right-8 w-[400px] h-auto z-0"
                />
                <div className="absolute top-16 right-0 bg-white rounded-xl shadow-2xl p-5 w-[280px] z-20">
                  <h4 className="text-base font-normal text-gray-800 mb-4 text-center">Search</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm placeholder-gray-400"
                      readOnly
                    />
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <div className="w-px h-5 bg-gray-300"></div>
                      <svg className="w-4 h-4 text-[#00A6CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-black">Our Solutions for Your </span>
              <span className="text-[#00A6CE]">Nursing</span>
              <span className="text-black"> Career</span>
            </h2>
          </div>

          {/* Grid Layout matching Figma exactly */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
            {/* Healthcare Recruitment Card with phone mockup inside */}
            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col lg:flex-row gap-6 lg:col-span-2">
              <div className="flex-1 space-y-4">
                <div className="w-14 h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center">
                  <img src="/Icon Badge_1760620436960.png" alt="Healthcare" className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-black">Healthcare Recruitment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We connect highly skilled nurses, therapists, technicians, allied health professionals, and administrative staff with reputable healthcare facilities, ensuring a career path that matches their expertise.
                </p>
              </div>
              <div className="flex justify-center items-center">
                <img
                  src="/Mobile (1)_1760624836582.png"
                  alt="Healthcare App"
                  className="w-56 h-auto"
                />
              </div>
            </div>

            {/* Professional Training & Development - Tall block with phone at bottom */}
            <div className="bg-gray-50 rounded-3xl p-8 lg:row-span-2 flex flex-col">
              <div className="space-y-4 mb-8">
                <div className="w-14 h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center">
                  <img src="/Icon Badge (1)_1760620436960.png" alt="Training" className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-black">Professional Training & Development</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Duke Consultancy provides access to specialized training programs, helping healthcare professionals upgrade their skills and stay competitive in global markets.
                </p>
              </div>
              <div className="flex-1 flex justify-center items-end">
                <img
                  src="/iPhone 13 Pro (3) 1_1760620436961.png"
                  alt="Video Call"
                  className="w-64 h-auto"
                />
              </div>
            </div>

            {/* Job Placement Abroad Card */}
            <div className="bg-gray-50 rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center">
                <img src="/Icon Badge (2)_1760620436959.png" alt="Job Placement" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-black">Job Placement Abroad</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                From the UK and Europe to the Middle East, we facilitate international placements, offering candidates opportunities to expand their careers globally.
              </p>
            </div>

            {/* Application & Visa Support Card */}
            <div className="bg-gray-50 rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black">Application & Visa Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our team assists with paperwork, compliance, visa filing, and documentation, making the relocation process smooth and hassle-free.
              </p>
            </div>
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

      {/* Expert Advice Section */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2C5F6F]">
              Expert Health Advice and Updates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <img
                src="/pexels-tima-miroshnichenko-8376309 1_1760620436958.png"
                alt="Blog post"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-gray-500">Jun 12, 2023 - Health Tips</p>
                <h3 className="text-lg font-semibold text-[#2C5F6F]">
                  How to Prepare for International Health Exams
                </h3>
                <p className="text-gray-600 text-sm">
                  Essential tips for healthcare professionals preparing for international licensing exams.
                </p>
                <Button variant="link" className="text-[#00A6CE] p-0 h-auto">
                  Read More →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <img
                src="/Image (6)_1760620436963.png"
                alt="Blog post"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-gray-500">Jun 10, 2023 - Career</p>
                <h3 className="text-lg font-semibold text-[#2C5F6F]">
                  Top 5 Countries for Healthcare Professionals
                </h3>
                <p className="text-gray-600 text-sm">
                  Discover the best destinations for healthcare professionals seeking international opportunities.
                </p>
                <Button variant="link" className="text-[#00A6CE] p-0 h-auto">
                  Read More →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <img
                src="/pexels-tima-miroshnichenko-8376309 1_1760620436958.png"
                alt="Blog post"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-gray-500">Jun 08, 2023 - Documentation</p>
                <h3 className="text-lg font-semibold text-[#2C5F6F]">
                  Breaking Down Healthcare Visa Requirements
                </h3>
                <p className="text-gray-600 text-sm">
                  A comprehensive guide to understanding visa requirements for healthcare workers.
                </p>
                <Button variant="link" className="text-[#00A6CE] p-0 h-auto">
                  Read More →
                </Button>
              </CardContent>
            </Card>
          </div>
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
