import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/AdminLayout';

export default function JobsPage() {
  const [, setLocation] = useLocation();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <Button
            onClick={() => setLocation('/admin/jobs/new')}
            className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
          >
            Add Job
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E8F4F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.job_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => setLocation(`/admin/jobs/edit/${job.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
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
