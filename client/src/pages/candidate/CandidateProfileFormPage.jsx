import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import { countries, tradeOptions } from '../../utils/countries';
import CandidateSidebar from '../../components/CandidateSidebar';

export default function CandidateProfileFormPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableTrades, setAvailableTrades] = useState([]);
  
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdFromUrl = urlParams.get('job_id');
  
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [tradeData, setTradeData] = useState({
    trade_applied_for: '',
    availability_to_join: '',
    willingness_to_relocate: '',
    countries_preference: [],
    trades_preference: []
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

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchJobs();
    if (jobIdFromUrl) {
      setSelectedJobId(jobIdFromUrl);
    }
  }, []);
  
  useEffect(() => {
    if (selectedJobId) {
      fetchJobDetails();
    } else {
      setAvailableCountries(countries.map(c => c.name));
      setAvailableTrades(tradeOptions);
      setSelectedJob(null);
    }
  }, [selectedJobId]);
  
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
  
  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/public/${selectedJobId}`);
      const data = await response.json();
      if (data.success) {
        const job = data.job;
        const jobCountries = job.countries ? JSON.parse(job.countries) : [];
        const jobTrades = job.trades ? JSON.parse(job.trades) : [];
        
        setSelectedJob({
          ...job,
          countries: jobCountries,
          trades: jobTrades
        });
        setAvailableCountries(jobCountries);
        setAvailableTrades(jobTrades);
      }
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/candidate/verify');
      const data = await response.json();
      if (data.success) {
        setCandidate(data.candidate);
        setAccountData({
          firstName: data.candidate.firstName || '',
          lastName: data.candidate.lastName || '',
          email: data.candidate.email || '',
          phone: data.candidate.phone || ''
        });
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
          const countriesPref = data.profile.countries_preference ? JSON.parse(data.profile.countries_preference) : [];
          const tradesPref = data.profile.trades_preference ? JSON.parse(data.profile.trades_preference) : [];
          
          setTradeData({
            trade_applied_for: data.profile.trade_applied_for || '',
            availability_to_join: data.profile.availability_to_join || '',
            willingness_to_relocate: data.profile.willingness_to_relocate || '',
            countries_preference: countriesPref,
            trades_preference: tradesPref
          });
          setPersonalData({ ...personalData, ...data.profile });
          
          if (data.profile.profile_image_url) {
            setProfileImagePreview(data.profile.profile_image_url);
          }
        }
        if (data.experience) setExperiences(data.experience);
        if (data.education) setEducations(data.education);
        if (data.documents) setDocuments({ ...documents, ...data.documents });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleAccountSubmit = async () => {
    try {
      setMessage({ type: '', text: '' });
      const response = await fetch('/api/candidate/profile/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Account information updated successfully!' });
        setCandidate({ ...candidate, ...accountData });
        setTimeout(() => setCurrentStep(1), 1000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update account information' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating your account' });
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      setMessage({ type: '', text: '' });
      
      if (passwordData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return;
      }
      
      const response = await fetch('/api/candidate/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating your password' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', profileImage);

      const response = await fetch('/api/candidate/profile/image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Profile image uploaded successfully!' });
        setProfileImage(null);
        await fetchProfile();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while uploading your image' });
    }
  };

  const handleImageRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile image?')) return;

    try {
      const response = await fetch('/api/candidate/profile/image', {
        method: 'DELETE'
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Profile image removed successfully!' });
        setProfileImage(null);
        setProfileImagePreview(null);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to remove image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while removing your image' });
    }
  };

  const handleTradeSubmit = async () => {
    try {
      if (tradeData.countries_preference.length === 0) {
        alert('Please select at least one country preference');
        return;
      }
      
      if (tradeData.trades_preference.length === 0) {
        alert('Please select at least one trade');
        return;
      }
      
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
  
  const toggleCountryPreference = (countryName) => {
    const maxAllowed = selectedJob ? selectedJob.max_countries_selectable : 10;
    const current = tradeData.countries_preference;
    
    if (current.includes(countryName)) {
      setTradeData({ 
        ...tradeData, 
        countries_preference: current.filter(c => c !== countryName) 
      });
    } else if (current.length < maxAllowed) {
      setTradeData({ 
        ...tradeData, 
        countries_preference: [...current, countryName] 
      });
    } else {
      alert(`You can only select up to ${maxAllowed} ${maxAllowed === 1 ? 'country' : 'countries'} for this position`);
    }
  };
  
  const toggleTradePreference = (trade) => {
    const maxAllowed = selectedJob ? selectedJob.max_trades_selectable : 10;
    const current = tradeData.trades_preference;
    
    if (current.includes(trade)) {
      setTradeData({ 
        ...tradeData, 
        trades_preference: current.filter(t => t !== trade),
        trade_applied_for: current.filter(t => t !== trade)[0] || ''
      });
    } else if (current.length < maxAllowed) {
      const newTrades = [...current, trade];
      setTradeData({ 
        ...tradeData, 
        trades_preference: newTrades,
        trade_applied_for: newTrades[0]
      });
    } else {
      alert(`You can only select up to ${maxAllowed} ${maxAllowed === 1 ? 'trade' : 'trades'} for this position`);
    }
  };

  const handlePersonalSubmit = async () => {
    try {
      const response = await fetch('/api/candidate/profile/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentStep(3);
      } else {
        alert(data.message || 'Failed to save personal information');
      }
    } catch (error) {
      console.error('Failed to save personal info:', error);
      alert('An error occurred while saving your information');
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
      
      const appResponse = await fetch('/api/candidate/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: selectedJobId || null })
      });
      
      const appData = await appResponse.json();
      
      if (!appResponse.ok) {
        alert(appData.message || 'Failed to submit application');
        return;
      }
      
      alert('Application submitted successfully!');
      setLocation('/candidate/dashboard');
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('An error occurred while submitting your application. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const steps = [
    { number: 0, label: 'Account Settings' }
  ];

  const handleLogout = async () => {
    await fetch('/api/candidate/logout', { method: 'POST' });
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar 
        candidate={candidate}
        profileImage={profileImagePreview}
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

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {currentStep === 0 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        value={accountData.firstName}
                        onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={accountData.lastName}
                        onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={accountData.email}
                        onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={accountData.phone}
                        onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        required
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleAccountSubmit}
                      className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-6 py-2 rounded-lg"
                    >
                      Save Account Information
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Profile Image</h3>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {profileImagePreview ? (
                        <img 
                          src={profileImagePreview} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-[#00A6CE]"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                          <span className="text-3xl text-gray-400">
                            {candidate?.firstName?.[0]}{candidate?.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-3">Upload a professional photo. Image should be less than 5MB.</p>
                      <div className="flex gap-3">
                        <label className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-4 py-2 rounded-lg cursor-pointer">
                          Choose Image
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {profileImage && (
                          <button
                            onClick={handleImageUpload}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                          >
                            Upload
                          </button>
                        )}
                        {profileImagePreview && (
                          <button
                            onClick={handleImageRemove}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="grid gap-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password *</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        placeholder="••••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password *</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        placeholder="••••••••••"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password *</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                        placeholder="••••••••••"
                      />
                    </div>
                    <div>
                      <button
                        onClick={handlePasswordSubmit}
                        className="bg-[#0B7A9F] hover:bg-[#096685] text-white px-6 py-2 rounded-lg"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => setLocation('/candidate/dashboard')}
              className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
            >
              Back To Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
