import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import CandidateSidebar from '../../components/CandidateSidebar';

export default function CandidateApplicationViewPage() {
  const [match, params] = useRoute('/candidate/application/view');
  const searchParams = new URLSearchParams(window.location.search);
  const applicationId = searchParams.get('application_id');
  const [, setLocation] = useLocation();
  
  const [data, setData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [sidebarProfileImage, setSidebarProfileImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchSidebarProfile();
  }, []);

  useEffect(() => {
    if (applicationId && candidate) {
      fetchApplicationDetails();
    }
  }, [applicationId, candidate]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/candidate/verify');
      const result = await response.json();
      if (result.success) {
        setCandidate(result.candidate);
      } else {
        setLocation('/candidate/login');
      }
    } catch (error) {
      setLocation('/candidate/login');
    }
  };

  const fetchSidebarProfile = async () => {
    try {
      const response = await fetch('/api/candidate/profile/basic');
      const result = await response.json();
      if (result.success && result.profile) {
        setSidebarProfileImage(result.profile.profile_image_url || null);
      }
    } catch (error) {
      console.error('Failed to fetch sidebar profile:', error);
    }
  };

  const fetchApplicationDetails = async () => {
    try {
      const response = await fetch(`/api/candidate/profile?application_id=${applicationId}`);
      const result = await response.json();
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    fetch('/api/candidate/logout', { method: 'POST' })
      .then(() => setLocation('/candidate/login'))
      .catch(err => console.error('Logout failed:', err));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/candidate/application/download/${applicationId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `application_${applicationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download application:', error);
      alert('Failed to download application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <CandidateSidebar 
          candidate={candidate}
          profileImage={sidebarProfileImage}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data || !data.profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <CandidateSidebar 
          candidate={candidate}
          profileImage={sidebarProfileImage}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Application not found</div>
        </div>
      </div>
    );
  }

  const { profile, education, experience, documents } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar 
        candidate={candidate}
        profileImage={sidebarProfileImage}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Application Details</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Details</h1>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Download Application
                </Button>
                <Button
                  onClick={() => setLocation('/candidate/dashboard')}
                  className="bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#00A6CE] mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">First Name</p>
                  <p className="font-medium">{profile.first_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Name</p>
                  <p className="font-medium">{profile.last_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Father's/Husband's Name</p>
                  <p className="font-medium">{profile.father_husband_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Of Birth</p>
                  <p className="font-medium">{profile.date_of_birth || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium">{profile.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nationality</p>
                  <p className="font-medium">{profile.country || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium">{profile.email_address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{profile.mobile_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passport Number</p>
                  <p className="font-medium">{profile.passport_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Marital Status</p>
                  <p className="font-medium">{profile.marital_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Religion</p>
                  <p className="font-medium">{profile.religion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Place of Birth</p>
                  <p className="font-medium">{profile.place_of_birth || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Province</p>
                  <p className="font-medium">{profile.province || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CNIC</p>
                  <p className="font-medium">{profile.cnic || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CNIC Issue Date</p>
                  <p className="font-medium">{profile.cnic_issue_date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CNIC Expiry Date</p>
                  <p className="font-medium">{profile.cnic_expire_date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passport Issue Date</p>
                  <p className="font-medium">{profile.passport_issue_date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passport Expiry Date</p>
                  <p className="font-medium">{profile.passport_expire_date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Office Tel No</p>
                  <p className="font-medium">{profile.tel_off_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Residence Tel No</p>
                  <p className="font-medium">{profile.tel_res_no || 'N/A'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-600">Present Address</p>
                  <p className="font-medium">{profile.present_address ? `${profile.present_address}, ${profile.present_street || ''}, ${profile.present_postal_code || ''}`.trim() : 'N/A'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-600">Permanent Address</p>
                  <p className="font-medium">{profile.permanent_address ? `${profile.permanent_address}, ${profile.permanent_street || ''}, ${profile.permanent_postal_code || ''}`.trim() : 'N/A'}</p>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#00A6CE] mb-4">Professional Details</h2>
              {experience && experience.length > 0 ? (
                <div className="mb-6 space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Job Title</p>
                        <p className="font-medium">{exp.job_title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Employer / Hospital</p>
                        <p className="font-medium">{exp.employer_hospital || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Specialization</p>
                        <p className="font-medium">{exp.specialization || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Years Of Experience</p>
                        <p className="font-medium">{exp.total_experience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">From Date</p>
                        <p className="font-medium">{exp.from_date || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">To Date</p>
                        <p className="font-medium">{exp.to_date || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-6">No experience records found</p>
              )}

              <h2 className="text-lg sm:text-xl font-bold text-[#00A6CE] mb-4">Education & Certifications</h2>
              {education && education.length > 0 ? (
                <div className="mb-6 space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Degree/Diploma Title</p>
                        <p className="font-medium">{edu.degree_diploma_title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">University/Institute Name</p>
                        <p className="font-medium">{edu.university_institute_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Graduation Year</p>
                        <p className="font-medium">{edu.graduation_year || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">License/Registration Number</p>
                        <p className="font-medium">{edu.registration_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Program Duration</p>
                        <p className="font-medium">{edu.program_duration || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Marks/Percentage</p>
                        <p className="font-medium">{edu.marks_percentage || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-6">No education records found</p>
              )}

              <h2 className="text-lg sm:text-xl font-bold text-[#00A6CE] mb-4">Trade Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Availability To Join</p>
                  <p className="font-medium">{profile.availability_to_join || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Willingness To Relocate</p>
                  <p className="font-medium">{profile.willingness_to_relocate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trade Applied For</p>
                  <p className="font-medium">{profile.trade_applied_for || 'N/A'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-600">Country Preferences</p>
                  <p className="font-medium">
                    {profile.countries_preference ? (() => {
                      try {
                        const countries = JSON.parse(profile.countries_preference);
                        return Array.isArray(countries) && countries.length > 0 ? countries.join(', ') : 'N/A';
                      } catch (e) {
                        return 'N/A';
                      }
                    })() : 'N/A'}
                  </p>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-600">Trade/Specialization Preferences</p>
                  <p className="font-medium">
                    {profile.trades_preference ? (() => {
                      try {
                        const trades = JSON.parse(profile.trades_preference);
                        return Array.isArray(trades) && trades.length > 0 ? trades.join(', ') : 'N/A';
                      } catch (e) {
                        return 'N/A';
                      }
                    })() : 'N/A'}
                  </p>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#00A6CE] mb-4">Document Uploads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Updated CV/Resume (PDF)', key: 'cv_resume_url' },
                  { label: 'Passport', key: 'passport_url' },
                  { label: 'Degree/Diploma Certificates', key: 'degree_certificates_url' },
                  { label: 'Professional License / Registration Certificate', key: 'license_certificate_url' },
                  { label: 'IELTS/OET Certificate (If Applicable)', key: 'ielts_oet_certificate_url' },
                  { label: 'Experience Letters (From Previous Employers)', key: 'experience_letters_url' },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{doc.label}</span>
                    {documents && documents[doc.key] ? (
                      <div className="flex gap-2">
                        <a 
                          href={documents[doc.key]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                        <a 
                          href={documents[doc.key]} 
                          download
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Not uploaded</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
