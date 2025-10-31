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
  const [applicationId, setApplicationId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdFromUrl = urlParams.get('job_id');
  const applicationIdFromUrl = urlParams.get('application_id');
  
  // Utility function to convert date to MySQL format (YYYY-MM-DD)
  const formatDateForMySQL = (dateValue) => {
    // Handle empty, null, undefined, or whitespace-only values
    if (!dateValue || (typeof dateValue === 'string' && dateValue.trim() === '')) {
      return null;
    }
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
    
    // If it has time component, extract date part
    if (typeof dateValue === 'string' && dateValue.includes('T')) {
      return dateValue.split('T')[0];
    }
    
    // Try to parse and format
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0];
    } catch {
      return null;
    }
  };
  
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
    province: '', country: '', cnic: '', cnic_issue_date: '', cnic_expire_date: '',
    passport_number: '', passport_issue_date: '', passport_expire_date: '',
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
    license_certificate_url: '', ielts_oet_certificate_url: '', experience_letters_url: '', additional_files: []
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [sidebarProfileImage, setSidebarProfileImage] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    checkAuth();
    fetchApplications();
    fetchSidebarProfile();
    if (jobIdFromUrl) {
      setSelectedJobId(jobIdFromUrl);
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
    if (applicationIdFromUrl) {
      setApplicationId(parseInt(applicationIdFromUrl));
    }
  }, []);
  
  useEffect(() => {
    if (applications.length >= 0) {
      fetchJobs();
    }
  }, [applications]);
  
  useEffect(() => {
    if (selectedJobId) {
      fetchJobDetails();
    } else {
      setAvailableCountries(countries.map(c => c.name));
      setAvailableTrades(tradeOptions);
      setSelectedJob(null);
    }
  }, [selectedJobId]);
  
  // Fetch profile when candidate is authenticated or applicationId changes
  useEffect(() => {
    if (candidate) {
      fetchProfile();
    }
  }, [candidate, applicationId]);
  
  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/candidate/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs/public');
      const data = await response.json();
      if (data.success) {
        // Get all job IDs that have applications (both draft and non-draft)
        const appliedJobIds = applications.map(app => app.job_id);
        
        // Filter out ALL jobs with any application
        let availableJobs = data.jobs.filter(job => !appliedJobIds.includes(job.id));
        
        // If editing a draft, add ONLY that specific job to the available list
        if (jobIdFromUrl) {
          const editingJobId = parseInt(jobIdFromUrl);
          // Check if the job being edited is not already in available jobs
          if (!availableJobs.find(j => j.id === editingJobId)) {
            const draftJob = data.jobs.find(j => j.id === editingJobId);
            if (draftJob) {
              // Add the draft's job at the beginning
              availableJobs = [draftJob, ...availableJobs];
            }
          }
        }
        
        setJobs(availableJobs);
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
        
        setTradeData(prev => ({
          ...prev,
          countries_preference: prev.countries_preference.filter(c => jobCountries.includes(c)),
          trades_preference: prev.trades_preference.filter(t => jobTrades.includes(t))
        }));
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
        // fetchProfile is now called in useEffect when applicationId is set
      } else {
        setLocation('/candidate/login');
      }
    } catch (error) {
      setLocation('/candidate/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarProfile = async () => {
    try {
      const response = await fetch('/api/candidate/profile/basic');
      const data = await response.json();
      if (data.success && data.profile) {
        setSidebarProfileImage(data.profile.profile_image_url || null);
      }
    } catch (error) {
      console.error('Failed to fetch sidebar profile:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      if (applicationId) {
        // Editing existing application - fetch ALL data for this specific application
        const url = `/api/candidate/profile?application_id=${applicationId}`;
        const response = await fetch(url);
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
            
            // Set personal data from fetched profile - use fresh object to avoid stale data
            setPersonalData({
              first_name: data.profile.first_name || '',
              last_name: data.profile.last_name || '',
              father_husband_name: data.profile.father_husband_name || '',
              marital_status: data.profile.marital_status || '',
              gender: data.profile.gender || '',
              religion: data.profile.religion || '',
              date_of_birth: data.profile.date_of_birth || '',
              place_of_birth: data.profile.place_of_birth || '',
              province: data.profile.province || '',
              country: data.profile.country || '',
              cnic: data.profile.cnic || '',
              cnic_issue_date: data.profile.cnic_issue_date || '',
              cnic_expire_date: data.profile.cnic_expire_date || '',
              passport_number: data.profile.passport_number || '',
              passport_issue_date: data.profile.passport_issue_date || '',
              passport_expire_date: data.profile.passport_expire_date || '',
              email_address: data.profile.email_address || '',
              tel_off_no: data.profile.tel_off_no || '',
              tel_res_no: data.profile.tel_res_no || '',
              mobile_no: data.profile.mobile_no || '',
              present_address: data.profile.present_address || '',
              present_street: data.profile.present_street || '',
              present_postal_code: data.profile.present_postal_code || '',
              permanent_address: data.profile.permanent_address || '',
              permanent_street: data.profile.permanent_street || '',
              permanent_postal_code: data.profile.permanent_postal_code || ''
            });
            
            if (data.profile.profile_image_url) {
              setProfileImagePreview(data.profile.profile_image_url);
            }
          }
          if (data.experience) setExperiences(data.experience);
          if (data.education) setEducations(data.education);
          if (data.documents) {
            // Use fresh object to avoid stale data from previous drafts
            setDocuments({
              cv_resume_url: data.documents.cv_resume_url || '',
              passport_url: data.documents.passport_url || '',
              degree_certificates_url: data.documents.degree_certificates_url || '',
              license_certificate_url: data.documents.license_certificate_url || '',
              ielts_oet_certificate_url: data.documents.ielts_oet_certificate_url || '',
              experience_letters_url: data.documents.experience_letters_url || '',
              additional_files: data.documents.additional_files || []
            });
          }
        }
      } else if (jobIdFromUrl) {
        // New application with job_id - clear ALL form data and only pre-fill basic profile info
        // ALWAYS clear all sections first to avoid stale data from previous drafts
        setTradeData({
          trade_applied_for: '',
          availability_to_join: '',
          willingness_to_relocate: '',
          countries_preference: [],
          trades_preference: []
        });
        setExperiences([]);
        setEducations([]);
        setDocuments({
          cv_resume_url: '', 
          passport_url: '', 
          degree_certificates_url: '',
          license_certificate_url: '', 
          ielts_oet_certificate_url: '', 
          experience_letters_url: '', 
          additional_files: []
        });
        setUploadProgress({});
        
        // Reset draft editor states to ensure no residual data
        setNewExperience({
          job_title: '', 
          employer_hospital: '', 
          specialization: '',
          from_date: '', 
          to_date: '', 
          total_experience: ''
        });
        setNewEducation({
          degree_diploma_title: '', 
          university_institute_name: '', 
          graduation_year: '',
          program_duration: '', 
          registration_number: '', 
          marks_percentage: ''
        });
        setProfileImage(null);
        setProfileImagePreview(null);
        
        // Fetch and set only basic profile info (name, email, profile image)
        const response = await fetch('/api/candidate/profile/basic');
        const data = await response.json();
        if (data.success && data.profile) {
          // Reset ALL personal data and only set basic info
          setPersonalData({
            first_name: data.profile.first_name || '',
            last_name: data.profile.last_name || '',
            father_husband_name: '',
            marital_status: '',
            gender: '',
            religion: '',
            date_of_birth: '',
            place_of_birth: '',
            province: '',
            country: '',
            cnic: '',
            cnic_issue_date: '',
            cnic_expire_date: '',
            passport_number: '',
            passport_issue_date: '',
            passport_expire_date: '',
            email_address: data.profile.email_address || '',
            tel_off_no: '',
            tel_res_no: '',
            mobile_no: '',
            present_address: '',
            present_street: '',
            present_postal_code: '',
            permanent_address: '',
            permanent_street: '',
            permanent_postal_code: ''
          });
          
          if (data.profile.profile_image_url) {
            setProfileImagePreview(data.profile.profile_image_url);
          }
        } else {
          // If fetch fails, still clear personal data
          setPersonalData({
            first_name: '',
            last_name: '',
            father_husband_name: '',
            marital_status: '',
            gender: '',
            religion: '',
            date_of_birth: '',
            place_of_birth: '',
            province: '',
            country: '',
            cnic: '',
            cnic_issue_date: '',
            cnic_expire_date: '',
            passport_number: '',
            passport_issue_date: '',
            passport_expire_date: '',
            email_address: '',
            tel_off_no: '',
            tel_res_no: '',
            mobile_no: '',
            present_address: '',
            present_street: '',
            present_postal_code: '',
            permanent_address: '',
            permanent_street: '',
            permanent_postal_code: ''
          });
          setProfileImagePreview(null);
        }
      } else {
        // Profile settings view (no job_id, no application_id) - fetch and display current profile image
        const response = await fetch('/api/candidate/profile/basic');
        const data = await response.json();
        if (data.success && data.profile) {
          if (data.profile.profile_image_url) {
            setProfileImagePreview(data.profile.profile_image_url);
          }
        }
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
      if (applicationId) {
        formData.append('application_id', applicationId);
      }

      const response = await fetch('/api/candidate/profile/image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Profile image uploaded successfully!' });
        setProfileImage(null);
        setProfileImagePreview(data.imageUrl);
        
        // If uploading to My Profile (no application_id), update sidebar image
        if (!applicationId) {
          setSidebarProfileImage(data.imageUrl);
        }
        
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
      if (!selectedJobId) {
        setMessage({ type: 'error', text: 'Please select a job position' });
        return;
      }
      
      const validCountries = tradeData.countries_preference.filter(c => availableCountries.includes(c));
      const validTrades = tradeData.trades_preference.filter(t => availableTrades.includes(t));
      
      if (validCountries.length === 0) {
        setMessage({ type: 'error', text: 'Please select at least one country preference' });
        return;
      }
      
      if (validTrades.length === 0) {
        setMessage({ type: 'error', text: 'Please select at least one trade/specialization' });
        return;
      }
      
      if (!tradeData.availability_to_join) {
        setMessage({ type: 'error', text: 'Please select your availability to join' });
        return;
      }
      
      if (!tradeData.willingness_to_relocate) {
        setMessage({ type: 'error', text: 'Please select your willingness to relocate' });
        return;
      }
      
      const response = await fetch('/api/candidate/profile/trade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tradeData, application_id: applicationId })
      });
      if (response.ok) {
        setCurrentStep(2);
        setMessage({ type: '', text: '' });
      }
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
      setMessage({ 
        type: 'error', 
        text: `You can only select up to ${maxAllowed} ${maxAllowed === 1 ? 'country' : 'countries'} for this position. Please deselect one first.` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
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
      setMessage({ 
        type: 'error', 
        text: `You can only select up to ${maxAllowed} ${maxAllowed === 1 ? 'trade' : 'trades'} for this position. Please deselect one first.` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handlePersonalSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        { field: 'first_name', label: 'First Name' },
        { field: 'father_husband_name', label: 'Father/Husband Name' },
        { field: 'gender', label: 'Gender' },
        { field: 'date_of_birth', label: 'Date of Birth' },
        { field: 'cnic', label: 'CNIC' },
        { field: 'email_address', label: 'Email' },
        { field: 'mobile_no', label: 'Mobile No' }
      ];

      for (const { field, label } of requiredFields) {
        if (!personalData[field] || personalData[field].trim() === '') {
          setMessage({ type: 'error', text: `${label} is required` });
          return;
        }
      }

      // Validate email confirmation
      if (personalData.email_address !== personalData.confirm_email_address) {
        setMessage({ type: 'error', text: 'Email and Confirm Email must match' });
        return;
      }

      // Format dates to MySQL format
      const formattedPersonalData = {
        ...personalData,
        date_of_birth: formatDateForMySQL(personalData.date_of_birth),
        cnic_issue_date: formatDateForMySQL(personalData.cnic_issue_date),
        cnic_expire_date: formatDateForMySQL(personalData.cnic_expire_date),
        passport_issue_date: formatDateForMySQL(personalData.passport_issue_date),
        passport_expire_date: formatDateForMySQL(personalData.passport_expire_date)
      };

      const response = await fetch('/api/candidate/profile/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formattedPersonalData, application_id: applicationId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: '', text: '' });
        setCurrentStep(3);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save personal information' });
      }
    } catch (error) {
      console.error('Failed to save personal info:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving your information' });
    }
  };

  const addExperience = async () => {
    try {
      const isEditing = newExperience.id;
      const url = isEditing ? `/api/candidate/profile/experience/${newExperience.id}` : '/api/candidate/profile/experience';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Format dates for MySQL
      const formattedExperience = {
        ...newExperience,
        from_date: formatDateForMySQL(newExperience.from_date),
        to_date: formatDateForMySQL(newExperience.to_date),
        application_id: applicationId
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedExperience)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update experiences list immediately for instant UI update
        if (isEditing) {
          // Update existing experience in the list
          setExperiences(experiences.map(exp => 
            exp.id === newExperience.id ? { ...formattedExperience, id: newExperience.id } : exp
          ));
        } else {
          // Add new experience to the list (backend returns the new experience with ID)
          if (data.experience) {
            setExperiences([...experiences, data.experience]);
          } else {
            // Fallback: fetch all profile data to get the updated list
            await fetchProfile();
          }
        }
        
        setNewExperience({ job_title: '', employer_hospital: '', specialization: '', from_date: '', to_date: '', total_experience: '' });
        setMessage({ type: 'success', text: isEditing ? 'Experience updated successfully' : 'Experience added successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Failed to add/update experience:', error);
      setMessage({ type: 'error', text: 'Failed to save experience' });
    }
  };

  const addEducation = async () => {
    try {
      const isEditing = newEducation.id;
      const url = isEditing ? `/api/candidate/profile/education/${newEducation.id}` : '/api/candidate/profile/education';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Format dates for MySQL
      const formattedEducation = {
        ...newEducation,
        graduation_year: formatDateForMySQL(newEducation.graduation_year),
        application_id: applicationId
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedEducation)
      });
      if (response.ok) {
        await fetchProfile();
        setNewEducation({ degree_diploma_title: '', university_institute_name: '', graduation_year: '', program_duration: '', registration_number: '', marks_percentage: '' });
        setMessage({ type: 'success', text: isEditing ? 'Education updated successfully' : 'Education added successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Failed to add/update education:', error);
      setMessage({ type: 'error', text: 'Failed to save education' });
    }
  };

  const editExperience = (exp) => {
    setNewExperience({
      id: exp.id,
      job_title: exp.job_title,
      employer_hospital: exp.employer_hospital,
      specialization: exp.specialization,
      from_date: exp.from_date,
      to_date: exp.to_date,
      total_experience: exp.total_experience
    });
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      const response = await fetch(`/api/candidate/profile/experience/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchProfile();
        setMessage({ type: 'success', text: 'Experience deleted successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      setMessage({ type: 'error', text: 'Failed to delete experience' });
    }
  };

  const editEducation = (edu) => {
    setNewEducation({
      id: edu.id,
      degree_diploma_title: edu.degree_diploma_title,
      university_institute_name: edu.university_institute_name,
      graduation_year: edu.graduation_year,
      program_duration: edu.program_duration,
      registration_number: edu.registration_number,
      marks_percentage: edu.marks_percentage
    });
  };

  const deleteEducation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;
    try {
      const response = await fetch(`/api/candidate/profile/education/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchProfile();
        setMessage({ type: 'success', text: 'Education deleted successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
      setMessage({ type: 'error', text: 'Failed to delete education' });
    }
  };

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({ ...prev, [fieldName]: progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setDocuments(prev => ({ ...prev, [fieldName]: response.url }));
            setMessage({ type: 'success', text: 'File uploaded successfully' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          }
        } else {
          setMessage({ type: 'error', text: 'File upload failed' });
        }
        setUploadProgress(prev => ({ ...prev, [fieldName]: null }));
      });

      xhr.addEventListener('error', () => {
        setMessage({ type: 'error', text: 'File upload failed' });
        setUploadProgress(prev => ({ ...prev, [fieldName]: null }));
      });

      xhr.open('POST', '/api/candidate/upload-document');
      xhr.send(formData);
    } catch (error) {
      console.error('Failed to upload file:', error);
      setMessage({ type: 'error', text: 'Failed to upload file' });
      setUploadProgress(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleAdditionalFileUpload = async (file) => {
    if (!file) return;

    // Check if we already have 5 files
    if (documents.additional_files.length >= 5) {
      setMessage({ type: 'error', text: 'Maximum 5 additional files allowed' });
      return;
    }

    // Check file size (5MB limit per file)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const tempId = `additional_${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({ ...prev, [tempId]: progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setDocuments(prev => ({
              ...prev,
              additional_files: [...prev.additional_files, { name: file.name, url: response.url }]
            }));
            setMessage({ type: 'success', text: 'Additional file uploaded successfully' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          }
        } else {
          setMessage({ type: 'error', text: 'File upload failed' });
        }
        setUploadProgress(prev => ({ ...prev, [tempId]: null }));
      });

      xhr.addEventListener('error', () => {
        setMessage({ type: 'error', text: 'File upload failed' });
        setUploadProgress(prev => ({ ...prev, [tempId]: null }));
      });

      xhr.open('POST', '/api/candidate/upload-document');
      xhr.send(formData);
    } catch (error) {
      console.error('Failed to upload additional file:', error);
      setMessage({ type: 'error', text: 'Failed to upload file' });
    }
  };

  const removeAdditionalFile = (index) => {
    setDocuments(prev => ({
      ...prev,
      additional_files: prev.additional_files.filter((_, i) => i !== index)
    }));
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
    { number: 0, label: 'Job Selection' },
    { number: 1, label: 'Trade Information' },
    { number: 2, label: 'Personal Information' },
    { number: 3, label: 'Professional Experience' },
    { number: 4, label: 'Education' },
    { number: 5, label: 'Documents' }
  ];

  const handleLogout = async () => {
    await fetch('/api/candidate/logout', { method: 'POST' });
    setLocation('/');
  };

  const saveAsDraft = async (step) => {
    try {
      // CRITICAL: Create/get draft application FIRST to get application_id
      // This ensures all profile data is saved with the correct application_id
      let currentApplicationId = applicationId;
      
      if (!currentApplicationId && selectedJobId) {
        const draftResponse = await fetch('/api/candidate/save-draft-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_id: selectedJobId })
        });
        
        if (draftResponse.ok) {
          const draftData = await draftResponse.json();
          currentApplicationId = draftData.applicationId;
          setApplicationId(currentApplicationId);
        }
      }
      
      let response;
      switch (step) {
        case 1:
          response = await fetch('/api/candidate/profile/trade', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...tradeData, application_id: currentApplicationId })
          });
          break;
        case 2:
          const formattedPersonalData = {
            ...personalData,
            date_of_birth: personalData.date_of_birth ? personalData.date_of_birth.split('T')[0] : null,
            passport_expire_date: personalData.passport_expire_date ? personalData.passport_expire_date.split('T')[0] : null,
            application_id: currentApplicationId
          };
          response = await fetch('/api/candidate/profile/personal', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedPersonalData)
          });
          break;
        case 3:
          if (newExperience.job_title || newExperience.employer_hospital || newExperience.specialization) {
            const shouldSave = confirm('You have unsaved experience data. Do you want to save it before closing?');
            if (shouldSave) {
              try {
                const expResponse = await fetch('/api/candidate/profile/experience', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...newExperience, application_id: currentApplicationId })
                });
                const expData = await expResponse.json();
                if (!expResponse.ok || !expData.success) {
                  setMessage({ type: 'error', text: expData.message || 'Failed to save experience. Please complete all required fields.' });
                  return;
                }
              } catch (error) {
                setMessage({ type: 'error', text: 'Failed to save experience entry' });
                return;
              }
            } else if (!shouldSave) {
              return;
            }
          }
          setMessage({ type: 'success', text: 'All experience entries saved!' });
          setTimeout(() => setLocation('/candidate/dashboard'), 1500);
          return;
        case 4:
          if (newEducation.degree_diploma_title || newEducation.university_institute_name || newEducation.graduation_year) {
            const shouldSave = confirm('You have unsaved education data. Do you want to save it before closing?');
            if (shouldSave) {
              try {
                const eduResponse = await fetch('/api/candidate/profile/education', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...newEducation, application_id: currentApplicationId })
                });
                const eduData = await eduResponse.json();
                if (!eduResponse.ok || !eduData.success) {
                  setMessage({ type: 'error', text: eduData.message || 'Failed to save education. Please complete all required fields.' });
                  return;
                }
              } catch (error) {
                setMessage({ type: 'error', text: 'Failed to save education entry' });
                return;
              }
            } else if (!shouldSave) {
              return;
            }
          }
          setMessage({ type: 'success', text: 'All education entries saved!' });
          setTimeout(() => setLocation('/candidate/dashboard'), 1500);
          return;
        case 5:
          response = await fetch('/api/candidate/profile/documents', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...documents, application_id: currentApplicationId })
          });
          break;
        default:
          setMessage({ type: 'info', text: 'Progress saved as draft' });
          setTimeout(() => setLocation('/candidate/dashboard'), 1500);
          return;
      }
      
      const data = await response.json();
      if (response.ok && data.success) {
        // Update draft application timestamp
        if (currentApplicationId) {
          await fetch('/api/candidate/save-draft-application', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_id: selectedJobId || null })
          });
        }
        setMessage({ type: 'success', text: 'Progress saved as draft!' });
        setTimeout(() => setLocation('/candidate/dashboard'), 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save progress' });
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    }
  };

  const handleExitWithConfirmation = () => {
    if (confirm('Are you sure you want to exit? Any unsaved progress on this page will be lost.')) {
      setLocation('/candidate/dashboard');
    }
  };

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

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            {jobIdFromUrl && (
              <div className="flex justify-between items-center mb-6 sm:mb-8 overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1 min-w-0">
                    <div className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ${currentStep === step.number ? 'text-[#00A6CE] font-medium' : currentStep > step.number ? 'text-[#00A6CE]' : 'text-gray-400'}`}>
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0 ${currentStep === step.number ? 'bg-[#00A6CE] text-white' : currentStep > step.number ? 'bg-[#00A6CE] text-white' : 'bg-gray-200'}`}>
                        {step.number}
                      </span>
                      <span className="text-[10px] sm:text-sm text-center sm:text-left whitespace-nowrap hidden md:inline">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${currentStep > step.number ? 'bg-[#00A6CE]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {currentStep === 0 && !jobIdFromUrl && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">My Profile</h2>
                
                <div className="mb-6 sm:mb-8 border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="border-b pb-4 sm:pb-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Profile Image</h3>
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

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Change Password</h3>
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

            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Trade Information</h2>
                
                {selectedJob && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Applying for: {selectedJob.title}</h3>
                    <p className="text-sm text-blue-700">{selectedJob.location}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select Job Position *</label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE] ${applicationIdFromUrl ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required
                    disabled={applicationIdFromUrl ? true : false}
                  >
                    <option value="">Select a job position</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title} - {job.location}</option>
                    ))}
                  </select>
                  {applicationIdFromUrl && (
                    <p className="text-xs text-gray-500 mt-2">Job position cannot be changed when editing a draft application</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Select Country Preference (Max: {selectedJob ? selectedJob.max_countries_selectable : 10}) *
                    <span className="ml-2 text-xs text-gray-600">
                      ({tradeData.countries_preference.filter(c => availableCountries.includes(c)).length} / {selectedJob ? selectedJob.max_countries_selectable : 10} selected)
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {availableCountries.map((countryName) => (
                      <button
                        key={countryName}
                        type="button"
                        onClick={() => toggleCountryPreference(countryName)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          tradeData.countries_preference.includes(countryName)
                            ? 'bg-[#00A6CE] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {countryName}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Select Trade/Specialization (Max: {selectedJob ? selectedJob.max_trades_selectable : 10}) *
                    <span className="ml-2 text-xs text-gray-600">
                      ({tradeData.trades_preference.filter(t => availableTrades.includes(t)).length} / {selectedJob ? selectedJob.max_trades_selectable : 10} selected)
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableTrades.map((trade) => (
                      <button
                        key={trade}
                        type="button"
                        onClick={() => toggleTradePreference(trade)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          tradeData.trades_preference.includes(trade)
                            ? 'bg-[#00A6CE] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {trade}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability to Join *</label>
                    <select
                      value={tradeData.availability_to_join}
                      onChange={(e) => setTradeData({ ...tradeData, availability_to_join: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Immediately">Immediately</option>
                      <option value="Within 1 Month">Within 1 Month</option>
                      <option value="Within 3 Months">Within 3 Months</option>
                      <option value="Within 6 Months">Within 6 Months</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Willingness to Relocate *</label>
                    <select
                      value={tradeData.willingness_to_relocate}
                      onChange={(e) => setTradeData({ ...tradeData, willingness_to_relocate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Maybe">Maybe</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handleExitWithConfirmation}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-8"
                  >
                    Exit
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => saveAsDraft(1)}
                      className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
                    >
                      Save & Close
                    </Button>
                    <Button
                      onClick={handleTradeSubmit}
                      className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-full px-8"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                
                <div className="mb-6 flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-[#00A6CE]"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                        <span className="text-2xl text-gray-400">
                          {personalData.first_name?.[0]}{personalData.last_name?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-4 py-2 rounded-lg cursor-pointer inline-block">
                      Upload Recent Picture
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {profileImage && (
                      <Button
                        onClick={handleImageUpload}
                        className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Save Picture
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={personalData.first_name}
                      onChange={(e) => setPersonalData({ ...personalData, first_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      value={personalData.last_name}
                      onChange={(e) => setPersonalData({ ...personalData, last_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Father's/Husband's Name *</label>
                    <input
                      type="text"
                      value={personalData.father_husband_name}
                      onChange={(e) => setPersonalData({ ...personalData, father_husband_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Father's/Husband's Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marital Status</label>
                    <input
                      type="text"
                      value={personalData.marital_status}
                      onChange={(e) => setPersonalData({ ...personalData, marital_status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Married"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender *</label>
                    <select
                      value={personalData.gender}
                      onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Religion</label>
                    <input
                      type="text"
                      value={personalData.religion}
                      onChange={(e) => setPersonalData({ ...personalData, religion: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Muslim"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Of Birth *</label>
                    <input
                      type="date"
                      value={personalData.date_of_birth}
                      onChange={(e) => setPersonalData({ ...personalData, date_of_birth: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Place Of Birth</label>
                    <input
                      type="text"
                      value={personalData.place_of_birth}
                      onChange={(e) => setPersonalData({ ...personalData, place_of_birth: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Province</label>
                    <input
                      type="text"
                      value={personalData.province}
                      onChange={(e) => setPersonalData({ ...personalData, province: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Province"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      value={personalData.country}
                      onChange={(e) => setPersonalData({ ...personalData, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                    >
                      <option value="">Select Country</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Australia">Australia</option>
                      <option value="Austria">Austria</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Canada">Canada</option>
                      <option value="China">China</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Egypt">Egypt</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Greece">Greece</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Iran">Iran</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Italy">Italy</option>
                      <option value="Japan">Japan</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Norway">Norway</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Poland">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Russia">Russia</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="South Africa">South Africa</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Spain">Spain</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Turkey">Turkey</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CNIC *</label>
                    <input
                      type="text"
                      value={personalData.cnic}
                      onChange={(e) => setPersonalData({ ...personalData, cnic: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="35202**********0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CNIC Issue Date</label>
                    <input
                      type="date"
                      value={personalData.cnic_issue_date}
                      onChange={(e) => setPersonalData({ ...personalData, cnic_issue_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CNIC Expire Date</label>
                    <input
                      type="date"
                      value={personalData.cnic_expire_date}
                      onChange={(e) => setPersonalData({ ...personalData, cnic_expire_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Passport Number</label>
                    <input
                      type="text"
                      value={personalData.passport_number}
                      onChange={(e) => setPersonalData({ ...personalData, passport_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="HY******"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Passport Issue Date</label>
                    <input
                      type="date"
                      value={personalData.passport_issue_date}
                      onChange={(e) => setPersonalData({ ...personalData, passport_issue_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Passport Expire Date</label>
                    <input
                      type="date"
                      value={personalData.passport_expire_date}
                      onChange={(e) => setPersonalData({ ...personalData, passport_expire_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={personalData.email_address}
                      onChange={(e) => setPersonalData({ ...personalData, email_address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Email Address *</label>
                    <input
                      type="email"
                      value={personalData.confirm_email_address || ''}
                      onChange={(e) => setPersonalData({ ...personalData, confirm_email_address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tel. Off. No</label>
                    <input
                      type="tel"
                      value={personalData.tel_off_no}
                      onChange={(e) => setPersonalData({ ...personalData, tel_off_no: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="051*******0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tel. Res. No</label>
                    <input
                      type="tel"
                      value={personalData.tel_res_no}
                      onChange={(e) => setPersonalData({ ...personalData, tel_res_no: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="051*******0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile No *</label>
                    <input
                      type="tel"
                      value={personalData.mobile_no}
                      onChange={(e) => setPersonalData({ ...personalData, mobile_no: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="03*********0"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Present Address</label>
                    <input
                      type="text"
                      value={personalData.present_address}
                      onChange={(e) => setPersonalData({ ...personalData, present_address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Present Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Street</label>
                    <input
                      type="text"
                      value={personalData.present_street}
                      onChange={(e) => setPersonalData({ ...personalData, present_street: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={personalData.present_postal_code}
                      onChange={(e) => setPersonalData({ ...personalData, present_postal_code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="56855"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Permanent Address</label>
                    <input
                      type="text"
                      value={personalData.permanent_address}
                      onChange={(e) => setPersonalData({ ...personalData, permanent_address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Permanent Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Street</label>
                    <input
                      type="text"
                      value={personalData.permanent_street}
                      onChange={(e) => setPersonalData({ ...personalData, permanent_street: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={personalData.permanent_postal_code}
                      onChange={(e) => setPersonalData({ ...personalData, permanent_postal_code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="56855"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Same As Present Address</span>
                  </label>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handleExitWithConfirmation}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-8"
                  >
                    Exit
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-8"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => saveAsDraft(2)}
                      className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
                    >
                      Save & Close
                    </Button>
                    <Button
                      onClick={handlePersonalSubmit}
                      className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-full px-8"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Professional Details</h2>
                
                {experiences.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left text-sm font-semibold">Job Title</th>
                          <th className="border p-3 text-left text-sm font-semibold">Employer / Hospital Name</th>
                          <th className="border p-3 text-left text-sm font-semibold">Specialization</th>
                          <th className="border p-3 text-left text-sm font-semibold">From</th>
                          <th className="border p-3 text-left text-sm font-semibold">To</th>
                          <th className="border p-3 text-left text-sm font-semibold">Total Experience</th>
                          <th className="border p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiences.map((exp, idx) => (
                          <tr key={idx}>
                            <td className="border p-3 text-sm">{exp.job_title}</td>
                            <td className="border p-3 text-sm">{exp.employer_hospital}</td>
                            <td className="border p-3 text-sm">{exp.specialization}</td>
                            <td className="border p-3 text-sm">{exp.from_date}</td>
                            <td className="border p-3 text-sm">{exp.to_date}</td>
                            <td className="border p-3 text-sm">{exp.total_experience}</td>
                            <td className="border p-3 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => editExperience(exp)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteExperience(exp.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      value={newExperience.job_title}
                      onChange={(e) => setNewExperience({ ...newExperience, job_title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Current Job Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Employer / Hospital</label>
                    <input
                      type="text"
                      value={newExperience.employer_hospital}
                      onChange={(e) => setNewExperience({ ...newExperience, employer_hospital: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Current Employer / Hospital"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialization (E.G. ICU Nurse, Pediatric Nurse, General Nurse)</label>
                    <input
                      type="text"
                      value={newExperience.specialization}
                      onChange={(e) => setNewExperience({ ...newExperience, specialization: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="ICU Nurse"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <input
                      type="date"
                      value={newExperience.from_date}
                      onChange={(e) => setNewExperience({ ...newExperience, from_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <input
                      type="date"
                      value={newExperience.to_date}
                      onChange={(e) => setNewExperience({ ...newExperience, to_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Total Years Of Experience</label>
                  <input
                    type="text"
                    value={newExperience.total_experience}
                    onChange={(e) => setNewExperience({ ...newExperience, total_experience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                    placeholder="X Years"
                  />
                </div>
                
                <div className="flex justify-end mb-6">
                  <Button
                    onClick={addExperience}
                    className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-lg px-6"
                  >
                    {newExperience.id ? 'Update Experience' : 'Add Experience'}
                  </Button>
                  {newExperience.id && (
                    <Button
                      onClick={() => setNewExperience({ job_title: '', employer_hospital: '', specialization: '', from_date: '', to_date: '', total_experience: '' })}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg px-6 ml-3"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handleExitWithConfirmation}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-8"
                  >
                    Exit
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-8"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => saveAsDraft(3)}
                      className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
                    >
                      Save & Close
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-full px-8"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Education & Certifications</h2>
                
                {educations.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left text-sm font-semibold">Degree/Diploma Title</th>
                          <th className="border p-3 text-left text-sm font-semibold">University/Institute Name</th>
                          <th className="border p-3 text-left text-sm font-semibold">Graduation Year</th>
                          <th className="border p-3 text-left text-sm font-semibold">Program Duration</th>
                          <th className="border p-3 text-left text-sm font-semibold">Registration Number</th>
                          <th className="border p-3 text-left text-sm font-semibold">Marks/Percentage</th>
                          <th className="border p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {educations.map((edu, idx) => (
                          <tr key={idx}>
                            <td className="border p-3 text-sm">{edu.degree_diploma_title}</td>
                            <td className="border p-3 text-sm">{edu.university_institute_name}</td>
                            <td className="border p-3 text-sm">{edu.graduation_year}</td>
                            <td className="border p-3 text-sm">{edu.program_duration}</td>
                            <td className="border p-3 text-sm">{edu.registration_number}</td>
                            <td className="border p-3 text-sm">{edu.marks_percentage}</td>
                            <td className="border p-3 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => editEducation(edu)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteEducation(edu.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Degree/Diploma Title (BSc Nursing, Diploma In General Nursing, Etc.)</label>
                    <input
                      type="text"
                      value={newEducation.degree_diploma_title}
                      onChange={(e) => setNewEducation({ ...newEducation, degree_diploma_title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="BSc Nursing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">University/Institute Name</label>
                    <input
                      type="text"
                      value={newEducation.university_institute_name}
                      onChange={(e) => setNewEducation({ ...newEducation, university_institute_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="University/Institute Name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Graduation Year</label>
                    <input
                      type="text"
                      value={newEducation.graduation_year}
                      onChange={(e) => setNewEducation({ ...newEducation, graduation_year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="Graduation Year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Program Duration</label>
                    <input
                      type="text"
                      value={newEducation.program_duration}
                      onChange={(e) => setNewEducation({ ...newEducation, program_duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="4 Years"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">License/Registration Number (With Nursing Council)</label>
                    <input
                      type="text"
                      value={newEducation.registration_number}
                      onChange={(e) => setNewEducation({ ...newEducation, registration_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="LXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marks/Percentage</label>
                    <input
                      type="text"
                      value={newEducation.marks_percentage}
                      onChange={(e) => setNewEducation({ ...newEducation, marks_percentage: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                      placeholder="70%"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-6">
                  <Button
                    onClick={addEducation}
                    className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-lg px-6"
                  >
                    {newEducation.id ? 'Update Education' : 'Add Education'}
                  </Button>
                  {newEducation.id && (
                    <Button
                      onClick={() => setNewEducation({ degree_diploma_title: '', university_institute_name: '', graduation_year: '', program_duration: '', registration_number: '', marks_percentage: '' })}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg px-6 ml-3"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handleExitWithConfirmation}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-8"
                  >
                    Exit
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-8"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => saveAsDraft(4)}
                      className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
                    >
                      Save & Close
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(5)}
                      className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-full px-8"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Document Uploads</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Updated CV/Resume (PDF)</label>
                    <div className="space-y-2">
                      {documents.cv_resume_url && (
                        <div className="text-sm text-gray-600 py-1">
                          <a href={documents.cv_resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View uploaded file</a>
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="cv_resume_url"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'cv_resume_url')}
                      />
                      <label
                        htmlFor="cv_resume_url"
                        className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        {documents.cv_resume_url ? 'Replace File' : 'Choose File'}
                      </label>
                      {uploadProgress.cv_resume_url !== null && uploadProgress.cv_resume_url !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.cv_resume_url}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Passport</label>
                    <div className="space-y-2">
                      {documents.passport_url && (
                        <div className="text-sm text-gray-600 py-1">
                          <a href={documents.passport_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View uploaded file</a>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="passport_url"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'passport_url')}
                      />
                      <label
                        htmlFor="passport_url"
                        className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        {documents.passport_url ? 'Replace File' : 'Choose File'}
                      </label>
                      {uploadProgress.passport_url !== null && uploadProgress.passport_url !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.passport_url}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Degree/Diploma Certificates</label>
                    <div className="space-y-2">
                      {documents.degree_certificates_url && (
                        <div className="text-sm text-gray-600 py-1">
                          <a href={documents.degree_certificates_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View uploaded file</a>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="degree_certificates_url"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'degree_certificates_url')}
                      />
                      <label
                        htmlFor="degree_certificates_url"
                        className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        {documents.degree_certificates_url ? 'Replace File' : 'Choose File'}
                      </label>
                      {uploadProgress.degree_certificates_url !== null && uploadProgress.degree_certificates_url !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.degree_certificates_url}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional License / Registration Certificate</label>
                    <div className="space-y-2">
                      {documents.license_certificate_url && (
                        <div className="text-sm text-gray-600 py-1">
                          <a href={documents.license_certificate_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View uploaded file</a>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="license_certificate_url"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'license_certificate_url')}
                      />
                      <label
                        htmlFor="license_certificate_url"
                        className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        {documents.license_certificate_url ? 'Replace File' : 'Choose File'}
                      </label>
                      {uploadProgress.license_certificate_url !== null && uploadProgress.license_certificate_url !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.license_certificate_url}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">IELTS/OET Certificate (If Applicable)</label>
                    <div className="space-y-2">
                      {documents.ielts_oet_certificate_url && (
                        <div className="text-sm text-gray-600 py-1">
                          <a href={documents.ielts_oet_certificate_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View uploaded file</a>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="ielts_oet_certificate_url"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'ielts_oet_certificate_url')}
                      />
                      <label
                        htmlFor="ielts_oet_certificate_url"
                        className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        {documents.ielts_oet_certificate_url ? 'Replace File' : 'Choose File'}
                      </label>
                      {uploadProgress.ielts_oet_certificate_url !== null && uploadProgress.ielts_oet_certificate_url !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.ielts_oet_certificate_url}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Letters (From Previous Employers)</label>
                    <div className="space-y-2">
                      {documents.experience_letters_url && (
                        <div className="text-sm text-gray-600 py-1">
                          <a href={documents.experience_letters_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View uploaded file</a>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="experience_letters_url"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'experience_letters_url')}
                      />
                      <label
                        htmlFor="experience_letters_url"
                        className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        {documents.experience_letters_url ? 'Replace File' : 'Choose File'}
                      </label>
                      {uploadProgress.experience_letters_url !== null && uploadProgress.experience_letters_url !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.experience_letters_url}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Additional Files (Maximum 5 files, 5MB each)</label>
                  <div className="space-y-3">
                    {documents.additional_files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1">{file.name}</a>
                        <button
                          onClick={() => removeAdditionalFile(index)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {documents.additional_files.length < 5 && (
                      <div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          id="additional_file"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleAdditionalFileUpload(e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />
                        <label
                          htmlFor="additional_file"
                          className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                        >
                          Add Additional File ({documents.additional_files.length}/5)
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6 space-y-3">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="w-4 h-4 mt-1" />
                    <span className="text-sm">I Confirm That The Information Provided Is Accurate And All Documents Uploaded Are Authentic.</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="w-4 h-4 mt-1" />
                    <span className="text-sm">I Agree To The Terms & Conditions Of Duke Consultancy.</span>
                  </label>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handleExitWithConfirmation}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-8"
                  >
                    Exit
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-8"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => saveAsDraft(5)}
                      className="bg-[#B8E6F3] hover:bg-[#A0D9E8] text-gray-700 rounded-full px-8"
                    >
                      Save & Close
                    </Button>
                    <Button
                      onClick={handleDocumentsSubmit}
                      className="bg-[#00A6CE] hover:bg-[#0090B5] text-white rounded-full px-8"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
