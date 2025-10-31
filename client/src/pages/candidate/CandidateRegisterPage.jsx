import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';

export default function CandidateRegisterPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const validateName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+\d{1,4}\d{6,14}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateName(formData.firstName)) {
      setError('First name should only contain letters');
      return;
    }

    if (!validateName(formData.lastName)) {
      setError('Last name should only contain letters');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Phone number must include country code (e.g., +923001234567)');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/candidate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setLocation('/candidate/profile');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">
        <div className="hidden md:flex bg-gradient-to-br from-[#E6F7FB] to-white p-8 lg:p-12 items-center justify-center">
          <img src="/login-illustration.png" alt="Register Illustration" className="max-w-full" />
        </div>

        <div className="p-6 sm:p-8 lg:p-12">
          <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10 sm:h-12 mb-6 sm:mb-8" />
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Your Account to Apply</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Fill In Your Details To Get Access To Job Opportunities And Track Your Applications.</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                required
                pattern="\+\d{1,4}\d{6,14}"
                title="Include country code (e.g., +923001234567)"
              />
              <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +92 for Pakistan)</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Password</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <p className="text-right text-gray-600 mb-6">
              Already have an account? <button type="button" onClick={() => setLocation('/candidate/login')} className="text-[#00A6CE] font-medium">Login</button>
            </p>

            <Button type="submit" className="w-full bg-[#0B7A9F] hover:bg-[#096685] text-white py-4 sm:py-6 text-sm sm:text-base rounded-full">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
