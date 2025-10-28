import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import DOMPurify from 'isomorphic-dompurify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function BlogDetailPage() {
  const [match, params] = useRoute('/blogs/:id');
  const [, setLocation] = useLocation();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (match && params.id) {
      fetchBlog(params.id);
      fetchRelatedBlogs(params.id);
    }
  }, [match, params]);

  const fetchBlog = async (id) => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.blog);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (currentId) => {
    try {
      const response = await fetch('/api/blogs/published');
      const data = await response.json();
      if (data.success) {
        const filtered = data.blogs.filter(b => b.id !== parseInt(currentId)).slice(0, 4);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch related blogs:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'a', 'img', 'div', 'span', 'br'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'style', 'class', 'target', 'rel']
    });
    return { __html: sanitizedContent };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A6CE]"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E6F7FB] to-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm mb-6">
              <span className="text-[#00A6CE]">🏠</span>
              <button onClick={() => setLocation('/blogs')} className="text-sm text-gray-600 hover:text-[#00A6CE]">
                Rated #1 choice for job searching
              </button>
            </div>
          </div>

          <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-[#E6F7FB] text-[#00A6CE] px-4 py-2 rounded-full text-sm font-medium">
                {blog.category || 'General'}
              </span>
              <span className="text-gray-600">by {blog.author || 'Duke Team'}</span>
              <span className="text-gray-500">{formatDate(blog.published_date)}</span>
            </div>

            {blog.excerpt && (
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {blog.featured_image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-li:text-gray-700 prose-li:mb-2
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-img:rounded-xl prose-img:my-8"
              dangerouslySetInnerHTML={renderContent(blog.content)}
            />
          </article>

          {relatedBlogs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Related blogs</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <div
                    key={relatedBlog.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => {
                      setLocation(`/blogs/${relatedBlog.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={relatedBlog.featured_image || '/placeholder-blog.jpg'}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#E6F7FB] text-[#00A6CE] px-2 py-1 rounded text-xs font-medium">
                          {relatedBlog.category || 'General'}
                        </span>
                        <span className="text-gray-500 text-xs">{formatDate(relatedBlog.published_date)}</span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {relatedBlog.excerpt || relatedBlog.content?.substring(0, 80) + '...'}
                      </p>
                      
                      <button className="text-[#00A6CE] text-xs font-medium hover:text-[#0090B5] inline-flex items-center gap-1">
                        Read More
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
