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
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    author: '',
    categories: '',
    tags: '',
    status: 'draft'
  });
  
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsModified, setTagsModified] = useState(false); // Track if tags have been modified
  const [tagInput, setTagInput] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageUploadMode, setImageUploadMode] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit && blogId) {
      fetchBlog();
    }
  }, [isEdit, blogId]);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog-categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const response = await fetch('/api/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newCategoryName, description: '' })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchCategories();
        setSelectedCategories([...selectedCategories, newCategoryName]);
        setNewCategoryName('');
        setShowNewCategory(false);
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/admin/${blogId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success && data.blog) {
        const blog = data.blog;
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          featured_image: blog.featured_image || '',
          author: blog.author || '',
          categories: blog.categories || blog.category || '',
          tags: blog.tags || '',
          status: blog.status || 'draft'
        });
        
        // Parse categories - always set even if empty
        if (blog.categories) {
          setSelectedCategories(blog.categories.split(',').map(c => c.trim()).filter(Boolean));
        } else if (blog.category) {
          setSelectedCategories([blog.category]);
        } else {
          setSelectedCategories([]);
        }
        
        // Parse tags - always set even if empty to keep in sync
        const parsedTags = blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        setTags(parsedTags);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagsModified(true);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setTagsModified(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files (JPEG, PNG, GIF, WEBP) are allowed');
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('/api/upload/blog-image', {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, featured_image: data.imageUrl });
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status) => {
    try {
      const url = isEdit ? `/api/blogs/${blogId}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';
      
      // If tags have been modified in UI, use tags state (even if empty to allow clearing)
      // Otherwise, use original tags from formData (preserves unmodified tags)
      const finalTags = tagsModified ? tags.join(',') : (formData.tags || '');
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          ...formData, 
          status,
          categories: selectedCategories.join(','),
          tags: finalTags
        })
      });

      const data = await response.json();
      if (data.success) {
        setLocation('/admin/blogs');
      } else {
        alert('Error: ' + (data.message || 'Failed to save blog'));
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert('Failed to save blog. Please try again.');
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
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

          <div className="grid grid-cols-1 gap-4 mb-6">
            <input
              type="text"
              placeholder="Author Name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] bg-white"
            />
          </div>

          {/* Categories Selection */}
          <div className="mb-6 bg-white p-6 rounded-lg border border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories (select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryToggle(cat.name)}
                    className="w-4 h-4 text-[#00A6CE] border-gray-300 rounded focus:ring-[#00A6CE]"
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="text-sm text-[#00A6CE] hover:text-[#0090B5] font-medium"
            >
              + Add New Category
            </button>
            {showNewCategory && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-[#00A6CE] text-white rounded hover:bg-[#0090B5]"
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}
            {selectedCategories.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-gray-600">Selected: </span>
                <span className="text-sm font-medium text-gray-900">{selectedCategories.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Tags Input */}
          <div className="mb-6 bg-white p-6 rounded-lg border border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags (press Enter or comma to add)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#B0E5F0] text-gray-700"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags (e.g., health, diet, nutrition)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
          </div>

          {/* Featured Image - Both Upload and URL */}
          <div className="mb-6 bg-white p-6 rounded-lg border border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Featured Image
            </label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setImageUploadMode('upload')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  imageUploadMode === 'upload'
                    ? 'bg-[#00A6CE] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setImageUploadMode('url')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  imageUploadMode === 'url'
                    ? 'bg-[#00A6CE] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Use URL
              </button>
            </div>
            
            {imageUploadMode === 'upload' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A6CE] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Click to upload image (max 5MB)'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPEG, PNG, GIF, WEBP
                </p>
              </div>
            ) : (
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            )}
            
            {formData.featured_image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={formData.featured_image}
                  alt="Featured preview"
                  className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 break-all">{formData.featured_image}</p>
              </div>
            )}
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
    </AdminLayout>
  );
}
