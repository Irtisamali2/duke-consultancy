import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setLocation('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="mb-8">
              <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-12 mb-8" />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Login to your account
              </h1>
              <p className="text-gray-600 text-sm">
                Fill In Your Details To Get Access To Job Opportunities And Track Your Applications.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-gray-900 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-sm"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-900 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="************"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A6CE] text-sm"
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-center">
                <Button 
                  type="submit"
                  className="bg-[#00A6CE] hover:bg-[#0090B5] text-white px-12 py-6 rounded-full text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-gray-600 text-xs mt-4">
                  Demo: admin@duke.com / admin123
                </p>
              </div>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex bg-gradient-to-br from-[#00A6CE]/10 to-[#00A6CE]/5 p-8 lg:p-12 items-center justify-center">
            <div className="relative w-full max-w-md">
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                {/* Lock icon */}
                <circle cx="200" cy="140" r="50" fill="#3D7A8A" opacity="0.3" />
                <rect x="175" y="160" width="50" height="60" rx="5" fill="#3D7A8A" />
                <circle cx="200" cy="135" r="20" fill="none" stroke="#3D7A8A" strokeWidth="8" />
                
                {/* Person */}
                <ellipse cx="200" cy="280" rx="60" ry="80" fill="#2C5F6F" />
                <circle cx="200" cy="240" r="35" fill="#2C5F6F" />
                
                {/* Password display */}
                <rect x="280" y="100" width="100" height="80" rx="8" fill="white" stroke="#00A6CE" strokeWidth="3" />
                <circle cx="300" cy="130" r="6" fill="#00A6CE" />
                <circle cx="320" cy="130" r="6" fill="#00A6CE" />
                <circle cx="340" cy="130" r="6" fill="#00A6CE" />
                <circle cx="360" cy="130" r="6" fill="#00A6CE" />
                
                {/* Keypad */}
                <rect x="290" y="150" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="310" y="150" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="330" y="150" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="350" y="150" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="290" y="165" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="310" y="165" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="330" y="165" width="15" height="10" rx="2" fill="#E0E0E0" />
                <rect x="350" y="165" width="15" height="10" rx="2" fill="#E0E0E0" />
                
                {/* Gears */}
                <circle cx="80" cy="320" r="25" fill="none" stroke="#00A6CE" strokeWidth="4" />
                <circle cx="80" cy="320" r="15" fill="none" stroke="#00A6CE" strokeWidth="3" />
                <circle cx="340" cy="340" r="20" fill="none" stroke="#3D7A8A" strokeWidth="3" />
                <circle cx="340" cy="340" r="12" fill="none" stroke="#3D7A8A" strokeWidth="2" />
                
                {/* Decorative dots */}
                <circle cx="100" cy="100" r="3" fill="#00A6CE" opacity="0.5" />
                <circle cx="120" cy="80" r="3" fill="#00A6CE" opacity="0.5" />
                <circle cx="350" cy="280" r="3" fill="#3D7A8A" opacity="0.5" />
                <circle cx="360" cy="300" r="3" fill="#3D7A8A" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
