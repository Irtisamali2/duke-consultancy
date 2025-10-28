import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function HealthcareProfileViewPage() {
  const [, params] = useRoute('/admin/healthcare-profiles/view/:id');
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profile, setProfile] = useState({
    candidate: {},
    profile: {},
    education: [],
    experience: [],
    documents: {}
  });

  useEffect(() => {
    if (params?.id) {
      fetchProfile();
    }
  }, [params?.id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/healthcare-profiles/${params.id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to load profile' });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleCandidateChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      candidate: {
        ...prev.candidate,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/healthcare-profiles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: profile.candidate.email,
          status: profile.candidate.status,
          first_name: profile.profile.first_name,
          last_name: profile.profile.last_name,
          mobile_no: profile.profile.mobile_no
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setLocation('/admin/healthcare-profiles'), 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">View Healthcare Profile</h1>
              <p className="text-gray-600">View candidate profile information</p>
            </div>
            <Button
              onClick={() => setLocation('/admin/healthcare-profiles')}
              variant="outline"
            >
              Back to Profiles
            </Button>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Image */}
          {profile.profile.profile_image_url && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img 
                    src={profile.profile.profile_image_url} 
                    alt={`${profile.profile.first_name} ${profile.profile.last_name}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#00A6CE]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.candidate.email || ''}
                    onChange={(e) => handleCandidateChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={profile.candidate.status || 'pending'}
                    onChange={(e) => handleCandidateChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Date
                  </label>
                  <input
                    type="text"
                    value={profile.candidate.created_at ? new Date(profile.candidate.created_at).toLocaleDateString() : 'N/A'}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.profile.first_name || ''}
                    onChange={(e) => handleProfileChange('first_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.profile.last_name || ''}
                    onChange={(e) => handleProfileChange('last_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={profile.profile.mobile_no || ''}
                    onChange={(e) => handleProfileChange('mobile_no', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Records */}
          {profile.education && profile.education.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Education Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{edu.degree_diploma_title}</h4>
                      <p className="text-sm text-gray-600">{edu.university_institute_name}</p>
                      <p className="text-sm text-gray-600">Graduation Year: {edu.graduation_year}</p>
                      {edu.registration_number && (
                        <p className="text-sm text-gray-600">Registration: {edu.registration_number}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{exp.job_title}</h4>
                      <p className="text-sm text-gray-600">{exp.employer_hospital}</p>
                      {exp.specialization && (
                        <p className="text-sm text-gray-600">Specialization: {exp.specialization}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {exp.from_date} - {exp.to_date} ({exp.total_experience})
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {profile.documents && Object.keys(profile.documents).length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.documents.cv_resume_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CV/Resume</label>
                      <a
                        href={profile.documents.cv_resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00A6CE] hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {profile.documents.passport_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport</label>
                      <a
                        href={profile.documents.passport_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00A6CE] hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {profile.documents.degree_certificates_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree Certificates</label>
                      <a
                        href={profile.documents.degree_certificates_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00A6CE] hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {profile.documents.license_certificate_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Certificate</label>
                      <a
                        href={profile.documents.license_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00A6CE] hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {profile.documents.ielts_oet_certificate_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">IELTS/OET Certificate</label>
                      <a
                        href={profile.documents.ielts_oet_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00A6CE] hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {profile.documents.experience_letters_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience Letters</label>
                      <a
                        href={profile.documents.experience_letters_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00A6CE] hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              onClick={() => setLocation('/admin/healthcare-profiles')}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
