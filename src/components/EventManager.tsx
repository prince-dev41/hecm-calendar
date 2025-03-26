import { useEffect, useState } from 'react';
import { Databases, ID, Query  } from 'appwrite';
import { client } from '../config/appwrite';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
interface ClassEvent {
  id: string;
  courseName: string;
  professor: string;
  room: string;
  start: string; // Stocké sous forme de chaîne
  end: string; // Stocké sous forme de chaîne
  color: string;
  description?: string;
  fields?: string[]; // Champ optionnel
}

const databases = new Databases(client);

const databaseId = '67e0001a0020f7637c3b'; // Remplacez par l'ID de votre base de données
const collectionId = '67e0003e00290c467a6b'; // Remplacez par l'ID de votre collection

export const EventManager = () => {
  const [events, setEvents] = useState<ClassEvent[]>([]);
  const {  user } = useAuth();
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const isDirector = user?.email === "princeekpinse97@gmail.com" || "boscorethice5@gmail.com";
    const savedFields = localStorage.getItem(isDirector ? 'directorSelectedFields' : 'nonDirectorSelectedField');
    
    // Vérification plus stricte des champs sélectionnés
    if (!savedFields || (isDirector && JSON.parse(savedFields).length === 0)) {
      toast.error('Aucune filière sélectionnée');
      return;
    }

    try {
      let queries: string[] = [];
      if (isDirector) {
        const fields = JSON.parse(savedFields);
        // Vérification supplémentaire pour s'assurer que le tableau n'est pas vide
        if (fields.length > 0) {
          queries = [Query.equal('fields', fields)];
        }
      } else {
        queries = [Query.equal('fields', savedFields)];
      }

      // Si aucune requête n'a été construite, on ne fait pas la requête
      if (queries.length === 0) {
        return;
      }

      const response = await databases.listDocuments(
        databaseId, 
        collectionId, 
        queries
      );

      const eventsWithDates = response.documents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setEvents(eventsWithDates);
    } catch (error: any) {
      if (error.code === 404) {
        toast.error('Base de données ou collection introuvable');
      } else {
        toast.error('Échec de la récupération des événements');
      }
      console.error(error);
    }
  };
  const createEvent = async (eventData: ClassEvent) => {
    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), eventData);
      toast.success('Event created successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<ClassEvent>) => {
    try {
      await databases.updateDocument(databaseId, collectionId, eventId, eventData);
      toast.success('Cours modifié avec succès');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event');
      console.error(error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await databases.deleteDocument(databaseId, collectionId, eventId);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    events,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};