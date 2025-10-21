import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/AdminLayout';

export default function ApplicationDetailsPage() {
  const [, params] = useRoute('/admin/applications/:id');
  const [, setLocation] = useLocation();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('pending');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (params?.id) {
      fetchApplicationDetails();
    }
  }, [params?.id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await fetch(`/api/applications/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setData(result);
        setStatus(result.application.status);
        setRemarks(result.application.remarks || '');
      }
    } catch (error) {
      console.error('Failed to fetch application:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks })
      });

      const result = await response.json();
      if (result.success) {
        alert('Application updated successfully');
      }
    } catch (error) {
      console.error('Failed to update application:', error);
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

  const { profile, education, experience, documents } = data;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <Button
            onClick={() => setLocation('/admin/applications')}
            className="bg-gray-400 hover:bg-gray-500 text-white"
          >
            Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#00A6CE] mb-4">Personal Information</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
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
          </div>

          <h2 className="text-xl font-bold text-[#00A6CE] mb-4">Professional Details</h2>
          {experience && experience.length > 0 ? (
            <div className="mb-6">
              {experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Current Job Title</p>
                    <p className="font-medium">{exp.job_title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Employer / Hospital</p>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No experience records found</p>
          )}

          <h2 className="text-xl font-bold text-[#00A6CE] mb-4">Education & Certifications</h2>
          {education && education.length > 0 ? (
            <div className="mb-6">
              {education.map((edu, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No education records found</p>
          )}

          <h2 className="text-xl font-bold text-[#00A6CE] mb-4">Additional Information</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Availability To Join</p>
              <p className="font-medium">{profile.availability_to_join || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Willingness To Relocate (Yes/No)</p>
              <p className="font-medium">{profile.willingness_to_relocate || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Preferred Job Type</p>
              <p className="font-medium">{profile.trade_applied_for || 'N/A'}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#00A6CE] mb-4">Document Uploads (file attachments)</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Updated CV/Resume (PDF)', key: 'cv_resume_url' },
              { label: 'Passport', key: 'passport_url' },
              { label: 'Degree/Diploma Certificates', key: 'degree_certificates_url' },
              { label: 'IELTS/OET Certificate (If Applicable)', key: 'ielts_oet_certificate_url' },
              { label: 'Experience Letters (From Previous Employers)', key: 'experience_letters_url' },
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              placeholder="Add remarks here..."
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <Button
              onClick={handleUpdate}
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
