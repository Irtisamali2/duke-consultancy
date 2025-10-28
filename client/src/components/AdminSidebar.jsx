import { useLocation } from 'wouter';

export default function AdminSidebar({ admin, onLogout, isOpen, onClose }) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/jobs', label: 'Job Management', icon: '💼' },
    { path: '/admin/applications', label: 'Applications Management', icon: '📝' },
    { path: '/admin/healthcare-profiles', label: 'Healthcare Profiles', icon: '👥' },
    { path: '/admin/contact-leads', label: 'Contact Leads', icon: '📬' },
    { path: '/admin/blogs', label: 'Blogs', icon: '📰' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { path: '/admin/company-profile', label: 'Company Profile', icon: '🏢' },
    { path: '/admin/social-links', label: 'Social Links', icon: '🔗' },
    { path: '/admin/email-settings', label: 'Email Settings', icon: '📧' },
    { path: '/admin/email-templates', label: 'Email Templates', icon: '✉️' },
    { path: '/admin/email-logs', label: 'Email Logs', icon: '📋' },
    { path: '/admin/email-inbox', label: 'Email Inbox', icon: '📬' },
    { path: '/admin/account-settings', label: 'Account Settings', icon: '⚙️' },
  ];

  const handleMenuClick = (path) => {
    setLocation(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 border-b border-gray-200">
        <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10" />
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{admin?.name || 'John Doe'}</p>
            <p className="text-xs text-gray-500">{admin?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleMenuClick(item.path)}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
              location === item.path
                ? 'bg-[#E6F7FB] text-[#00A6CE] font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
      </div>
    </>
  );
}
