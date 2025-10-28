import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="contact" />

      {/* Hero Section */}
      <section className="w-full py-12 sm:py-16 md:py-18 lg:py-20 bg-gradient-to-b from-[#37AFCD]/40 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3 sm:px-4 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-full mb-4 sm:mb-6 md:mb-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-[#00A6CE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#00A6CE] text-xs sm:text-sm md:text-sm font-medium">Rated #1 choice for job searching</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-6">
            Get in touch with us
          </h1>
          <p className="text-sm sm:text-base md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Whether you have a question, need support, or want to learn more about how Duke can help you, we're here to assist you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="w-full py-10 sm:py-16 md:py-18 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {/* Contact Form */}
            <div className="bg-[#E8F7FB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-9 lg:p-10">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
                  <div>
                    <label className="block text-gray-700 text-xs sm:text-sm md:text-sm font-medium mb-1.5 sm:mb-2 md:mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-xs sm:text-sm md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs sm:text-sm md:text-sm font-medium mb-1.5 sm:mb-2 md:mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-xs sm:text-sm md:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
                  <div>
                    <label className="block text-gray-700 text-xs sm:text-sm md:text-sm font-medium mb-1.5 sm:mb-2 md:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-xs sm:text-sm md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs sm:text-sm md:text-sm font-medium mb-1.5 sm:mb-2 md:mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-xs sm:text-sm md:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4 sm:mb-5 md:mb-6">
                  <label className="block text-gray-700 text-xs sm:text-sm md:text-sm font-medium mb-1.5 sm:mb-2 md:mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type Your Message here"
                    rows="6"
                    className="w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-xs sm:text-sm md:text-sm resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8 sm:px-10 py-5 sm:py-6 rounded-full text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-b from-[#24495C] to-[#00AADC] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Contact Info</h2>
              <p className="text-white/90 text-xs sm:text-sm mb-6 sm:mb-8">
                Explore our services today and see how we can help you succeed.
              </p>

              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      820 Ohio Road<br />
                      Scotch Plains, NJ 07076
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm">1-800-478-4400</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm">hello@dukeconsultancy.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm">Mon–Sun: 9 AM–5PM</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D7A8A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D7A8A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D7A8A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full">
        <div className="w-full h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9542977142765!2d-74.3897!3d40.6447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3a82f1352d0e9%3A0x1!2s820%20Ohio%20Rd%2C%20Scotch%20Plains%2C%20NJ%2007076!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
