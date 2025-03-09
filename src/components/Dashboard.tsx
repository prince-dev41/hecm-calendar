import { useAuth } from '../contexts/AuthContext';
import Calendar from './Calendar';  // On va déplacer le contenu actuel de App.tsx ici
import { ScheduleArchive } from './ScheduleArchive';

export function Dashboard() {
  const { logout, saveScheduleImage, user } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com"; // À adapter

  return (
    <div>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl font-semibold text-gray-800">HECM Class Schedule</h1>
          <div className="flex gap-4">
            {isDirector && (
              <button
                onClick={saveScheduleImage}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
              >
                Archiver l'emploi du temps
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
      <div id="calendar-container">
        <Calendar />
      </div>
      {isDirector && <ScheduleArchive />}
    </div>
  );
}