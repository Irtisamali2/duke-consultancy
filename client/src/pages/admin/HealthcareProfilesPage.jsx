import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function HealthcareProfilesPage() {
  const [, setLocation] = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/healthcare-profiles', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this profile? This will also delete all associated documents and files.')) {
      return;
    }

    try {
      const response = await fetch(`/api/healthcare-profiles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        alert('Profile deleted successfully');
        fetchProfiles();
      } else {
        alert('Failed to delete profile: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile');
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const search = searchTerm.toLowerCase();
    return (
      profile.first_name?.toLowerCase().includes(search) ||
      profile.last_name?.toLowerCase().includes(search) ||
      profile.email?.toLowerCase().includes(search) ||
      profile.mobile_no?.includes(search) ||
      profile.trade_applied_for?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Profiles</h1>
            <p className="text-gray-600">Manage registered candidate profiles</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, phone, or trade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A6CE]"
            />
          </div>

          {filteredProfiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No healthcare profiles found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProfiles.map((profile) => (
                <Card key={profile.candidate_id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {profile.profile_image_url ? (
                            <img 
                              src={profile.profile_image_url} 
                              alt={`${profile.first_name} ${profile.last_name}`}
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#00A6CE]"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#B0E5F0] flex items-center justify-center text-2xl font-bold text-[#00A6CE]">
                              {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {profile.first_name} {profile.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">{profile.trade_applied_for || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <p className="text-gray-600">{profile.email || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>
                            <p className="text-gray-600">{profile.mobile_no || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Nationality:</span>
                            <p className="text-gray-600">{profile.nationality || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Gender:</span>
                            <p className="text-gray-600">{profile.gender || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date of Birth:</span>
                            <p className="text-gray-600">
                              {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Registered:</span>
                            <p className="text-gray-600">
                              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => setLocation(`/admin/healthcare-profiles/view/${profile.candidate_id}`)}
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => setLocation(`/admin/healthcare-profiles/edit/${profile.candidate_id}`)}
                          className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(profile.candidate_id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
