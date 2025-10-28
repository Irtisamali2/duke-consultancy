import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export const BlogCarousel = () => {
  const [, setLocation] = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs/published');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A6CE]"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No blogs available yet.</p>
      </div>
    );
  }

  const currentBlog = blogs[currentIndex];
  const nextBlog = blogs[(currentIndex + 1) % blogs.length];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div 
          className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setLocation(`/blogs/${currentBlog.slug}`)}
        >
          <div className="h-64 overflow-hidden">
            <img
              src={currentBlog.featured_image || '/pexels-tima-miroshnichenko-8376309 1_1760620436958.png'}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 lg:p-8">
            <p className="text-gray-500 text-sm mb-3">
              {formatDate(currentBlog.published_date)} - {currentBlog.category || currentBlog.categories || 'General'}
            </p>
            <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-4">
              {truncateText(currentBlog.excerpt || currentBlog.content, 150)}
            </p>
            <button className="text-[#00A6CE] font-medium hover:underline">
              Read More →
            </button>
          </div>
        </div>

        {/* Second blog - hidden on mobile, shown on desktop */}
        {blogs.length > 1 && (
          <div 
            className="hidden lg:block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setLocation(`/blogs/${nextBlog.slug}`)}
          >
            <div className="h-64 overflow-hidden">
              <img
                src={nextBlog.featured_image || '/pexels-tima-miroshnichenko-8376309 1_1760620436958.png'}
                alt={nextBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 lg:p-8">
              <p className="text-gray-500 text-sm mb-3">
                {formatDate(nextBlog.published_date)} - {nextBlog.category || nextBlog.categories || 'General'}
              </p>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-4">
                {truncateText(nextBlog.excerpt || nextBlog.content, 150)}
              </p>
              <button className="text-[#00A6CE] font-medium hover:underline">
                Read More →
              </button>
            </div>
          </div>
        )}
      </div>

      {blogs.length > 1 && (
        <div className="flex items-center justify-between">
          <button 
            onClick={goToPrevious}
            className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
            aria-label="Previous blogs"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex gap-3">
            {blogs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#00A6CE]' : 'bg-gray-300'
                }`}
                aria-label={`Go to blog ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNext}
            className="w-14 h-14 rounded-full bg-[#00A6CE] flex items-center justify-center hover:bg-[#008fb5] transition-colors"
            aria-label="Next blogs"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
