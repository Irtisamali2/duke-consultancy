import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/AdminLayout';

export default function HealthcareProfileDetailsPage() {
  const [, params] = useRoute('/admin/profiles/:id');
  const [, setLocation] = useLocation();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (params?.id) {
      fetchProfileDetails();
    }
  }, [params?.id]);

  const fetchProfileDetails = async () => {
    try {
      const response = await fetch(`/api/healthcare-profiles/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  if (!data) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="text-center">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const { candidate, profile, education, experience, documents } = data;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Profile Details</h1>
          <Button
            onClick={() => setLocation('/admin/profiles')}
            className="bg-gray-400 hover:bg-gray-500 text-white"
          >
            Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A'}
              </h2>
              <p className="text-gray-600">{candidate.email}</p>
              <p className="text-gray-600">{profile.mobile_no}</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                candidate.status === 'verified' ? 'bg-green-100 text-green-800' :
                candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {candidate.status}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#00A6CE] mb-4">Personal Information</h3>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">{profile.date_of_birth || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium">{profile.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Religion</p>
              <p className="font-medium">{profile.religion || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Passport Number</p>
              <p className="font-medium">{profile.passport_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CNIC</p>
              <p className="font-medium">{profile.cnic || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Country</p>
              <p className="font-medium">{profile.country || 'N/A'}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#00A6CE] mb-4">Professional Details</h3>
          {experience && experience.length > 0 ? (
            <div className="mb-8">
              {experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Job Title</p>
                    <p className="font-medium">{exp.job_title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employer/Hospital</p>
                    <p className="font-medium">{exp.employer_hospital || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium">{exp.specialization || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Experience</p>
                    <p className="font-medium">{exp.total_experience || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-8">No experience records found</p>
          )}

          <h3 className="text-lg font-bold text-[#00A6CE] mb-4">Education & Certifications</h3>
          {education && education.length > 0 ? (
            <div className="mb-8">
              {education.map((edu, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Degree</p>
                    <p className="font-medium">{edu.degree_diploma_title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">University</p>
                    <p className="font-medium">{edu.university_institute_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{edu.graduation_year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="font-medium">{edu.registration_number || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-8">No education records found</p>
          )}

          <h3 className="text-lg font-bold text-[#00A6CE] mb-4">Documents</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'CV/Resume', key: 'cv_resume_url' },
              { label: 'Passport', key: 'passport_url' },
              { label: 'Degree Certificates', key: 'degree_certificates_url' },
              { label: 'License Certificate', key: 'license_certificate_url' },
              { label: 'IELTS/OET Certificate', key: 'ielts_oet_certificate_url' },
              { label: 'Experience Letters', key: 'experience_letters_url' },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{doc.label}</span>
                {documents[doc.key] ? (
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Download</button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Not uploaded</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
