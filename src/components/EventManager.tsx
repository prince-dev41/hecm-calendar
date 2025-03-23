import { useEffect, useState } from 'react';
import { Databases, ID } from 'appwrite';
import { client } from '../config/appwrite';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId);
      const eventsWithDates = response.documents.map((event) => ({
        ...event,
        start: new Date(event.start), // Convertir en Date
        end: new Date(event.end), // Convertir en Date
      }));
      setEvents(eventsWithDates);
    } catch (error: any) {
      if (error.code === 404) {
        toast.error('Database or collection not found');
      } else {
        toast.error('Failed to fetch events');
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
    createEvent,
    updateEvent,
    deleteEvent,
  };
};