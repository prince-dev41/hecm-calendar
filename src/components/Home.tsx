import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {/* Section d'accueil */}
      <section className="flex flex-col items-center justify-center py-20">
        <Calendar className="w-24 h-24 text-white mb-6" />
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur H Calendar</h1>
        <p className="text-lg mb-8 text-center max-w-xl">
          Simplifiez la gestion des emplois du temps pour les établissements éducatifs. Rejoignez-nous pour révolutionner la manière dont les écoles gèrent leurs horaires.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          Commencer
        </button>
      </section>

      {/* Section des fonctionnalités */}
      <section className="py-20 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <Calendar className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interface Intuitive</h3>
              <p className="text-center">
                Interface facile à utiliser pour gérer les horaires avec une fonctionnalité de glisser-déposer.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mises à jour en temps réel</h3>
              <p className="text-center">
                Gardez tout le monde informé avec des mises à jour et notifications en temps réel.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accès sécurisé</h3>
              <p className="text-center">
                Connexion sécurisée et gestion des données avec authentification Google.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personnalisable</h3>
              <p className="text-center">
                Adaptez l'application aux besoins uniques de votre établissement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section des témoignages */}
      <section className="py-20 bg-gray-100 text-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Témoignages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-center">
                "H Calendar a transformé la façon dont nous gérons nos horaires. C'est intuitif et efficace !"
              </p>
              <p className="text-right mt-4">- Directeur d'école</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-center">
                "Les mises à jour en temps réel gardent tout le monde informé et sur la bonne voie. Je recommande vivement !"
              </p>
              <p className="text-right mt-4">- Professeur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section du formulaire de contact */}
      <section className="py-20 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Contactez-nous</h2>
          <form className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nom de l'école"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email de contact"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Message"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}