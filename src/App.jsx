import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                <LoginPage />
              </div>
            }
          />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="*"
            element={
              <div className="text-center text-red-500 text-2xl p-8">
                404 - Page Non Trouvée <br />
                <Link
                  to="/"
                  className="text-blue-600 hover:underline mt-4 block"
                >
                  Retour à l'accueil
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4 text-center">
        &copy; 2025 EventApp
      </footer>
    </div>
  );
}

export default App;
