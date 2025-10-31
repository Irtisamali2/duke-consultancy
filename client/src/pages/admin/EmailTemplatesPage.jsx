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

  const handleDelete = async (id, templateName) => {
    if (confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      try {
        const response = await fetch(`/api/email/templates/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          alert('Template deleted successfully');
          fetchTemplates();
        } else {
          alert(data.message || 'Failed to delete template');
        }
      } catch (error) {
        alert('Failed to delete template');
      }
    }
  };

  const getStatusTypeLabel = (statusType) => {
    const labels = {
      'application_received': 'Application Received',
      'verified': 'Application Verified',
      'approved': 'Application Approved',
      'rejected': 'Application Rejected',
      'pending': 'Application Pending',
      'password_reset': 'Password Reset',
      'reminder': 'Reminder',
      'custom': 'Custom'
    };
    return labels[statusType] || statusType;
  };

  if (loading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <Button
            onClick={() => setLocation('/admin/email-templates/new')}
            className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
          >
            + Create New Template
          </Button>
        </div>

        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>Available Variables:</strong> Use these placeholders in your templates. They will be replaced with actual data when emails are sent.
          </p>
          <ul className="mt-2 text-xs text-blue-600 list-disc list-inside grid grid-cols-2 gap-2">
            <li>{'{{candidate_name}}'} - Candidate's full name</li>
            <li>{'{{application_id}}'} - Application ID number</li>
            <li>{'{{trade}}'} - Trade/profession applied for</li>
            <li>{'{{submitted_date}}'} - Application submission date</li>
            <li>{'{{updated_date}}'} - Last update date</li>
            <li>{'{{remarks}}'} - Admin remarks (if any)</li>
            <li>{'{{reset_link}}'} - Password reset link</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Template Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No email templates found. Click "Create New Template" to add one.
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {template.template_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {getStatusTypeLabel(template.status_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{template.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{template.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button
                          onClick={() => setLocation(`/admin/email-templates/view/${template.id}`)}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => setLocation(`/admin/email-templates/edit/${template.id}`)}
                          className="bg-[#00A6CE] hover:bg-[#0090B5] text-white text-xs px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(template.id, template.template_name)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
