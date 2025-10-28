import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function SocialLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    platform_name: '',
    platform_url: '',
    icon_class: '',
    display_order: 0,
    status: 'active'
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/social-links', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setLinks(data.socialLinks);
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const url = editingId 
        ? `/api/admin/social-links/${editingId}`
        : '/api/admin/social-links';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: editingId ? 'Link updated successfully!' : 'Link created successfully!' });
        fetchLinks();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const handleEdit = (link) => {
    setFormData({
      platform_name: link.platform_name,
      platform_url: link.platform_url,
      icon_class: link.icon_class,
      display_order: link.display_order,
      status: link.status
    });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;

    try {
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Link deleted successfully!' });
        fetchLinks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete link' });
    }
  };

  const resetForm = () => {
    setFormData({
      platform_name: '',
      platform_url: '',
      icon_class: '',
      display_order: 0,
      status: 'active'
    });
    setEditingId(null);
    setShowForm(false);
  };

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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Links</h1>
              <p className="text-gray-600">Manage your social media links</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              {showForm ? 'Cancel' : '+ Add New Link'}
            </Button>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {showForm && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingId ? 'Edit Social Link' : 'Add New Social Link'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.platform_name}
                        onChange={(e) => setFormData({...formData, platform_name: e.target.value})}
                        placeholder="Facebook, LinkedIn, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Class
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.icon_class}
                        onChange={(e) => setFormData({...formData, icon_class: e.target.value})}
                        placeholder="e.g., facebook, linkedin, twitter"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      />
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 mb-1">💡 Available Icons:</p>
                        <div className="flex flex-wrap gap-2 text-xs text-blue-700">
                          <span className="bg-white px-2 py-1 rounded">facebook</span>
                          <span className="bg-white px-2 py-1 rounded">twitter</span>
                          <span className="bg-white px-2 py-1 rounded">instagram</span>
                          <span className="bg-white px-2 py-1 rounded">linkedin</span>
                          <span className="bg-white px-2 py-1 rounded">youtube</span>
                          <span className="bg-white px-2 py-1 rounded">tiktok</span>
                          <span className="bg-white px-2 py-1 rounded">whatsapp</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">Simply type one of these names (lowercase) to use its icon</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform URL
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.platform_url}
                        onChange={(e) => setFormData({...formData, platform_url: e.target.value})}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-[#00A6CE] hover:bg-[#0090B5] text-white">
                      {editingId ? 'Update Link' : 'Add Link'}
                    </Button>
                    <Button type="button" onClick={resetForm} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Links List */}
          <div className="grid grid-cols-1 gap-4">
            {links.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No social links found. Add your first link above.
                </CardContent>
              </Card>
            ) : (
              links.map((link) => (
                <Card key={link.id}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#B0E5F0] flex items-center justify-center">
                        <span className="text-[#00A6CE] font-bold">{link.icon_class[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{link.platform_name}</h3>
                        <p className="text-sm text-gray-600">{link.platform_url}</p>
                        <p className="text-xs text-gray-500">Icon: {link.icon_class} | Order: {link.display_order} | Status: {link.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(link)}
                        className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(link.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
