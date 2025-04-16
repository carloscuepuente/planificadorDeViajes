import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AccountActivation() {
  const { registrationCode } = useParams();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook para traducciones

  const activateAccount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/validate/${registrationCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setStatus(t('accountActivated')); // Usamos la clave de traducción
          toast.success('Cuenta activada correctamente', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          setStatus(t('accountActivationError')); // Usamos la clave de traducción
        }
      } else {
        setStatus(t('serverConnectionError')); // Usamos la clave de traducción
      }
    } catch (error) {
      setStatus(t('accountActivationError')); // Usamos la clave de traducción
      console.error(error);
    }
  };

  useEffect(() => {
    activateAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-custom-blue text-white p-6 rounded-lg shadow-xl w-11/12 max-w-sm text-center relative">
          <h2 className="text-2xl font-semibold mb-4">
            {status ? (
              status === 'Cuenta activada correctamente' ? (
                <span>
                  Ahora ya puedes iniciar sesión y empezar a usar{' '}
                  <span className="font-bold text-white">
                    <span className="text-orange-500">W</span>onder
                    <span className="text-orange-500">F</span>ly
                  </span>
                </span>
              ) : (
                status
              )
            ) : (
              t('loading')
            )}
          </h2>

          <button
            onClick={closeModal}
            className="top-1 right-2 absolute text-white py-2 px-3 rounded-full mt-0 hover:text-orange-500 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default AccountActivation;
