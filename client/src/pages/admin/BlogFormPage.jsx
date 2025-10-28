import { useEffect, useState, useRef } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogFormPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/blogs/:action/:id?');
  const isEdit = params?.action === 'edit';
  const blogId = params?.id;
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  const [showBlockEditor, setShowBlockEditor] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState({
    type: 'text',
    style: 'heading-3',
    positioning: 'left',
    color: '#4F46E5',
    customAttribute: '',
    textContent: '',
    textAlign: 'left',
    isVisible: true,
    isHidden: false,
    isAccessible: true
  });

  useEffect(() => {
    if (isEdit && blogId) {
      fetchBlog();
    }
  }, [isEdit, blogId]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/admin/${blogId}`);
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
        credentials: 'include',
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

  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'size', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'link', 'image'
  ];

  const colorOptions = [
    '#E5E7EB',
    '#4F46E5',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#6366F1'
  ];

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Title here......"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-3xl font-bold border-none focus:outline-none bg-transparent placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] bg-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] bg-white"
              />
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Featured Image URL"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] bg-white"
              />
            </div>

            <div className="mb-6">
              <textarea
                placeholder="Excerpt (short description)"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] bg-white"
              />
            </div>

            <div className="mb-6 bg-white rounded-lg shadow-sm">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={modules}
                formats={formats}
                className="min-h-[500px]"
                placeholder="Start writing your blog content here..."
              />
            </div>

            <div className="flex justify-center gap-4 mt-8 pb-8">
              <Button
                onClick={() => handleSubmit('draft')}
                className="px-8 py-3 bg-[#B0E5F0] hover:bg-[#9DD9E8] text-gray-700 rounded-full font-medium"
              >
                Save As Draft
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                className="px-8 py-3 bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-full font-medium"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>

        {showBlockEditor && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Block</h3>
              <button
                onClick={() => setShowBlockEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Type</label>
                <select
                  value={selectedBlock.type}
                  onChange={(e) => setSelectedBlock({ ...selectedBlock, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="quote">Quote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Style</label>
                <select
                  value={selectedBlock.style}
                  onChange={(e) => setSelectedBlock({ ...selectedBlock, style: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                >
                  <option value="heading-1">Heading 1</option>
                  <option value="heading-2">Heading 2</option>
                  <option value="heading-3">Heading 3</option>
                  <option value="heading-4">Heading 4</option>
                  <option value="heading-5">Heading 5</option>
                  <option value="heading-6">Heading 6</option>
                  <option value="paragraph">Paragraph</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Positioning</label>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedBlock({ ...selectedBlock, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedBlock.color === color ? 'border-gray-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Details</label>
                <p className="text-xs text-gray-500 mb-3">
                  Here you can edit your block details seamlessly.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Attribute</label>
                <input
                  type="text"
                  value={selectedBlock.customAttribute}
                  onChange={(e) => setSelectedBlock({ ...selectedBlock, customAttribute: e.target.value })}
                  placeholder="heading-2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                <textarea
                  value={selectedBlock.textContent}
                  onChange={(e) => setSelectedBlock({ ...selectedBlock, textContent: e.target.value })}
                  placeholder="Enter your main text here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-sm"
                />
                <div className="text-right text-xs text-gray-400 mt-1">300/300</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBlock({ ...selectedBlock, textAlign: 'left' })}
                    className={`p-2 border rounded ${selectedBlock.textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedBlock({ ...selectedBlock, textAlign: 'center' })}
                    className={`p-2 border rounded ${selectedBlock.textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedBlock({ ...selectedBlock, textAlign: 'right' })}
                    className={`p-2 border rounded ${selectedBlock.textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Text Accessibility</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Is Visible For All</span>
                    <div
                      onClick={() => setSelectedBlock({ ...selectedBlock, isVisible: !selectedBlock.isVisible })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                        selectedBlock.isVisible ? 'bg-[#00A6CE]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          selectedBlock.isVisible ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Is Hidden</span>
                    <div
                      onClick={() => setSelectedBlock({ ...selectedBlock, isHidden: !selectedBlock.isHidden })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                        selectedBlock.isHidden ? 'bg-[#00A6CE]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          selectedBlock.isHidden ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Is Accessible</span>
                    <div
                      onClick={() => setSelectedBlock({ ...selectedBlock, isAccessible: !selectedBlock.isAccessible })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                        selectedBlock.isAccessible ? 'bg-[#00A6CE]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          selectedBlock.isAccessible ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Button className="w-full bg-[#00A6CE] hover:bg-[#0090B5] text-white">
                  Save Changes ✓
                </Button>
                <Button
                  onClick={() => setShowBlockEditor(false)}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                >
                  Discard Changes ✕
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
