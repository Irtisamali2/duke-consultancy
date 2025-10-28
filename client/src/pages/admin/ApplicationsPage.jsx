import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import BulkEmailModal from '../../components/BulkEmailModal';

export default function ApplicationsPage() {
  const [, setLocation] = useLocation();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkEmail, setShowBulkEmail] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchApplications();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchApplications();
      } else {
        alert('Failed to delete application');
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Failed to delete application');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map(app => app.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredApplications = applications.filter(app => {
    return filter === 'all' || app.status === filter;
  });

  const selectedApplications = applications.filter(app => selectedIds.includes(app.id));

  const stats = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    verified: applications.filter(a => a.status === 'verified').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{selectedIds.length} selected</span>
              <button
                onClick={() => setShowBulkEmail(true)}
                className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Send Bulk Email
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-6">
              <button
                onClick={() => setFilter('all')}
                className={`pb-2 ${filter === 'all' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                All ({stats.all})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`pb-2 ${filter === 'pending' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`pb-2 ${filter === 'verified' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Verified ({stats.verified})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`pb-2 ${filter === 'approved' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`pb-2 ${filter === 'rejected' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#00A6CE] focus:ring-[#00A6CE] rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app.id)}
                        onChange={() => toggleSelect(app.id)}
                        className="w-4 h-4 text-[#00A6CE] focus:ring-[#00A6CE] rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.mobile_no || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.job_title || 'General Application'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">pending</option>
                        <option value="verified">verified</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLocation(`/admin/applications/${app.id}`)}
                          className="text-[#00A6CE] hover:text-[#0090B5]"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDelete(app.id, e)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Application"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showBulkEmail && (
        <BulkEmailModal
          applications={selectedApplications}
          onClose={() => {
            setShowBulkEmail(false);
            setSelectedIds([]);
          }}
        />
      )}
    </AdminLayout>
  );
}
