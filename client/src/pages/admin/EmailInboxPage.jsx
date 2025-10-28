import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function EmailInboxPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/email/inbox');
      const data = await response.json();
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/email/inbox/${id}/read`, { method: 'PATCH' });
      fetchEmails();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Inbox</h1>
          <button
            onClick={fetchEmails}
            className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-4 py-2 rounded-lg text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> To receive candidate replies here, configure your email service to forward incoming emails to the webhook endpoint: 
            <code className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">/api/email/webhook/incoming</code>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No incoming emails found
                    </td>
                  </tr>
                ) : (
                  emails.map((email) => (
                    <tr key={email.id} className={`hover:bg-gray-50 ${!email.is_read ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!email.is_read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(email.received_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className={!email.is_read ? 'font-semibold' : ''}>{email.from_name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{email.from_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className={!email.is_read ? 'font-semibold' : ''}>{email.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => {
                            if (!email.is_read) {
                              markAsRead(email.id);
                            }
                            
                            // Create modal DOM elements safely to prevent XSS
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                            
                            const modalContent = document.createElement('div');
                            modalContent.className = 'bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6';
                            
                            const header = document.createElement('div');
                            header.className = 'flex justify-between items-center mb-4';
                            const title = document.createElement('h2');
                            title.className = 'text-xl font-bold';
                            title.textContent = `Email from ${email.from_name || email.from_email}`;
                            
                            const closeBtn = document.createElement('button');
                            closeBtn.textContent = '✕';
                            closeBtn.className = 'text-gray-500 hover:text-gray-700';
                            closeBtn.onclick = () => modal.remove();
                            
                            header.appendChild(title);
                            header.appendChild(closeBtn);
                            
                            const details = document.createElement('div');
                            details.className = 'mb-4 text-sm';
                            const detailsText = document.createTextNode(
                              `From: ${email.from_email}\nTo: ${email.to_email}\nSubject: ${email.subject}\nDate: ${new Date(email.received_at).toLocaleString()}`
                            );
                            details.appendChild(detailsText);
                            
                            const bodySection = document.createElement('div');
                            bodySection.className = 'border-t pt-4';
                            const bodyLabel = document.createElement('strong');
                            bodyLabel.className = 'block mb-2';
                            bodyLabel.textContent = 'Message:';
                            
                            const bodyContent = document.createElement('div');
                            bodyContent.className = 'border rounded p-4 bg-gray-50 whitespace-pre-wrap';
                            bodyContent.textContent = email.body; // Display as text to prevent XSS
                            
                            bodySection.appendChild(bodyLabel);
                            bodySection.appendChild(bodyContent);
                            
                            const replySection = document.createElement('div');
                            replySection.className = 'border-t pt-4 mt-4';
                            const replyLink = document.createElement('a');
                            replyLink.href = `mailto:${email.from_email}?subject=Re: ${email.subject}`;
                            replyLink.className = 'bg-[#00A6CE] hover:bg-[#0090B5] text-white px-4 py-2 rounded inline-block';
                            replyLink.textContent = 'Reply via Email Client';
                            replySection.appendChild(replyLink);
                            
                            modalContent.appendChild(header);
                            modalContent.appendChild(details);
                            modalContent.appendChild(bodySection);
                            modalContent.appendChild(replySection);
                            modal.appendChild(modalContent);
                            document.body.appendChild(modal);
                          }}
                          className="text-[#00A6CE] hover:text-[#0090B5]"
                        >
                          View
                        </button>
                        {!email.is_read && (
                          <button
                            onClick={() => markAsRead(email.id)}
                            className="text-gray-600 hover:text-gray-800 text-xs"
                          >
                            Mark Read
                          </button>
                        )}
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
