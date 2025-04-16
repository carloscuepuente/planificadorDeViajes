import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Crea la instancia de navigate

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const lastName = e.target.lastName.value;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validación de contraseñas
    if (password !== confirmPassword) {
      toast.error(t('passwordMismatch'), {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, lastName, username, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsSuccessModalOpen(true);
      } else {
        toast.error(data.message || t('registrationError'), {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error(error || t('serverError'), {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/login'); // Usamos navigate en lugar de history.push
  };

  return (
    <>
      <div className="flex items-center justify-center m-h-screen w-screen bg-cover bg-center bg-[#9AA5BC] text-white">
        <div
          className="bg-black bg-opacity-50 p-10 mt-[85px] sm:mt-36 rounded-lg shadow-lg w-[500px] text-center"
          style={{ backgroundImage: `url('/fondoLogin.png')` }}
        >
          <h2 className="text-2xl font-bold mb-6">
            {t('formRegister.createAccount')}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between gap-4 mb-6">
              <div className="w-1/2">
                <label className="block text-lg font-semibold mb-2 text-white">
                  {t('formRegister.firstName')}
                </label>
                <input
                  className="w-full p-3 border rounded-lg bg-[#686e9e] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="name"
                  placeholder={t('formRegister.firstNamePlaceholder')}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-lg font-semibold mb-2 text-white">
                  {t('formRegister.lastName')}
                </label>
                <input
                  className="w-full p-3 border rounded-lg bg-[#686e9e] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="lastName"
                  placeholder={t('formRegister.lastNamePlaceholder')}
                  required
                />
              </div>
            </div>

            <label className="block text-lg font-semibold mb-2 text-white">
              {t('formRegister.username')}
            </label>
            <input
              className="w-full p-3 mb-4 border rounded-lg bg-[#686e9e] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="username"
              placeholder={t('formRegister.usernamePlaceholder')}
              required
            />

            <label className="block text-lg font-semibold mb-2 text-white">
              {t('formRegister.email')}
            </label>
            <input
              className="w-full p-3 mb-4 border rounded-lg bg-[#686e9e] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              placeholder={t('formRegister.emailPlaceholder')}
              required
            />

            <label className="block text-lg font-semibold mb-2 text-white">
              {t('formRegister.password')}
            </label>
            <div className="relative mb-4">
              <input
                className="w-full p-3 border rounded-lg bg-[#686e9e] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('formRegister.passwordPlaceholder')}
                required
              />
              <span
                className="absolute right-5 top-2 text-xl text-gray-400 cursor-pointer"
                onClick={handlePasswordVisibility}
              >
                {showPassword ? '🙉' : '🙈'}
              </span>
            </div>

            <label className="block text-lg font-semibold mb-2 text-white">
              {t('formRegister.confirmPassword')}
            </label>
            <div className="relative mb-4">
              <input
                className="w-full p-3 border rounded-lg bg-[#686e9e] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder={t('formRegister.confirmPasswordPlaceholder')}
                required
              />
              <span
                className="absolute right-5 top-2 text-xl text-gray-400 cursor-pointer"
                onClick={handlePasswordVisibility}
              >
                {showPassword ? '🙉' : '🙈'}
              </span>
            </div>

            <button
              type="submit"
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
            >
              {t('formRegister.register')}
            </button>
          </form>

          <p className="mt-6 text-sm">
            {t('formRegister.alreadyHaveAccount')}{' '}
            <a
              href="/login"
              className="text-[#046ef8] font-semibold hover:underline"
            >
              {t('formRegister.login')}
            </a>
          </p>
        </div>
      </div>

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {t('formRegister.success')}
            </h2>
            <p className="mb-6 text-gray-700 text-base">
              {t('formRegister.successMessage')}
            </p>
            <button
              onClick={handleSuccessModalClose}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out"
            >
              {t('formRegister.goToLogin')}
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Register;
