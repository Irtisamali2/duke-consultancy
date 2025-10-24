import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import { countries, tradeOptions } from '../../utils/countries';

export default function CandidateProfileFormPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [tradeData, setTradeData] = useState({
    trade_applied_for: '',
    availability_to_join: '',
    willingness_to_relocate: ''
  });
  
  const [personalData, setPersonalData] = useState({
    first_name: '', last_name: '', father_husband_name: '', marital_status: '',
    gender: '', religion: '', date_of_birth: '', place_of_birth: '',
    province: '', country: '', cnic: '', cnic_issue_date: '', cnic_expiry_date: '',
    passport_number: '', passport_issue_date: '', passport_expiry_date: '',
    email_address: '', tel_off_no: '', tel_res_no: '', mobile_no: '',
    present_address: '', present_street: '', present_postal_code: '',
    permanent_address: '', permanent_street: '', permanent_postal_code: ''
  });
  
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    job_title: '', employer_hospital: '', specialization: '',
    from_date: '', to_date: '', total_experience: ''
  });
  
  const [educations, setEducations] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree_diploma_title: '', university_institute_name: '', graduation_year: '',
    program_duration: '', registration_number: '', marks_percentage: ''
  });
  
  const [documents, setDocuments] = useState({
    cv_resume_url: '', passport_url: '', degree_certificates_url: '',
    license_certificate_url: '', ielts_oet_certificate_url: '', experience_letters_url: ''
  });

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
      if (data.success) {
        if (data.profile) {
          setTradeData({
            trade_applied_for: data.profile.trade_applied_for || '',
            availability_to_join: data.profile.availability_to_join || '',
            willingness_to_relocate: data.profile.willingness_to_relocate || ''
          });
          setPersonalData({ ...personalData, ...data.profile });
        }
        if (data.experience) setExperiences(data.experience);
        if (data.education) setEducations(data.education);
        if (data.documents) setDocuments({ ...documents, ...data.documents });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleTradeSubmit = async () => {
    try {
      const response = await fetch('/api/candidate/profile/trade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      });
      if (response.ok) setCurrentStep(2);
    } catch (error) {
      console.error('Failed to save trade info:', error);
    }
  };

  const handlePersonalSubmit = async () => {
    try {
      const response = await fetch('/api/candidate/profile/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalData)
      });
      if (response.ok) setCurrentStep(3);
    } catch (error) {
      console.error('Failed to save personal info:', error);
    }
  };

  const addExperience = async () => {
    try {
      const response = await fetch('/api/candidate/profile/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExperience)
      });
      if (response.ok) {
        await fetchProfile();
        setNewExperience({ job_title: '', employer_hospital: '', specialization: '', from_date: '', to_date: '', total_experience: '' });
      }
    } catch (error) {
      console.error('Failed to add experience:', error);
    }
  };

  const addEducation = async () => {
    try {
      const response = await fetch('/api/candidate/profile/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEducation)
      });
      if (response.ok) {
        await fetchProfile();
        setNewEducation({ degree_diploma_title: '', university_institute_name: '', graduation_year: '', program_duration: '', registration_number: '', marks_percentage: '' });
      }
    } catch (error) {
      console.error('Failed to add education:', error);
    }
  };

  const handleDocumentsSubmit = async () => {
    try {
      await fetch('/api/candidate/profile/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documents)
      });
      
      await fetch('/api/candidate/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      setLocation('/candidate/dashboard');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const steps = [
    { number: 1, label: 'Trade Information' },
    { number: 2, label: 'Personal Information' },
    { number: 3, label: 'Professional Details' },
    { number: 4, label: 'Education & Certifications' },
    { number: 5, label: 'Document Uploads' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 bg-white min-h-screen border-r border-gray-200 p-6">
          <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10 mb-8" />
          <div className="flex items-center gap-3 mb-8 p-3 bg-[#E6F7FB] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium">{candidate?.firstName?.[0]}{candidate?.lastName?.[0]}</span>
            </div>
            <span className="font-medium text-sm">{candidate?.firstName} {candidate?.lastName}</span>
          </div>
          
          <nav>
            <button onClick={() => setLocation('/candidate/dashboard')} className="w-full text-left px-4 py-3 mb-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Dashboard
            </button>
            <button className="w-full text-left px-4 py-3 mb-2 bg-[#E6F7FB] text-[#00A6CE] rounded-lg font-medium">
              My Profile
            </button>
            <button onClick={async () => { await fetch('/api/candidate/logout', { method: 'POST' }); setLocation('/'); }} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              Logout
            </button>
          </nav>
        </div>

        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className={`flex items-center gap-2 ${currentStep === step.number ? 'text-[#00A6CE] font-medium' : currentStep > step.number ? 'text-[#00A6CE]' : 'text-gray-400'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === step.number ? 'bg-[#00A6CE] text-white' : currentStep > step.number ? 'bg-[#00A6CE] text-white' : 'bg-gray-200'}`}>
                      {step.number}
                    </span>
                    <span className="text-sm whitespace-nowrap">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-[#00A6CE]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Trade Information</h2>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trade Applied For *</label>
                    <select
                      value={tradeData.trade_applied_for}
                      onChange={(e) => setTradeData({ ...tradeData, trade_applied_for: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      required
                    >
                      <option value="">Select Trade</option>
                      {tradeOptions.map(trade => (
                        <option key={trade} value={trade}>{trade}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Availability To Join *</label>
                      <select
                        value={tradeData.availability_to_join}
                        onChange={(e) => setTradeData({ ...tradeData, availability_to_join: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Immediately">Immediately</option>
                        <option value="Within 1 month">Within 1 month</option>
                        <option value="Within 3 months">Within 3 months</option>
                        <option value="Within 6 months">Within 6 months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Willingness To Relocate (Yes/No) *</label>
                      <select
                        value={tradeData.willingness_to_relocate}
                        onChange={(e) => setTradeData({ ...tradeData, willingness_to_relocate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">First Name *</label><input type="text" value={personalData.first_name} onChange={(e) => setPersonalData({ ...personalData, first_name: e.target.value })} pattern="[a-zA-Z\s]+" title="Only letters allowed" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                  <div><label className="block text-sm font-medium mb-2">Last Name *</label><input type="text" value={personalData.last_name} onChange={(e) => setPersonalData({ ...personalData, last_name: e.target.value })} pattern="[a-zA-Z\s]+" title="Only letters allowed" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                  <div><label className="block text-sm font-medium mb-2">Father's/Husband's Name *</label><input type="text" value={personalData.father_husband_name} onChange={(e) => setPersonalData({ ...personalData, father_husband_name: e.target.value })} pattern="[a-zA-Z\s]+" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                  <div><label className="block text-sm font-medium mb-2">Marital Status *</label><select value={personalData.marital_status} onChange={(e) => setPersonalData({ ...personalData, marital_status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required><option value="">Select</option><option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option></select></div>
                  <div><label className="block text-sm font-medium mb-2">Gender *</label><select value={personalData.gender} onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                  <div><label className="block text-sm font-medium mb-2">Religion</label><select value={personalData.religion} onChange={(e) => setPersonalData({ ...personalData, religion: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"><option value="">Select</option><option value="Islam">Islam</option><option value="Christianity">Christianity</option><option value="Hinduism">Hinduism</option><option value="Buddhism">Buddhism</option><option value="Other">Other</option></select></div>
                  <div><label className="block text-sm font-medium mb-2">Date Of Birth *</label><input type="date" value={personalData.date_of_birth} onChange={(e) => setPersonalData({ ...personalData, date_of_birth: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                  <div><label className="block text-sm font-medium mb-2">Place Of Birth</label><input type="text" value={personalData.place_of_birth} onChange={(e) => setPersonalData({ ...personalData, place_of_birth: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Province</label><input type="text" value={personalData.province} onChange={(e) => setPersonalData({ ...personalData, province: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Country *</label><select value={personalData.country} onChange={(e) => setPersonalData({ ...personalData, country: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required><option value="">Select Country</option>{countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-2">CNIC</label><input type="text" value={personalData.cnic} onChange={(e) => setPersonalData({ ...personalData, cnic: e.target.value })} placeholder="12345-1234567-1" pattern="\d{5}-\d{7}-\d{1}" title="Format: 12345-1234567-1" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Passport Number *</label><input type="text" value={personalData.passport_number} onChange={(e) => setPersonalData({ ...personalData, passport_number: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                  <div><label className="block text-sm font-medium mb-2">Mobile No *</label><input type="tel" value={personalData.mobile_no} onChange={(e) => setPersonalData({ ...personalData, mobile_no: e.target.value })} placeholder="+92 300 1234567" pattern="\+\d{1,4}\d{6,14}" title="Include country code" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                  <div><label className="block text-sm font-medium mb-2">Email Address *</label><input type="email" value={personalData.email_address} onChange={(e) => setPersonalData({ ...personalData, email_address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" required /></div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Professional Details</h2>
                {experiences.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border">
                      <thead className="bg-[#E8F4F8]">
                        <tr>
                          <th className="p-2 text-left text-xs">Job Title</th>
                          <th className="p-2 text-left text-xs">Employer / Hospital Name</th>
                          <th className="p-2 text-left text-xs">Specialization</th>
                          <th className="p-2 text-left text-xs">From</th>
                          <th className="p-2 text-left text-xs">To</th>
                          <th className="p-2 text-left text-xs">Total Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiences.map(exp => (
                          <tr key={exp.id}><td className="p-2 text-sm">{exp.job_title}</td><td className="p-2 text-sm">{exp.employer_hospital}</td><td className="p-2 text-sm">{exp.specialization}</td><td className="p-2 text-sm">{exp.from_date}</td><td className="p-2 text-sm">{exp.to_date}</td><td className="p-2 text-sm">{exp.total_experience}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium mb-2">Job Title</label><input type="text" placeholder="Current Job Title" value={newExperience.job_title} onChange={(e) => setNewExperience({ ...newExperience, job_title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Employer / Hospital</label><input type="text" placeholder="Current Employer / Hospital" value={newExperience.employer_hospital} onChange={(e) => setNewExperience({ ...newExperience, employer_hospital: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Specialization</label><input type="text" placeholder="ICU Nurse" value={newExperience.specialization} onChange={(e) => setNewExperience({ ...newExperience, specialization: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Total Years Of Experience</label><input type="text" placeholder="X Years" value={newExperience.total_experience} onChange={(e) => setNewExperience({ ...newExperience, total_experience: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                </div>
                <div className="flex justify-end mb-4"><Button onClick={addExperience} className="bg-[#00A6CE] hover:bg-[#0090B5] text-white">Add Experience</Button></div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Education & Certifications</h2>
                {educations.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border">
                      <thead className="bg-[#E8F4F8]">
                        <tr>
                          <th className="p-2 text-left text-xs">Degree/Diploma Title</th>
                          <th className="p-2 text-left text-xs">University/Institute Name</th>
                          <th className="p-2 text-left text-xs">Graduation Year</th>
                          <th className="p-2 text-left text-xs">Program Duration</th>
                          <th className="p-2 text-left text-xs">Registration Number</th>
                          <th className="p-2 text-left text-xs">Marks/Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {educations.map(edu => (
                          <tr key={edu.id}><td className="p-2 text-sm">{edu.degree_diploma_title}</td><td className="p-2 text-sm">{edu.university_institute_name}</td><td className="p-2 text-sm">{edu.graduation_year}</td><td className="p-2 text-sm">{edu.program_duration}</td><td className="p-2 text-sm">{edu.registration_number}</td><td className="p-2 text-sm">{edu.marks_percentage}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium mb-2">Degree/Diploma Title</label><input type="text" placeholder="BSc Nursing" value={newEducation.degree_diploma_title} onChange={(e) => setNewEducation({ ...newEducation, degree_diploma_title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">University/Institute Name</label><input type="text" placeholder="University/Institute Name" value={newEducation.university_institute_name} onChange={(e) => setNewEducation({ ...newEducation, university_institute_name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Graduation Year</label><input type="text" placeholder="Graduation Year" value={newEducation.graduation_year} onChange={(e) => setNewEducation({ ...newEducation, graduation_year: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Program Duration</label><input type="text" placeholder="4 Years" value={newEducation.program_duration} onChange={(e) => setNewEducation({ ...newEducation, program_duration: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">License/Registration Number</label><input type="text" placeholder="LXXXXXXXXX" value={newEducation.registration_number} onChange={(e) => setNewEducation({ ...newEducation, registration_number: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Marks/Percentage</label><input type="text" placeholder="70%" value={newEducation.marks_percentage} onChange={(e) => setNewEducation({ ...newEducation, marks_percentage: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                </div>
                <div className="flex justify-end mb-4"><Button onClick={addEducation} className="bg-[#00A6CE] hover:bg-[#0090B5] text-white">Add Education</Button></div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Document Uploads (file attachments)</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium mb-2">Updated CV/Resume (PDF)</label><input type="text" placeholder="Document URL" value={documents.cv_resume_url} onChange={(e) => setDocuments({ ...documents, cv_resume_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Passport</label><input type="text" placeholder="Document URL" value={documents.passport_url} onChange={(e) => setDocuments({ ...documents, passport_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Degree/Diploma Certificates</label><input type="text" placeholder="Document URL" value={documents.degree_certificates_url} onChange={(e) => setDocuments({ ...documents, degree_certificates_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Professional License / Registration Certificate</label><input type="text" placeholder="Document URL" value={documents.license_certificate_url} onChange={(e) => setDocuments({ ...documents, license_certificate_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">IELTS/OET Certificate (If Applicable)</label><input type="text" placeholder="Document URL" value={documents.ielts_oet_certificate_url} onChange={(e) => setDocuments({ ...documents, ielts_oet_certificate_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                  <div><label className="block text-sm font-medium mb-2">Experience Letters (From Previous Employers)</label><input type="text" placeholder="Document URL" value={documents.experience_letters_url} onChange={(e) => setDocuments({ ...documents, experience_letters_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]" /></div>
                </div>
                <div className="mt-6">
                  <label className="flex items-center gap-2 mb-2"><input type="checkbox" className="w-4 h-4" /><span className="text-sm">I Confirm That The Information Provided Is Accurate And All Documents Uploaded Are Authentic.</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span className="text-sm">I Agree To The Terms & Conditions Of Duke Consultancy.</span></label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setLocation('/candidate/dashboard')}
                className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
              >
                Back To Dashboard
              </Button>
              <div className="flex gap-4">
                <Button className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8">
                  Save & Close
                </Button>
                <Button
                  onClick={() => {
                    if (currentStep === 1) handleTradeSubmit();
                    else if (currentStep === 2) handlePersonalSubmit();
                    else if (currentStep === 3) setCurrentStep(4);
                    else if (currentStep === 4) setCurrentStep(5);
                    else if (currentStep === 5) handleDocumentsSubmit();
                  }}
                  className="bg-[#0B7A9F] hover:bg-[#096685] text-white rounded-full px-8"
                >
                  {currentStep === 5 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
