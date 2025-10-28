import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';

export default function EmailTemplateEditPage() {
  const [, params] = useRoute('/admin/email-templates/edit/:id');
  const [, setLocation] = useLocation();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchTemplate(params.id);
    }
  }, [params?.id]);

  const fetchTemplate = async (id) => {
    try {
      const response = await fetch(`/api/email/templates/${id}`);
      const data = await response.json();
      if (data.success) {
        setTemplate(data.template);
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/email/templates/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: template.subject,
          body: template.body
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Template updated successfully!');
        setLocation('/admin/email-templates');
      } else {
        alert(data.message || 'Failed to update template');
      }
    } catch (error) {
      alert('Failed to update template');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  if (!template) {
    return <AdminLayout><div className="p-8">Template not found</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Email Template</h1>
          <Button
            onClick={() => setLocation('/admin/email-templates')}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Back to Templates
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                type="text"
                value={template.template_name}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject *</label>
              <input
                type="text"
                value={template.subject}
                onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Body (HTML) *</label>
              <textarea
                value={template.body}
                onChange={(e) => setTemplate({ ...template, body: e.target.value })}
                required
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] font-mono text-sm"
              />
            </div>

            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-700 mb-2"><strong>Available Variables for this template:</strong></p>
              <p className="text-xs text-yellow-600">{template.variables}</p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => setLocation('/admin/email-templates')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8"
              >
                {saving ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
