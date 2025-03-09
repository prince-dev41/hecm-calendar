import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, BUCKET_ID, account } from '../config/appwrite';
import { ID, Models } from 'appwrite';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveScheduleImage: () => Promise<void>;
  getArchivedSchedules: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      console.error('Session error:', error);
      setUser(null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await account.createOAuth2Session(
        'google',
        'http://localhost:5173/dashboard',
        'http://localhost:5173/login'
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
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const saveScheduleImage = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder');
      return;
    }

    try {
      const calendarElement = document.getElementById('calendar-container');
      if (!calendarElement) {
        console.error('Élément calendar-container non trouvé');
        return;
      }

      const canvas = await html2canvas(calendarElement,{ width: 1370, scale: 1});
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const file = new File([blob], `schedule-${Date.now()}.png`, { type: 'image/png' });
      
      await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );

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
      signInWithGoogle, 
      logout,
      saveScheduleImage,
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