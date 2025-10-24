import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';

export default function CandidateDashboardPage() {
  const [, setLocation] = useLocation();
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/candidate/verify');
      const data = await response.json();

      if (data.success) {
        setCandidate(data.candidate);
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
      <div className="w-64 bg-white min-h-screen border-r border-gray-200 p-6">
        <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10 mb-8" />
        
        <div className="flex items-center gap-3 mb-8 p-3 bg-[#E6F7FB] rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium">
              {candidate?.firstName?.[0]}{candidate?.lastName?.[0]}
            </span>
          </div>
          <span className="font-medium text-sm">{candidate?.firstName} {candidate?.lastName}</span>
        </div>

        <nav>
          <button 
            className="w-full text-left px-4 py-3 mb-2 bg-[#E6F7FB] text-[#00A6CE] rounded-lg font-medium"
          >
            Dashboard
          </button>
          <button 
            onClick={() => setLocation('/candidate/profile')}
            className="w-full text-left px-4 py-3 mb-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            My Profile
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="bg-[#E6F7FB] rounded-lg p-6 mb-6 flex items-center justify-between">
          <div>
            <Button 
              onClick={() => {
                if (applications.length === 0) {
                  setLocation('/candidate/profile');
                } else {
                  alert('You have already submitted an application. You can view/edit it from your profile.');
                }
              }}
              className="bg-[#0B7A9F] hover:bg-[#096685] text-white rounded-full px-8"
            >
              Apply Now
            </Button>
          </div>
          <p className="text-gray-600 text-sm">Lorem ipsum is simply dummy text of the printing and typesetting industry.</p>
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
  );
}
