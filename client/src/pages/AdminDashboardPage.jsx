import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeJobs: 0,
    healthcareProfiles: 0,
    publishedBlogs: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    recentApplications: [],
    recentCandidates: [],
    statusBreakdown: []
  });

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/stats/recent-activity');
      const data = await response.json();
      if (data.success) {
        setRecentActivity({
          recentApplications: data.recentApplications || [],
          recentCandidates: data.recentCandidates || [],
          statusBreakdown: data.statusBreakdown || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Main Content */}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Healthcare Profiles</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.healthcareProfiles}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Published Blogs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.publishedBlogs}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button 
              onClick={() => setLocation('/admin/applications')}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              Manage Applications
            </Button>
            <Button 
              onClick={() => setLocation('/admin/jobs')}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              Manage Jobs
            </Button>
            <Button 
              onClick={() => setLocation('/admin/blogs')}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              Manage Blogs
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
                <button
                  onClick={() => setLocation('/admin/applications')}
                  className="text-sm text-[#00A6CE] hover:text-[#0090B5] font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.recentApplications.length > 0 ? (
                recentActivity.recentApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setLocation(`/admin/applications/${app.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {`${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unnamed Candidate'}
                          </p>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {app.job_title || 'General Application'}
                          {app.trade_applied_for && ` • ${app.trade_applied_for}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{app.email}</p>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(app.applied_date)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No recent applications</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Status Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Application Status</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {recentActivity.statusBreakdown.length > 0 ? (
                  recentActivity.statusBreakdown.map((item) => {
                    const total = recentActivity.statusBreakdown.reduce((sum, s) => sum + s.count, 0);
                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                    
                    return (
                      <div key={item.status}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${
                              item.status === 'pending' ? 'bg-yellow-500' :
                              item.status === 'verified' ? 'bg-blue-500' :
                              item.status === 'approved' ? 'bg-green-500' :
                              'bg-red-500'
                            }`}></span>
                            <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === 'pending' ? 'bg-yellow-500' :
                              item.status === 'verified' ? 'bg-blue-500' :
                              item.status === 'approved' ? 'bg-green-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">No data available</p>
                  </div>
                )}
              </div>

              {recentActivity.recentCandidates.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Signups</h3>
                  <div className="space-y-3">
                    {recentActivity.recentCandidates.slice(0, 5).map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{candidate.email}</p>
                          <p className="text-xs text-gray-500">{candidate.application_count} application(s)</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDate(candidate.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
