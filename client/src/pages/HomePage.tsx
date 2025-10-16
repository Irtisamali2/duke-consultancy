import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";

const navigationItems = ["HOME", "ABOUT US", "BLOGS", "CONTACT US"];

export const HomePage = (): JSX.Element => {
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
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm font-medium text-gray-800 hover:text-[#00A6CE] transition-colors"
              >
                {item}
              </a>
            ))}
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
      <section className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-black">How it </span>
              <span className="text-[#00A6CE]">works</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base">
              We make the recruitment process simple, transparent, and stress-free. Our step-by-step approach ensures that every candidate moves smoothly from registration to placement.
            </p>
          </div>

          <div className="space-y-32">
            {/* Step 01 - Register Online */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-4 relative">
                <div className="absolute -top-8 -left-4 text-8xl font-bold text-gray-200 -z-10">01</div>
                <h3 className="text-2xl font-semibold text-[#00A6CE] relative z-10">Register Online</h3>
                <p className="text-gray-600 leading-relaxed">
                  We know your home is more than just a place to live, that's why we're committed to providing the best home loan
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gray-100 rounded-full -z-10"></div>
                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 max-w-sm ml-auto">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">Register Online</h4>
                  <div className="space-y-4">
                    <div className="h-2 bg-gray-200 rounded-full"></div>
                    <div className="h-2 bg-gray-200 rounded-full ml-3"></div>
                    <div className="h-2 bg-gray-200 rounded-full ml-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full ml-3"></div>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Button className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8 py-2 rounded-full text-sm">
                      Sign up
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02 - Browse Jobs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative lg:order-1">
                <div className="absolute top-0 left-0 w-80 h-80 bg-gray-100 rounded-full -z-10"></div>
                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 max-w-sm">
                  <h4 className="text-xl font-normal text-gray-800 mb-6 text-center">Search</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <div className="w-px h-6 bg-gray-300"></div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 relative lg:order-2">
                <div className="absolute -top-8 -right-4 text-8xl font-bold text-gray-200 -z-10">02</div>
                <h3 className="text-2xl font-semibold text-[#00A6CE] relative z-10">Browse Jobs</h3>
                <p className="text-gray-600 leading-relaxed">
                  It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center
                </p>
              </div>
            </div>

            {/* Step 03 - Apply & Track */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-4 relative">
                <div className="absolute -top-8 -left-4 text-8xl font-bold text-gray-200 -z-10">03</div>
                <h3 className="text-2xl font-semibold text-[#00A6CE] relative z-10">Apply & Track</h3>
                <p className="text-gray-600 leading-relaxed">
                  It's about you and your family, having a comfortable payment, exceptional service and a lender.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8F7FB] rounded-full -z-10"></div>
                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-12 max-w-sm ml-auto flex justify-center gap-4">
                  <div className="text-5xl">😮</div>
                  <div className="text-5xl">😠</div>
                  <div className="text-5xl">❤️</div>
                </div>
              </div>
            </div>

            {/* Step 04 - Screening & Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative lg:order-1">
                <div className="absolute top-0 left-0 w-80 h-80 bg-gray-100 rounded-full -z-10"></div>
                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 max-w-sm">
                  <h4 className="text-xl font-normal text-gray-800 mb-6 text-center">Search</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <div className="w-px h-6 bg-gray-300"></div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 relative lg:order-2">
                <div className="absolute -top-8 -right-4 text-8xl font-bold text-gray-200 -z-10">04</div>
                <h3 className="text-2xl font-semibold text-[#00A6CE] relative z-10">Screening & Interviews</h3>
                <p className="text-gray-600 leading-relaxed">
                  It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2C5F6F] mb-4">
              Our Solutions for Your <span className="text-[#00A6CE]">Nursing</span> Career
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-[#E8F7FB] rounded-2xl flex items-center justify-center">
                  <img src="/Icon Badge_1760620436960.png" alt="Documentation" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-[#2C5F6F]">Complete Documentation</h3>
                <p className="text-gray-600">
                  We handle all paperwork, certifications, and compliance requirements for your international placement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-[#E8F7FB] rounded-2xl flex items-center justify-center">
                  <img src="/Icon Badge (1)_1760620436960.png" alt="Job Placement" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-[#2C5F6F]">Job Placement Support</h3>
                <p className="text-gray-600">
                  Access to exclusive healthcare positions with top institutions across Europe and beyond.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-[#E8F7FB] rounded-2xl flex items-center justify-center">
                  <img src="/Icon Badge (2)_1760620436959.png" alt="Interview Support" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-[#2C5F6F]">Application & Job Support</h3>
                <p className="text-gray-600">
                  Expert coaching and preparation for interviews with international healthcare employers.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-[#E8F7FB] to-white">
              <CardContent className="p-8 flex items-center gap-6">
                <img
                  src="/iPhone 13 Pro (3) 1_1760620436961.png"
                  alt="Mobile App"
                  className="w-32"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#2C5F6F]">Track Your Progress</h3>
                  <p className="text-gray-600">
                    Monitor your application status and communicate with our team through our mobile app.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-[#E8F7FB] rounded-2xl flex items-center justify-center">
                  <img src="/Icon Badge (1)_1760620436960.png" alt="Visa Support" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-[#2C5F6F]">Visa & Relocation Assistance</h3>
                <p className="text-gray-600">
                  Complete support with visa processing and relocation logistics for a smooth transition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2C5F6F]">
              Testimonials from Our Satisfied Candidates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="/Image (7)_1760620436959.png"
                    alt="Testimonial"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#2C5F6F]">Sarah Ahmed</h4>
                    <p className="text-sm text-gray-500">Registered Nurse, UK</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Duke Consultancy made my dream of working in the UK a reality. Their support throughout the entire process was exceptional, from documentation to my first day at work."
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-[#E8F7FB]">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="/Image (7)_1760620436959.png"
                    alt="Testimonial"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#2C5F6F]">Ali Hassan</h4>
                    <p className="text-sm text-gray-500">Medical Technician, Germany</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Professional, reliable, and genuinely caring. The team at Duke Consultancy guided me through every step and I'm now working at a top hospital in Germany."
                </p>
              </CardContent>
            </Card>
          </div>
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
      <section className="w-full py-16 lg:py-24 bg-gradient-to-r from-[#2C5F6F] to-[#00A6CE]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Start Your Professional Journey Here
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of healthcare professionals who have successfully launched their international careers with Duke Consultancy
          </p>
          <Button className="bg-white text-[#2C5F6F] hover:bg-gray-100 px-8 py-6 rounded-full text-base font-semibold">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#2C5F6F] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <img
                src="/Group_1760620436964.png"
                alt="Duke Consultancy Logo"
                className="h-12 brightness-0 invert"
              />
              <p className="text-white/80 text-sm">
                Connecting talented healthcare professionals with global opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white">Job Placement</a></li>
                <li><a href="#" className="hover:text-white">Documentation Support</a></li>
                <li><a href="#" className="hover:text-white">Visa Assistance</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:opacity-80">
                  <img src="/fb_1760620436958.png" alt="Facebook" className="w-8 h-8" />
                </a>
                <a href="#" className="hover:opacity-80">
                  <img src="/twt_1760620436957.png" alt="Twitter" className="w-8 h-8" />
                </a>
                <a href="#" className="hover:opacity-80">
                  <img src="/ig_1760620436957.png" alt="Instagram" className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            © 2024 Duke Consultancy & Training. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
