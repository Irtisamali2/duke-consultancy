import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';

export default function EmailTemplatesPage() {
  const [, setLocation] = useLocation();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/email/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Template Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {template.template_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        onClick={() => setLocation(`/admin/email-templates/${template.id}`)}
                        className="bg-[#00A6CE] hover:bg-[#0090B5] text-white text-xs"
                      >
                        Edit Template
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>Available Variables:</strong> Use these placeholders in your templates. They will be replaced with actual data when emails are sent.
          </p>
          <ul className="mt-2 text-xs text-blue-600 list-disc list-inside">
            <li>{'{{candidate_name}}'} - Candidate's full name</li>
            <li>{'{{application_id}}'} - Application ID number</li>
            <li>{'{{trade}}'} - Trade/profession applied for</li>
            <li>{'{{submitted_date}}'} - Application submission date</li>
            <li>{'{{updated_date}}'} - Last update date</li>
            <li>{'{{remarks}}'} - Admin remarks (if any)</li>
            <li>{'{{reset_link}}'} - Password reset link</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
