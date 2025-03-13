import { Users, GraduationCap, BarChart2, Settings, Calendar as CalendarIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com";

//   if (!isDirector) return null;

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 fixed h-screen z-[60]">
      <div className="space-y-6">
        <div className="group relative">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 rounded-lg hover:bg-gray-100 transition-colors text-blue-500"
          >
            <CalendarIcon className="w-6 h-6" />
          </button>
          <div className="absolute z-[70] left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Emploi du temps
          </div>
        </div>

        <div className="group relative">
          <button 
            onClick={() => navigate('/professors')}
            className="p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <Users className="w-6 h-6" />
          </button>
          <div className="absolute z-[70] left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Professeurs
          </div>
        </div>

            <div className="group relative">
              <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                <GraduationCap className="w-6 h-6" />
              </button>
            </div>

            <div className="group relative">
              <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                <BarChart2 className="w-6 h-6" />
              </button>
            </div>

            {isDirector && (
              <div className="group relative">
                <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
  );
};