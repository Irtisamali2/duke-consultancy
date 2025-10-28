import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function EmailLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/email/logs');
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Email Logs</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No email logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(log.sent_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{log.recipient_name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{log.recipient_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          log.status === 'sent' ? 'bg-green-100 text-green-800' :
                          log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            // Create modal DOM elements safely to prevent XSS
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                            
                            const modalContent = document.createElement('div');
                            modalContent.className = 'bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6';
                            
                            const header = document.createElement('div');
                            header.className = 'flex justify-between items-center mb-4';
                            header.innerHTML = '<h2 class="text-xl font-bold">Email Details</h2>';
                            
                            const closeBtn = document.createElement('button');
                            closeBtn.textContent = '✕';
                            closeBtn.className = 'text-gray-500 hover:text-gray-700';
                            closeBtn.onclick = () => modal.remove();
                            header.appendChild(closeBtn);
                            
                            const details = document.createElement('div');
                            details.className = 'mb-4';
                            const detailsText = document.createTextNode(`To: ${log.recipient_email}\nSubject: ${log.subject}\nDate: ${new Date(log.sent_at).toLocaleString()}\nStatus: ${log.status}`);
                            details.appendChild(detailsText);
                            
                            const bodySection = document.createElement('div');
                            bodySection.className = 'border-t pt-4';
                            const bodyLabel = document.createElement('strong');
                            bodyLabel.className = 'block mb-2';
                            bodyLabel.textContent = 'Email Body:';
                            
                            const bodyPreview = document.createElement('div');
                            bodyPreview.className = 'border rounded p-4 bg-gray-50 max-h-96 overflow-auto';
                            bodyPreview.textContent = log.body; // Display as text to prevent XSS
                            
                            bodySection.appendChild(bodyLabel);
                            bodySection.appendChild(bodyPreview);
                            
                            modalContent.appendChild(header);
                            modalContent.appendChild(details);
                            modalContent.appendChild(bodySection);
                            modal.appendChild(modalContent);
                            document.body.appendChild(modal);
                          }}
                          className="text-[#00A6CE] hover:text-[#0090B5]"
                        >
                          View Details
                        </button>
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
