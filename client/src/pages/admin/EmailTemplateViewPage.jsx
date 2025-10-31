import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';

export default function EmailTemplateViewPage() {
  const [, params] = useRoute('/admin/email-templates/view/:id');
  const [, setLocation] = useLocation();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-3xl font-bold text-gray-900">View Email Template</h1>
          <div className="space-x-3">
            <Button
              onClick={() => setLocation(`/admin/email-templates/edit/${params.id}`)}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              Edit Template
            </Button>
            <Button
              onClick={() => setLocation('/admin/email-templates')}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Back to Templates
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              {template.template_name}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Type</label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg capitalize">
              {template.status_type || template.template_key || 'N/A'}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              {template.description || 'No description'}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              {template.subject}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Preview</label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <div dangerouslySetInnerHTML={{ __html: template.body }} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
