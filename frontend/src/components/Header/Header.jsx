import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import LanguageNav from './LanguageNav/LanguageNav';
import LogoutButton from '../Logout/LogoutButton';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user] = useUser(); // Obtén el estado del usuario

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-custom-blue bg-opacity-75 text-white p-2 w-full h-20 fixed top-0 left-0 z-50 shadow-md">
      <div className="flex justify-between items-center w-full gap-8">
        <div className="flex justify-start items-center gap-1">
          <img className="w-10 rounded-xl" src="/witch2.svg" alt="ico" />
          <h1 className="text-3xl font-bold">
            <span className="text-orange-500">W</span>onder
            <span className="text-orange-500">F</span>ly
          </h1>

                    <div className="flex justify-center gap-6 ml-10">
                        <Link to="/search" className="text-white hover:text-orange-500 transition-colors">Vuelos</Link>
                        <a href="/about" className="text-white hover:text-orange-500 transition-colors">Favoritos</a>
                    </div>
                </div>

        {/* Menú de idiomas y opciones de cuenta */}
        <nav className="flex justify-center items-center relative">
          <LanguageNav />

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex font-bold h-10 text-white hover:text-gray-300 hover: transition-colors bg-orange-500 rounded-xl p-2"
            >
              Mi cuenta
            </button>

            {/* Menú desplegable */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                {/* Mostrar solo si el usuario no está logueado */}
                {!user ? (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Iniciar sesión
                    </a>
                    <a
                      href="/register"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Registrarse
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/edituser"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      editar usuario
                    </a>
                    <LogoutButton />
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
