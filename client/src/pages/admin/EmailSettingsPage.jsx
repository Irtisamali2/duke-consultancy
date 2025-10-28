import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: false,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: 'Duke Consultancy'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/email/smtp-settings');
      const data = await response.json();
      if (data.success && data.settings) {
        setSettings({
          ...settings,
          ...data.settings,
          smtp_password: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/email/smtp-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      if (data.success) {
        alert('SMTP settings saved successfully!');
      } else {
        alert(data.message || 'Failed to save settings');
      }
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SMTP Email Configuration</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-700">
              Configure your SMTP server details to enable email notifications for application status updates and password resets.
              Common SMTP providers: Gmail (smtp.gmail.com:587), SendGrid (smtp.sendgrid.net:587), Mailgun, etc.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host *</label>
                <input
                  type="text"
                  value={settings.smtp_host}
                  onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                  placeholder="smtp.gmail.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port *</label>
                <input
                  type="number"
                  value={settings.smtp_port}
                  onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username *</label>
                <input
                  type="text"
                  value={settings.smtp_user}
                  onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                  placeholder="your-email@gmail.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password *</label>
                <input
                  type="password"
                  value={settings.smtp_password}
                  onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                  placeholder="Enter password to update"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing password</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Email *</label>
                <input
                  type="email"
                  value={settings.from_email}
                  onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                  placeholder="noreply@dukeconsultancy.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Name *</label>
                <input
                  type="text"
                  value={settings.from_name}
                  onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.smtp_secure}
                  onChange={(e) => setSettings({ ...settings, smtp_secure: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Use SSL/TLS (recommended for port 465)</span>
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-8"
              >
                {saving ? 'Saving...' : 'Save SMTP Settings'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
