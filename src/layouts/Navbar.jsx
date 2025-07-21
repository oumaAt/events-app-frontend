import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import useDarkMode from '../hooks/useDarkMode';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-lg fixed w-full z-10 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-gray-300 transition-colors dark:text-gray-50 dark:hover:text-gray-300"
        >
          Plateforme de Gestion des événements
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-gray-300 p-2 rounded-full transition duration-200 ease-in-out hover:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-950 focus:ring-white"
            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.325 3.325l-.707.707M6.364 6.364l-.707-.707m12.728 0l-.707.707M6.364 17.636l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>

          {token && (
            <>
              <Link
                to="/events"
                className="hover:text-gray-300 transition-colors px-3 py-1 rounded dark:hover:text-gray-100"
              >
                Événements
              </Link>
              <Link
                to="/dashboard"
                className="hover:text-gray-300 transition-colors px-3 py-1 rounded dark:hover:text-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
