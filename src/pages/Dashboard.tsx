import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { LogOut, User, Mail, Shield } from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={logout} variant="outline">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-lg font-medium text-gray-900">{user?.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-lg font-medium text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome!</h3>
              <p className="text-gray-700">
                You have successfully signed in to your account. Your session is active and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
