import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const goToNext = () => {
    if (currentIndex + 3 < blogs.length) {
      setCurrentIndex(currentIndex + 3);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3);
    } else {
      const lastSetIndex = Math.floor((blogs.length - 1) / 3) * 3;
      setCurrentIndex(lastSetIndex);
    }
  };

  const getCurrentBlogs = () => {
    return blogs.slice(currentIndex, currentIndex + 3);
  };

  const totalDots = Math.ceil(blogs.length / 3);
  const currentDot = Math.floor(currentIndex / 3);

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

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {getCurrentBlogs().map((blog) => (
          <Card 
            key={blog.id} 
            className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
            onClick={() => setLocation(`/blogs/${blog.id}`)}
          >
            <img
              src={blog.featured_image || '/pexels-tima-miroshnichenko-8376309 1_1760620436958.png'}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-gray-500">
                {formatDate(blog.published_date)} - {blog.category || 'General'}
              </p>
              <h3 className="text-lg font-semibold text-[#2C5F6F] line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
              </p>
              <Button variant="link" className="text-[#00A6CE] p-0 h-auto">
                Read More →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {blogs.length > 3 && (
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
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentDot ? 'bg-[#00A6CE]' : 'bg-gray-300'
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
      )}
    </div>
  );
};
