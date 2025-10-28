import { useLocation } from 'wouter';

export default function CandidateSidebar({ candidate, profileImage, onLogout, isOpen, onClose }) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { path: '/candidate/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/candidate/profile', label: 'My Profile', icon: '👤' },
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 min-h-screen p-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <img src="/Group_1760620436964.png" alt="Duke Consultancy Logo" className="h-10 mb-8" />
        
        <div className="flex items-center gap-3 mb-8 p-3 bg-[#E6F7FB] rounded-lg">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#00A6CE]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium">
                {candidate?.firstName?.[0]}{candidate?.lastName?.[0]}
              </span>
            </div>
          )}
          <span className="font-medium text-sm">{candidate?.firstName} {candidate?.lastName}</span>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full text-left px-4 py-3 mb-2 rounded-lg transition-colors ${
                location === item.path
                  ? 'bg-[#E6F7FB] text-[#00A6CE] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
