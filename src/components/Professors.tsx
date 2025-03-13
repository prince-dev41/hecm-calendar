import { useState } from 'react';
import { Plus, X, Trash2, Edit3, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';

interface Professor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export function Professors() {
  const { user } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com";
  const [professors, setProfessors] = useState<Professor[]>(() => {
    const savedProfessors = localStorage.getItem('professors');
    return savedProfessors ? JSON.parse(savedProfessors) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newProfessor, setNewProfessor] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleCreateOrUpdateProfessor = () => {
    if (newProfessor.name.trim() === '') {
      toast.error('Le nom du professeur est requis');
      return;
    }

    const professorData: Professor = {
      id: isEditMode ? selectedProfessor!.id : Math.random().toString(36).substr(2, 9),
      name: newProfessor.name,
      ...(newProfessor.email && { email: newProfessor.email }),
      ...(newProfessor.phone && { phone: newProfessor.phone })
    };

    setProfessors(prevProfessors => {
      const updatedProfessors = isEditMode
        ? prevProfessors.map(prof => prof.id === selectedProfessor!.id ? professorData : prof)
        : [...prevProfessors, professorData];
      localStorage.setItem('professors', JSON.stringify(updatedProfessors));
      return updatedProfessors;
    });

    toast.success(isEditMode ? 'Professeur modifié avec succès' : 'Professeur ajouté avec succès');
    closeModal();
  };

  const handleDeleteProfessor = (professorId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      setProfessors(prevProfessors => {
        const updatedProfessors = prevProfessors.filter(prof => prof.id !== professorId);
        localStorage.setItem('professors', JSON.stringify(updatedProfessors));
        return updatedProfessors;
      });
      toast.success('Professeur supprimé avec succès');
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfessor(null);
    setIsEditMode(false);
    setNewProfessor({
      name: '',
      email: '',
      phone: ''
    });
  };

  const handleEditProfessor = (professor: Professor) => {
    setSelectedProfessor(professor);
    setNewProfessor({
      name: professor.name,
      email: professor.email || '',
      phone: professor.phone || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  
  const { logout } = useAuth();  // On va déplacer le contenu actuel de App.tsx ici

  // if (!isDirector) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-white">
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
  
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16">
          {/* Add the new sub-header here */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800"> {isDirector ? "Gestion des Professeurs" :  "Vos professeurs"} </h2>
              {isDirector && (<button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un professeur
              </button>)}
            </div>
          </div>
  
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professors.map(professor => (
                <div
                  key={professor.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <h3 className="font-semibold text-gray-800">{professor.name}</h3>
                    </div>
                    <button
                      onClick={() => handleEditProfessor(professor)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {professor.email && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {professor.email}
                    </div>
                  )}
                  {professor.phone && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {professor.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-[480px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                {isEditMode ? (
                  <>
                    <Edit3 className="w-5 h-5 mr-2 text-gray-600" />
                    Modifier le professeur
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2 text-gray-600" />
                    Ajouter un nouveau professeur
                  </>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du professeur *
                </label>
                <input
                  type="text"
                  placeholder="Entrez le nom du professeur"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProfessor.name}
                  onChange={(e) => setNewProfessor(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  placeholder="Entrez l'email du professeur"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProfessor.email}
                  onChange={(e) => setNewProfessor(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  placeholder="Entrez le numéro de téléphone"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProfessor.phone}
                  onChange={(e) => setNewProfessor(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreateOrUpdateProfessor}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  {isEditMode ? (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Mettre à jour
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </>
                  )}
                </button>
                {isEditMode && (
                  <button
                    onClick={() => handleDeleteProfessor(selectedProfessor!.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}