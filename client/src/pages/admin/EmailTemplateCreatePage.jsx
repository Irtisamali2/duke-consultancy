import { useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import EmailEditor from '../../components/EmailEditor';

export default function EmailTemplateCreatePage() {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    template_name: '',
    status_type: 'application_received',
    subject: '',
    body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00A6CE; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Duke Consultancy</h1>
    </div>
    <div class="content">
      <p>Dear {{candidate_name}},</p>
      <p>Your message content here...</p>
      <p>Best regards,<br>Duke Consultancy Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Duke Consultancy. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
    description: ''
  });

  const statusOptions = [
    { value: 'application_received', label: 'Application Received', desc: 'Sent when candidate submits application' },
    { value: 'verified', label: 'Application Verified', desc: 'Sent when admin verifies application' },
    { value: 'approved', label: 'Application Approved', desc: 'Sent when admin approves application' },
    { value: 'rejected', label: 'Application Rejected', desc: 'Sent when admin rejects application' },
    { value: 'reminder', label: 'Reminder Email', desc: 'Reminder/follow-up emails to candidates' },
    { value: 'password_reset', label: 'Password Reset', desc: 'Sent for password reset requests' },
    { value: 'custom', label: 'Custom Template', desc: 'Custom email template for manual sending' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/email/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Template created successfully!');
        setLocation('/admin/email-templates');
      } else {
        alert(data.message || 'Failed to create template');
      }
    } catch (error) {
      alert('Failed to create template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Email Template</h1>
          <Button
            onClick={() => setLocation('/admin/email-templates')}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Back to Templates
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
              <input
                type="text"
                value={formData.template_name}
                onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                placeholder="e.g., Welcome Email, Application Confirmation"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Type *</label>
              <select
                value={formData.status_type}
                onChange={(e) => setFormData({ ...formData, status_type: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this template"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Your Application Has Been Received"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Body *</label>
              <EmailEditor
                value={formData.body}
                onChange={(value) => setFormData({ ...formData, body: value })}
                placeholder="Compose your email template here... Use the Insert Shortcode button to add dynamic fields."
              />
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
                {saving ? 'Creating...' : 'Create Template'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
