import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import EmailEditor from './EmailEditor';

export default function BulkEmailModal({ applications, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/email/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates.filter(t => t.template_key === 'reminder' || t.template_key === 'custom'));
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setBody(template.body);
    } else {
      setSelectedTemplate('');
      setSubject('');
      setBody('');
    }
  };

  const handleSend = async () => {
    if (!subject || !body) {
      alert('Please enter a subject and message');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/email/bulk-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationIds: applications.map(app => app.id),
          subject,
          body,
          templateId: selectedTemplate || null
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully sent emails to ${data.sent} recipients`);
        onClose();
      } else {
        alert(data.message || 'Failed to send emails');
      }
    } catch (error) {
      alert('Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Send Bulk Email</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Sending to {applications.length} {applications.length === 1 ? 'recipient' : 'recipients'}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700 font-medium mb-2">Recipients:</p>
            <div className="text-xs text-blue-600 max-h-24 overflow-y-auto">
              {applications.map(app => (
                <div key={app.id}>• {app.email} ({app.full_name || 'Name not available'})</div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Template (Optional)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            >
              <option value="">-- Compose Custom Email --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.template_name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select a template or compose a custom email below
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <EmailEditor
              value={body}
              onChange={setBody}
              placeholder="Compose your email message... Use Insert Shortcode to add dynamic fields like candidate name, application ID, etc."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8"
            >
              {sending ? 'Sending...' : `Send to ${applications.length} ${applications.length === 1 ? 'Recipient' : 'Recipients'}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
