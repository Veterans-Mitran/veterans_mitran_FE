import { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CustomSVG from './CustomSVG'; // import the SVG component

export const Header = () => {
  const { user, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4"> {/* Added flex container */}
          {/* Custom SVG logo, reduced size */}
          <div className="w-8 h-8"> {/* Smaller size */}
            <CustomSVG /> {/* Add the SVG component here */}
          </div>

          {/* Text Section */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Veterans Mitran Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage members and records</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </button>

            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-semibold shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium text-gray-900">{user?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-medium text-gray-900">{user?.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};