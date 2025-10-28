import { useLocation } from 'wouter';
import { Button } from './ui/button';

export const Header = ({ currentPage = 'home' }) => {
  const [, setLocation] = useLocation();
  
  return (
    <header className="w-full bg-white py-4 px-6 lg:px-20 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10" />
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
          className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6"
        >
          Get Registered
        </Button>
      </div>
    </header>
  );
};
