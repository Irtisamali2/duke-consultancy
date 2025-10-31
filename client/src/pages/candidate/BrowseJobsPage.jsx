import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import CandidateSidebar from '../../components/CandidateSidebar';

export default function BrowseJobsPage() {
  const [, setLocation] = useLocation();
  const [candidate, setCandidate] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        await fetchJobs();
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

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs/public');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/candidate/applications');
      const data = await response.json();
      if (data.success) {
        const jobIds = data.applications.map(app => app.job_id);
        setAppliedJobs(jobIds);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApply = async (jobId) => {
    if (!profile) {
      alert('Please complete your profile before applying to jobs');
      setLocation('/candidate/register-profile');
      return;
    }

    if (appliedJobs.includes(jobId)) {
      alert('You have already applied to this job');
      return;
    }

    try {
      const response = await fetch('/api/candidate/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Application submitted successfully!');
        setShowModal(false);
        await fetchApplications();
      } else {
        alert(data.message || 'Failed to submit application');
      }
    } catch (error) {
      alert('Failed to submit application');
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

  const parseJSON = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
            <p className="text-gray-600">Explore available opportunities and submit your application</p>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No active jobs available at the moment</p>
              <p className="text-gray-400 mt-2">Please check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {job.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {job.job_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {job.experience_required}
                    </p>
                    {job.salary_range && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Salary:</span> {job.salary_range}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetails(job)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.includes(job.id)}
                      className={`flex-1 ${
                        appliedJobs.includes(job.id)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#00A6CE] hover:bg-[#0090B5] text-white'
                      }`}
                    >
                      {appliedJobs.includes(job.id) ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base font-medium text-gray-900">{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="text-base font-medium text-gray-900">{selectedJob.job_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience Required</p>
                    <p className="text-base font-medium text-gray-900">{selectedJob.experience_required}</p>
                  </div>
                  {selectedJob.salary_range && (
                    <div>
                      <p className="text-sm text-gray-500">Salary Range</p>
                      <p className="text-base font-medium text-gray-900">{selectedJob.salary_range}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {parseJSON(selectedJob.countries).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseJSON(selectedJob.countries).map((country, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {parseJSON(selectedJob.trades).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Trades/Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseJSON(selectedJob.trades).map((trade, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {trade}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <Button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={appliedJobs.includes(selectedJob.id)}
                  className={`w-full ${
                    appliedJobs.includes(selectedJob.id)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#00A6CE] hover:bg-[#0090B5] text-white'
                  }`}
                >
                  {appliedJobs.includes(selectedJob.id) ? 'Already Applied' : 'Apply for This Job'}
                </Button>
                {!profile && (
                  <p className="text-sm text-amber-600 mt-2 text-center">
                    Complete your profile before applying
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
