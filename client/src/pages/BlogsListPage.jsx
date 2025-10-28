import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function BlogsListPage() {
  const [, setLocation] = useLocation();
  const [blogs, setBlogs] = useState([]);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E6F7FB] to-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm mb-6">
              <span className="text-[#00A6CE]">🏠</span>
              <span className="text-sm text-gray-600">Rated #1 choice for job searching</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blogs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you have a question, need support, or want to learn more about how Duke can help you, we're here to assist you.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A6CE]"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No blogs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/blogs/${blog.id}`)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={blog.featured_image || '/placeholder-blog.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-[#E6F7FB] text-[#00A6CE] px-3 py-1 rounded text-sm font-medium">
                        {blog.category || 'General'}
                      </span>
                      <span className="text-gray-500 text-sm">{formatDate(blog.published_date)}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                    </p>
                    
                    <button className="text-[#00A6CE] font-medium hover:text-[#0090B5] inline-flex items-center gap-1">
                      Read More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
