import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import CandidateSidebar from '../../components/CandidateSidebar';

export default function CandidateDashboardPage() {
  const [, setLocation] = useLocation();
  const [candidate, setCandidate] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/candidate/verify');
      const data = await response.json();

      if (data.success) {
        setCandidate(data.candidate);
        await fetchProfile();
        await fetchApplications();
      } else {
        setLocation('/candidate/login');
      }
    } catch (error) {
      setLocation('/candidate/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/candidate/profile');
      const data = await response.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/candidate/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/candidate/logout', { method: 'POST' });
      setLocation('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar 
        candidate={candidate}
        profileImage={profile?.profile_image_url}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Mobile header with hamburger */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src="/Group_1760620436964.png" alt="Duke Consultancy" className="h-8" />
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="bg-[#E6F7FB] rounded-lg p-6 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Apply?</h3>
            <p className="text-gray-600 text-sm mb-3">Browse available job opportunities and submit your application.</p>
            <Button 
              onClick={() => setLocation('/candidate/browse-jobs')}
              className="bg-[#0B7A9F] hover:bg-[#096685] text-white rounded-full px-8"
            >
              Browse Jobs
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00A6CE] to-[#0B7A9F] rounded-lg p-8 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Duke!</h1>
          <h2 className="text-4xl font-bold mb-2">{candidate?.firstName} {candidate?.lastName}</h2>
          <p className="text-sm opacity-90">Last Login From - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Application ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Application Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">View/edit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Download Application</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No applications found. Complete your profile to submit your first application!
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {String(app.id).padStart(6, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {app.job_title || 'General Application'}
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => setLocation('/candidate/profile')}
                          className="text-[#00A6CE] hover:text-[#0090B5]"
                        >
                          👁️
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-[#00A6CE] hover:text-[#0090B5]">
                          ⬇️
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
      </div>
    </div>
  );
}
