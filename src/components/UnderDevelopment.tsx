import { Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface UnderDevelopmentProps {
  featureName: string;
}

export const UnderDevelopment = ({ featureName }: UnderDevelopmentProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com" || "boscorethice5@gmail.com";;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-xl font-semibold text-gray-800">H Calendar</h1>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">v1.0.0</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-16 flex  justify-center w-full ">
          <div className="text-center p-8">
            <div className="flex justify-center mb-6">
              <Code2 className="w-16 h-16 text-blue-500 animate-bounce" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {featureName}
            </h1>
            <p className="text-gray-600 mb-8 text-jus">
              Cette fonctionnalité est en cours de développement et sera bientot disponible dans la version 1.1.0
            </p>
            <div className="flex justify-center flex-col md:flex-row gap-4">
              <a
                href="https://wa.me/+22941322242"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center "
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://www.linkedin.com/in/prince-ekpinse-developpement-front-end/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};