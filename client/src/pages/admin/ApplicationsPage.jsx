import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';

export default function ApplicationsPage() {
  const [, setLocation] = useLocation();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');

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

  const filteredApplications = applications.filter(app => {
    return filter === 'all' || app.status === filter;
  });

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Applications Management</h1>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr 
                    key={app.id}
                    onClick={() => setLocation(`/admin/applications/${app.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(app.id).padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${app.first_name || ''} ${app.last_name || ''}`.trim() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.mobile_no || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.job_title || 'General Application'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
