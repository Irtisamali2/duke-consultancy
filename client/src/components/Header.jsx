import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

export const Header = ({ currentPage = 'home' }) => {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="w-full bg-white py-4 px-4 sm:px-6 lg:px-20 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-8 sm:h-10" />
        
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="/" 
            className={`text-sm font-medium transition-colors ${
              currentPage === 'home' ? 'text-[#00A6CE]' : 'text-gray-700 hover:text-[#00A6CE]'
            }`}
          >
            Home
          </a>
          <a 
            href="/about" 
            className={`text-sm font-medium transition-colors ${
              currentPage === 'about' ? 'text-[#00A6CE]' : 'text-gray-700 hover:text-[#00A6CE]'
            }`}
          >
            About Us
          </a>
          <a 
            href="/blogs" 
            className={`text-sm font-medium transition-colors ${
              currentPage === 'blogs' ? 'text-[#00A6CE]' : 'text-gray-700 hover:text-[#00A6CE]'
            }`}
          >
            Blogs
          </a>
          <a 
            href="/contact" 
            className={`text-sm font-medium transition-colors ${
              currentPage === 'contact' ? 'text-[#00A6CE]' : 'text-gray-700 hover:text-[#00A6CE]'
            }`}
          >
            Contact Us
          </a>
        </nav>
        
        <Button 
          onClick={() => setLocation('/candidate/register')}
          className="hidden md:flex bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6"
        >
          Get Registered
        </Button>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-700"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <a 
              href="/" 
              className={`text-base font-medium py-2 ${
                currentPage === 'home' ? 'text-[#00A6CE]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`text-base font-medium py-2 ${
                currentPage === 'about' ? 'text-[#00A6CE]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </a>
            <a 
              href="/blogs" 
              className={`text-base font-medium py-2 ${
                currentPage === 'blogs' ? 'text-[#00A6CE]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </a>
            <a 
              href="/contact" 
              className={`text-base font-medium py-2 ${
                currentPage === 'contact' ? 'text-[#00A6CE]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>
            <Button 
              onClick={() => {
                setLocation('/candidate/register');
                setMobileMenuOpen(false);
              }}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white w-full"
            >
              Get Registered
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
