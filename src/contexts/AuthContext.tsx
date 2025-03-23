import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, BUCKET_ID, account } from '../config/appwrite';
import { ID, Models } from 'appwrite';
import toast from 'react-hot-toast';
import { Databases } from 'appwrite'; // Import Databases from Appwrite

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;  // Add this
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveScheduleData: () => Promise<void>;
  getArchivedSchedules: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(() => {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setIsLoading(false);
        return;
      }

      const userData = await account.get();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Session error:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const BASE_URL = window.location.origin;
  
  const signInWithGoogle = async () => {
    try {
      await account.createOAuth2Session(
        'google',
        `${BASE_URL}/dashboard`,
        `${BASE_URL}/login`
      );
      await checkSession();
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
    toast.success('Connexion réussie');
  };

  const logout = async () => {
    try {
      await account.deleteSessions();
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const saveScheduleData = async (weekClasses: any[]) => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder');
      return;
    }

    try {
      const databases = new Databases(client); // Initialize the Databases instance
      const databaseId = '67cd6cf6000deb755f61'; // Replace with your actual database ID
      const collectionId = '67d6b8f50029ee11fbf4'; // Replace with your actual collection ID

      // Iterate over the classes and save each one to the database
      for (const classData of weekClasses) {
        await databases.createDocument(databaseId, collectionId, ID.unique(), classData);
      }

      toast.success('Emploi du temps sauvegardé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      throw error;
    }
  };

  const getArchivedSchedules = async () => {
    if (!user) {
      console.error('Utilisateur non connecté');
      return [];
    }

    try {
      const response = await storage.listFiles(BUCKET_ID);
      console.log("1. Liste des fichiers récupérée:", response.files);
      
      const urls = await Promise.all(
        response.files.map(async (file) => {
          console.log("2. Traitement du fichier:", file.$id);
          try {
            const fileData = await storage.getFile(BUCKET_ID, file.$id);
            console.log("3. Données du fichier récupérées:", fileData);
            
            const viewUrl = storage.getFileView(BUCKET_ID, file.$id);
            console.log("4. URL de prévisualisation générée:", viewUrl);
            
            const finalUrl = viewUrl;
            console.log("5. URL finale:", finalUrl);
            
            return finalUrl;
          } catch (error) {
            console.error(`6. Erreur pour le fichier ${file.$id}:`, error);
            return null;
          }
        })
      );

      console.log("7. Toutes les URLs récupérées:", urls);
      const filteredUrls = urls.filter((url): url is string => url !== null);
      console.log("8. URLs filtrées:", filteredUrls);
      
      return filteredUrls;
    } catch (error) {
      console.error('9. Erreur générale:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      signInWithGoogle, 
      logout,
      saveScheduleData, // Update the function name in the context
      getArchivedSchedules 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};