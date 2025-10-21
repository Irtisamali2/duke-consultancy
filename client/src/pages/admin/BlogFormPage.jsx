import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/AdminLayout';

export default function BlogFormPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/blogs/:action/:id?');
  const isEdit = params?.action === 'edit';
  const blogId = params?.id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  useEffect(() => {
    if (isEdit && blogId) {
      fetchBlog();
    }
  }, [isEdit, blogId]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`);
      const data = await response.json();
      if (data.success) {
        setFormData(data.blog);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    }
  };

  const handleSubmit = async (status) => {
    try {
      const url = isEdit ? `/api/blogs/${blogId}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status })
      });

      const data = await response.json();
      if (data.success) {
        setLocation('/admin/blogs');
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Edit Blog' : 'Add Blog'}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Title here......"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-[#00A6CE] pb-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
          </div>

          <div className="mb-6">
            <textarea
              placeholder="Enter your content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => handleSubmit('draft')}
              className="bg-gray-400 hover:bg-gray-500 text-white"
            >
              Save As Draft
            </Button>
            <Button
              onClick={() => handleSubmit('published')}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
