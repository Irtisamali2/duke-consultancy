import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/AdminLayout';
import { countries } from '../../utils/countries';

export default function JobFormPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/jobs/:action/:id?');
  const isEdit = params?.action === 'edit';
  const jobId = params?.id;
  
  const [availableTrades, setAvailableTrades] = useState([]);
  const [newTrade, setNewTrade] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    country: '',
    job_type: '',
    specialization: '',
    experience_required: '',
    salary_range: '',
    status: 'active',
    countries: [],
    trades: [],
    max_countries_selectable: 1,
    max_trades_selectable: 1
  });

  useEffect(() => {
    fetchTrades();
    if (isEdit && jobId) {
      fetchJob();
    }
  }, [isEdit, jobId]);
  
  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades');
      const data = await response.json();
      if (data.success) {
        setAvailableTrades(data.trades || []);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  };

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();
      if (data.success) {
        const job = data.job;
        setFormData({
          ...job,
          countries: job.countries ? JSON.parse(job.countries) : [],
          trades: job.trades ? JSON.parse(job.trades) : [],
          max_countries_selectable: job.max_countries_selectable || 1,
          max_trades_selectable: job.max_trades_selectable || 1
        });
      }
    } catch (error) {
      console.error('Failed to fetch job:', error);
    }
  };
  
  const handleAddTrade = () => {
    if (newTrade.trim() && !availableTrades.includes(newTrade.trim())) {
      setAvailableTrades([...availableTrades, newTrade.trim()].sort());
      setFormData({ ...formData, trades: [...formData.trades, newTrade.trim()] });
      setNewTrade('');
    }
  };
  
  const toggleCountry = (countryName) => {
    const newCountries = formData.countries.includes(countryName)
      ? formData.countries.filter(c => c !== countryName)
      : [...formData.countries, countryName];
    setFormData({ ...formData, countries: newCountries });
  };
  
  const toggleTrade = (trade) => {
    const newTrades = formData.trades.includes(trade)
      ? formData.trades.filter(t => t !== trade)
      : [...formData.trades, trade];
    setFormData({ ...formData, trades: newTrades });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.countries.length === 0) {
      alert('Please select at least one country');
      return;
    }
    
    if (formData.trades.length === 0) {
      alert('Please select at least one trade');
      return;
    }
    
    try {
      const url = isEdit ? `/api/jobs/${jobId}` : '/api/jobs';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setLocation('/admin/jobs');
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Job' : 'Add Job'}</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Various, London, Dubai"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
              <input
                type="text"
                value={formData.experience_required}
                onChange={(e) => setFormData({ ...formData, experience_required: e.target.value })}
                placeholder="e.g., 2-5 years, Any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g., $50,000 - $70,000, Competitive"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="col-span-2 border-t pt-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Countries Available for This Job *</h3>
              <p className="text-sm text-gray-600 mb-4">Select all countries where this position is available. Candidates will be able to select from these countries based on their preference.</p>
              
              <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {countries.map(country => (
                  <label key={country.code} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.countries.includes(country.name)}
                      onChange={() => toggleCountry(country.name)}
                      className="w-4 h-4 text-[#00A6CE] focus:ring-[#00A6CE] rounded"
                    />
                    <span className="text-sm text-gray-700">{country.name}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {formData.countries.length > 0 ? formData.countries.join(', ') : 'None'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Countries Candidate Can Select</label>
              <input
                type="number"
                min="1"
                max={formData.countries.length || 1}
                value={formData.max_countries_selectable}
                onChange={(e) => setFormData({ ...formData, max_countries_selectable: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum number of countries a candidate can select for this job</p>
            </div>
            
            <div className="col-span-2 border-t pt-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trades / Specializations Available *</h3>
              <p className="text-sm text-gray-600 mb-4">Select all trades/specializations required for this position. You can also add custom trades.</p>
              
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newTrade}
                  onChange={(e) => setNewTrade(e.target.value)}
                  placeholder="Add new trade (e.g., ICU Nurse)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrade())}
                />
                <Button
                  type="button"
                  onClick={handleAddTrade}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add Trade
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {availableTrades.map(trade => (
                  <label key={trade} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.trades.includes(trade)}
                      onChange={() => toggleTrade(trade)}
                      className="w-4 h-4 text-[#00A6CE] focus:ring-[#00A6CE] rounded"
                    />
                    <span className="text-sm text-gray-700">{trade}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {formData.trades.length > 0 ? formData.trades.join(', ') : 'None'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Trades Candidate Can Select</label>
              <input
                type="number"
                min="1"
                max={formData.trades.length || 1}
                value={formData.max_trades_selectable}
                onChange={(e) => setFormData({ ...formData, max_trades_selectable: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum number of trades a candidate can select for this job</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => setLocation('/admin/jobs')}
              className="bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            >
              {isEdit ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
