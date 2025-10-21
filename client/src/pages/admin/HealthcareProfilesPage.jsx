import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';

export default function HealthcareProfilesPage() {
  const [, setLocation] = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/healthcare-profiles');
      const data = await response.json();
      if (data.success) {
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesFilter = filter === 'all' || profile.status === filter;
    const matchesSearch = 
      (profile.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (profile.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (profile.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: profiles.length,
    verified: profiles.filter(p => p.status === 'verified').length,
    pending: profiles.filter(p => p.status === 'pending').length,
    rejected: profiles.filter(p => p.status === 'rejected').length
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Nurses</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-6 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`pb-2 ${filter === 'all' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                All ({stats.all})
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`pb-2 ${filter === 'verified' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Verified({stats.verified})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`pb-2 ${filter === 'pending' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Pending({stats.pending})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`pb-2 ${filter === 'rejected' ? 'border-b-2 border-[#00A6CE] text-[#00A6CE] font-medium' : 'text-gray-600'}`}
              >
                Rejected({stats.rejected})
              </button>
            </div>
            
            <div className="flex justify-end">
              <input
                type="text"
                placeholder="Search by ID, name, ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nurse ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Passport No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Education</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfiles.map((profile) => (
                  <tr 
                    key={profile.candidate_id}
                    onClick={() => setLocation(`/admin/profiles/${profile.candidate_id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(profile.candidate_id).padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {profile.passport_number ? `${profile.passport_number.slice(0, 4)}***` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.mobile_no || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.education || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {profile.total_experience ? `${profile.total_experience} Years` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        profile.status === 'verified' ? 'bg-green-100 text-green-800' :
                        profile.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {profile.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
