import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); 
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">EventApp</Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/events" className="hover:text-gray-300 transition-colors px-3 py-1 rounded" aria-label="Voir les événements">Événements</Link>
              <Link to="/dashboard/stats" className="hover:text-gray-300 transition-colors px-3 py-1 rounded" aria-label="Voir les statistiques">Statistiques</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Déconnexion"
              >
                Déconnexion
              </button>
            </>
          ) : (
            null
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;