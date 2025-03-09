import { useAuth } from '../contexts/AuthContext';
import Calendar from './Calendar';  // On va déplacer le contenu actuel de App.tsx ici
import { ScheduleArchive } from './ScheduleArchive';

export function Dashboard() {
  const { logout, saveScheduleImage, user } = useAuth();  // On va déplacer le contenu actuel de App.tsx ici
  const isDirector = user?.email === "princeekpinse97@gmail.com";

  return (
    <div>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl font-semibold text-gray-800">HECM Calendar</h1>
          <div className="flex gap-4">
            {isDirector && (
              <button
                onClick={saveScheduleImage}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
              >
                Archirver
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <div >
        <Calendar />
      </div>
      {isDirector && <ScheduleArchive />}
    </div>
  );
}