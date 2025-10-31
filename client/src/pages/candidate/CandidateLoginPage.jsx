import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';

export default function CandidateLoginPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/candidate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setLocation('/candidate/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-12">
          <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10 sm:h-12 mb-6 sm:mb-8" />
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Login to your account</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Fill In Your Details To Get Access To Job Opportunities And Track Your Applications.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button 
                  type="button"
                  onClick={() => setLocation('/candidate/forgot-password')} 
                  className="text-xs text-[#00A6CE] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <p className="text-center text-gray-600 mb-6">
              Don't have an account? <button type="button" onClick={() => setLocation('/candidate/register')} className="text-[#00A6CE] font-medium">Register</button>
            </p>

            <Button type="submit" className="w-full bg-[#0B7A9F] hover:bg-[#096685] text-white py-4 sm:py-6 text-sm sm:text-base rounded-full">
              Login
            </Button>
          </form>
        </div>

        <div className="hidden md:flex bg-gradient-to-br from-[#E6F7FB] to-white p-8 lg:p-12 items-center justify-center">
          <img src="/login-illustration.png" alt="Login Illustration" className="max-w-full" />
        </div>
      </div>
    </div>
  );
}
