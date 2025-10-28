import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { BlogCarousel } from "@/components/BlogCarousel";

export const HomePage = () => {
  const [, setLocation] = useLocation();
  
  return (
    <div className="bg-white w-full min-h-screen">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="w-full bg-white pt-8 sm:pt-12 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* Text Content - Order 1 on both mobile and desktop */}
            <div className="space-y-4 sm:space-y-8 order-1">
              <div className="inline-flex items-center gap-2 text-[#00A6CE]">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span className="text-xs sm:text-base font-medium">#1 Choice for Global Healthcare Job Placement</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-black">Empowering Healthcare Professionals for Global </span>
                <span className="text-[#2C5F6F]">Career Success</span>
              </h1>
              
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                We meticulously prepare healthcare workers for successful international placements through world-class training, ethical recruitment, and dedicated career guidance.
              </p>
              
              <div className="flex flex-row gap-3 sm:gap-4">
                <Button 
                  onClick={() => setLocation('/candidate/register')}
                  className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6 sm:px-10 py-5 sm:py-6 rounded-full text-sm sm:text-base font-medium flex-1 sm:flex-initial"
                >
                  Apply Now
                </Button>
                <Button variant="outline" className="border-2 border-[#00A6CE] text-[#00A6CE] hover:bg-[#E8F7FB] px-6 sm:px-10 py-5 sm:py-6 rounded-full text-sm sm:text-base font-medium flex items-center gap-2 justify-center flex-1 sm:flex-initial">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image - Order 2 on both mobile and desktop */}
            <div className="relative order-2">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/Mask group (1)_1760620861162.png"
                  alt="Healthcare Professional"
                  className="w-full h-auto"
                />
                
                {/* Top right badge - 10K+ */}
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-lg text-right">
                  <div className="text-2xl sm:text-4xl font-bold text-[#00A6CE]">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Assign Jobs To<br/>Nurses</div>
                </div>
              </div>
              
              {/* Bottom left badge - Candidates */}
              <div className="absolute -bottom-6 sm:-bottom-8 left-2 sm:left-4 bg-white rounded-xl sm:rounded-2xl px-3 py-3 sm:px-6 sm:py-5 shadow-2xl flex items-center gap-2 sm:gap-4">
                <div className="flex -space-x-2 sm:-space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-300 border-2 sm:border-3 border-white"></div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-400 border-2 sm:border-3 border-white"></div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-500 border-2 sm:border-3 border-white"></div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-bold text-[#00A6CE]">2,650+</div>
                  <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Candidate have trusted us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building Global Healthcare Section */}
      <section className="w-full py-10 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image - Order 2 on mobile, Order 1 on desktop */}
            <div className="order-2 lg:order-1">
              <img
                src="/Image (6)_1760620436963.png"
                alt="Healthcare Team"
                className="w-full rounded-2xl sm:rounded-3xl shadow-xl"
              />
            </div>

            {/* Text - Order 1 on mobile, Order 2 on desktop */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C5F6F]">
                Building Global Healthcare Career Pathways
              </h2>
              
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                Duke Consultancy is a healthcare recruitment and placement firm dedicated to bridging the gap between skilled professionals in Pakistan and healthcare institutions across Europe, the UK, and other international destinations.
              </p>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                With years of experience and a trusted process, we ensure every candidate is guided through documentation, compliance, and visa procedures smoothly, so they can focus on their careers.
              </p>

              <Button variant="link" className="text-[#00A6CE] text-sm sm:text-base p-0 h-auto">
                Read More →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-black">How it </span>
              <span className="text-[#00A6CE]">works</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed px-2">
              We make the recruitment process simple, transparent, and stress-free. Our step-by-step approach ensures that every candidate moves smoothly from registration to placement.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-16 lg:space-y-28">
            {/* Step 01 - Register Online */}
            <div className="relative">
              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="space-y-3 mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#00A6CE]">Register Online</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    we know your home is more than just a place to live, that's why we're committed to providing the best home loan
                  </p>
                </div>
                <div className="relative h-[420px] sm:h-[480px] w-full overflow-visible">
                  {/* Background Circle - Much larger */}
                  <img
                    src="/Ellipse 1328 (2)_1760621468329.png"
                    alt=""
                    className="absolute -left-8 sm:-left-4 top-0 w-[360px] sm:w-[420px] h-auto opacity-40"
                  />
                  {/* Number - Larger and positioned over circle */}
                  <div className="absolute left-2 sm:left-6 top-12 sm:top-16 text-[140px] sm:text-[160px] font-bold text-gray-200/80 leading-none z-10">01</div>
                  {/* White Card - Narrower, better positioned */}
                  <div className="absolute right-0 sm:right-2 top-24 sm:top-32 bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-[340px] sm:w-[360px] z-20">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Register Online</h4>
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="mt-8 sm:mt-10 flex justify-center">
                      <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-10 sm:px-12 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium">
                        Sign up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Original grid */}
              <div className="hidden lg:grid grid-cols-2 gap-12 items-start">
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
            </div>

            {/* Step 02 - Browse Jobs */}
            <div className="relative">
              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="space-y-3 mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#00A6CE]">Browse Jobs</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center
                  </p>
                </div>
                <div className="relative h-[380px] sm:h-[420px] w-full overflow-visible">
                  {/* Background Circle - Much larger */}
                  <img
                    src="/Ellipse 1328 (1)_1760621468329.png"
                    alt=""
                    className="absolute -left-8 sm:-left-4 top-0 w-[360px] sm:w-[420px] h-auto opacity-40"
                  />
                  {/* Number - Larger and positioned over circle */}
                  <div className="absolute left-2 sm:left-6 top-12 sm:top-16 text-[140px] sm:text-[160px] font-bold text-gray-200/80 leading-none z-10">02</div>
                  {/* White Card */}
                  <div className="absolute right-0 sm:right-2 top-24 sm:top-32 bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-[340px] sm:w-[360px] z-20">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Search</h4>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search services"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400"
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <div className="w-px h-5 bg-gray-300"></div>
                        <svg className="w-4 h-4 text-[#00A6CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-2 gap-12 items-start">
                <div className="space-y-2 pt-8 order-first">
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
            </div>

            {/* Step 03 - Apply & Track */}
            <div className="relative">
              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="space-y-3 mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#00A6CE]">Apply & Track</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    It's about you and your family, having a comfortable payment, exceptional service and a lender.
                  </p>
                </div>
                <div className="relative h-[380px] sm:h-[420px] w-full overflow-visible">
                  {/* Background Circle - Much larger */}
                  <img
                    src="/Ellipse 1328_1760621468330.png"
                    alt=""
                    className="absolute -left-8 sm:-left-4 top-0 w-[360px] sm:w-[420px] h-auto opacity-40"
                  />
                  {/* Number - Larger and positioned over circle */}
                  <div className="absolute left-2 sm:left-6 top-12 sm:top-16 text-[140px] sm:text-[160px] font-bold text-gray-200/80 leading-none z-10">03</div>
                  {/* White Card */}
                  <div className="absolute right-0 sm:right-2 top-24 sm:top-32 bg-white rounded-3xl shadow-2xl p-10 sm:p-12 w-[340px] sm:w-[360px] z-20 flex justify-center gap-6">
                    <div className="text-4xl sm:text-5xl">😮</div>
                    <div className="text-4xl sm:text-5xl">😠</div>
                    <div className="text-4xl sm:text-5xl">❤️</div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-2 gap-12 items-start">
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
            </div>

            {/* Step 04 - Screening & Interviews */}
            <div className="relative">
              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="space-y-3 mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#00A6CE]">Screening & Interviews</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center
                  </p>
                </div>
                <div className="relative h-[380px] sm:h-[420px] w-full overflow-visible">
                  {/* Background Circle - Much larger */}
                  <img
                    src="/Ellipse 1328 (2)_1760621468329.png"
                    alt=""
                    className="absolute -left-8 sm:-left-4 top-0 w-[360px] sm:w-[420px] h-auto opacity-40"
                  />
                  {/* Number - Larger and positioned over circle */}
                  <div className="absolute left-2 sm:left-6 top-12 sm:top-16 text-[140px] sm:text-[160px] font-bold text-gray-200/80 leading-none z-10">04</div>
                  {/* White Card */}
                  <div className="absolute right-0 sm:right-2 top-24 sm:top-32 bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-[340px] sm:w-[360px] z-20">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Search</h4>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search services"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400"
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <div className="w-px h-5 bg-gray-300"></div>
                        <svg className="w-4 h-4 text-[#00A6CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-2 gap-12 items-start">
                <div className="space-y-2 pt-8 order-first">
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
        </div>
      </section>

      {/* Solutions Section */}
      <section className="w-full py-10 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-black">Our Solutions for Your </span>
              <span className="text-[#00A6CE]">Nursing</span>
              <span className="text-black"> Career</span>
            </h2>
          </div>

          {/* Grid Layout - Single column on mobile, complex grid on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:auto-rows-fr">
            {/* Healthcare Recruitment Card - Order 1 on mobile, spans 2 cols on desktop */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 lg:col-span-2 order-1">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center">
                  <img src="/Icon Badge_1760620436960.png" alt="Healthcare" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">Healthcare Recruitment</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  We connect highly skilled nurses, therapists, technicians, allied health professionals, and administrative staff with reputable healthcare facilities, ensuring a career path that matches their expertise.
                </p>
              </div>
              <div className="flex justify-center items-center">
                <img
                  src="/Mobile (1)_1760624836582.png"
                  alt="Healthcare App"
                  className="w-40 sm:w-48 lg:w-56 h-auto"
                />
              </div>
            </div>

            {/* Job Placement Abroad Card - Order 2 on mobile */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 order-2 lg:order-3 flex flex-col">
              <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center mb-2 sm:mb-4">
                <img src="/Icon Badge (2)_1760620436959.png" alt="Job Placement" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-black mb-1.5 sm:mb-3">Job Placement Abroad</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-snug sm:leading-relaxed">
                From the UK and Europe to the Middle East, we facilitate international placements, offering candidates opportunities to expand their careers globally.
              </p>
            </div>

            {/* Application & Visa Support Card - Order 3 on mobile */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 order-3 lg:order-4 flex flex-col">
              <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center mb-2 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-[#00A6CE]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-black mb-1.5 sm:mb-3">Application & Visa Support</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-snug sm:leading-relaxed">
                Our team assists with paperwork, compliance, visa filing, and documentation, making the relocation process smooth and hassle-free.
              </p>
            </div>

            {/* Professional Training & Development - Order 4 on mobile, spans 2 rows on desktop */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col order-4 lg:order-2 lg:row-span-2">
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#E8F7FB] rounded-xl flex items-center justify-center">
                  <img src="/Icon Badge (1)_1760620436960.png" alt="Training" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">Professional Training & Development</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Duke Consultancy provides access to specialized training programs, helping healthcare professionals upgrade their skills and stay competitive in global markets.
                </p>
              </div>
              <div className="flex-1 flex justify-center items-end">
                <img
                  src="/iPhone 13 Pro (3) 1_1760620436961.png"
                  alt="Video Call"
                  className="w-48 sm:w-56 lg:w-64 h-auto"
                />
              </div>
            </div>
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

      {/* Expert Advice Section */}
      <section className="w-full py-10 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C5F6F]">
              Expert Health Advice and Updates
            </h2>
          </div>

          <BlogCarousel />
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
            <Button 
              onClick={() => setLocation('/candidate/register')}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8 sm:px-10 py-5 sm:py-6 rounded-full text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
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
