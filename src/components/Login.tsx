import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function Login() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="bg-white/90  p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 transform hover:scale-100 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <Calendar className="w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 text-center">H Calendar</h1>
          <p className="text-gray-600 mt-2 text-center">
            Gérez vos emplois du temps plus facilement
          </p>
          <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 flex items-center justify-center group hover:border-blue-500"
        >
          <svg className="w-6 h-6 mr-3 text-blue-500" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="group-hover:scale-105 transition-transform duration-200">
            Connexion avec Google
          </span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Version 1.0.0</p>
          <p className="mt-2">© {new Date().getFullYear()} H Calendar. Tous droits réservés.</p>
          <p className="mt-2">
            Crée avec ❤️ by{' '}
            <a 
              href="https://github.com/prince-dev41" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              @prince-dev41
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}