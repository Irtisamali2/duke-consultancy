import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import BulkEmailModal from '../../components/BulkEmailModal';

export default function ApplicationsPage() {
  const [, setLocation] = useLocation();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  
  const [filters, setFilters] = useState({
    job_id: '',
    country: '',
    trade: '',
    from_date: '',
    to_date: '',
    status: ''
  });
  
  const [countries, setCountries] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchFilterOptions();
  }, []);
  
  useEffect(() => {
    fetchApplications();
  }, [filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, [filters.job_id]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs.filter(j => j.status === 'active'));
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.job_id) {
        queryParams.append('job_id', filters.job_id);
      }
      
      const response = await fetch(`/api/applications/filters/options?${queryParams}`);
      const data = await response.json();
      if (data.success) {
        setCountries(data.countries);
        setTrades(data.trades);
        
        if (filters.trade && !data.trades.includes(filters.trade)) {
          setFilters(prev => ({ ...prev, trade: '' }));
        }
        
        if (filters.country && !data.countries.includes(filters.country)) {
          setFilters(prev => ({ ...prev, country: '' }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await fetch(`/api/applications?${queryParams}`);
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
  
  const handleExport = async (exportAll = false) => {
    try {
      const payload = exportAll ? filters : { application_ids: selectedIds };
      
      const response = await fetch('/api/applications/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to export applications');
      }
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export applications');
    }
  };
  
  const resetFilters = () => {
    setFilters({
      job_id: '',
      country: '',
      trade: '',
      from_date: '',
      to_date: '',
      status: ''
    });
    setFilter('all');
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
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All ({stats.all})
            </button>
            
            {selectedIds.length > 0 && (
              <>
                <span className="text-sm text-gray-600">{selectedIds.length} selected</span>
                <button
                  onClick={() => handleExport(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Selected
                </button>
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
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job</label>
              <select
                value={filters.job_id}
                onChange={(e) => setFilters({ ...filters, job_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                <option value="">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
              <select
                value={filters.trade}
                onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                <option value="">All Trades</option>
                {trades.map(trade => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.from_date}
                onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.to_date}
                onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-[#00A6CE] hover:text-[#0090B5] font-medium"
            >
              Reset All Filters
            </button>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                      No applications found matching the current filters
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app.id)}
                          onChange={() => toggleSelect(app.id)}
                          className="w-4 h-4 text-[#00A6CE] focus:ring-[#00A6CE] rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {`${app.first_name || ''} ${app.last_name || ''}`.trim() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.mobile_no || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.job_title || 'General Application'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {(() => {
                          try {
                            const countries = typeof app.countries_preference === 'string' 
                              ? JSON.parse(app.countries_preference) 
                              : app.countries_preference;
                            return Array.isArray(countries) && countries.length > 0 ? countries.join(', ') : 'N/A';
                          } catch (e) {
                            return 'N/A';
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {(() => {
                          try {
                            const trades = typeof app.trades_preference === 'string' 
                              ? JSON.parse(app.trades_preference) 
                              : app.trades_preference;
                            return Array.isArray(trades) && trades.length > 0 ? trades.join(', ') : 'N/A';
                          } catch (e) {
                            return 'N/A';
                          }
                        })()}
                      </td>
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
                  ))
                )}
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
