import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function ScheduleArchive() {
  const { getArchivedSchedules } = useAuth();
  const [archives, setArchives] = useState<string[]>([]);

  useEffect(() => {
    loadArchives();
  }, []);

  const getDownloadUrl = (fileId: string) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/67cd70ba000d8398d389/files/${fileId}/download?project=67cd6cbb00384883a744`;
  };

  const loadArchives = async () => {
    console.log("1. Début du chargement des archives");
    const urls = await getArchivedSchedules();
    console.log("2. URLs reçues:", urls);
    setArchives(urls);
    console.log("3. État archives mis à jour:", urls);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Archives des emplois du temps</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* {console.log("4. Rendu avec archives:", archives)} */}
        {archives.map((url, index) => {
          const fileId = url.split('/files/')[1]?.split('/')[0];
          console.log(`5. Traitement de l'URL ${index}:`, url);
          return (
            <div key={index} className="border rounded-lg p-2">
              <img 
                src={url} 
                alt={`Archive ${index + 1}`} 
                className="w-full"
                onError={(e) => console.error(`6. Erreur de chargement image ${index}:`, e)}
              />
              <a 
                href={fileId ? getDownloadUrl(fileId) : '#'}
                download={`schedule-${index + 1}.png`}
                className="mt-2 block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Télécharger
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}