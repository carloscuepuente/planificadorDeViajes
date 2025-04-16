import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PasswordReset() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.', {
        position: 'bottom-center',
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/password/${code}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recoverPassCode: code, newPassword }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Contraseña actualizada con éxito.', {
          position: 'bottom-right',
        });

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al actualizar la contraseña.', {
          position: 'bottom-center',
        });
      }
    } catch (error) {
      toast.error('Ocurrió un error: ' + error.message, {
        position: 'bottom-center',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#9AA5BC] text-white">
      <div
        className="bg-black bg-opacity-50 p-10 rounded-lg shadow-lg w-[500px] text-center bg-cover bg-center"
        style={{ backgroundImage: `url('/fondoLogin.png')` }}
      >
        <h2 className="text-2xl font-bold mb-6">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-semibold mt-10 mb-2 text-white">
            Nueva Contraseña:
          </label>
          <input
            className="placeholder:text-gray-300 w-full p-3 mb-4 border rounded-lg bg-[#686e9e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingrese su nueva contraseña"
            required
          />
          <label className="block text-lg font-semibold mt-4 mb-2 text-white">
            Repetir Nueva Contraseña:
          </label>
          <input
            className="placeholder:text-gray-300 w-full p-3 mb-4 border rounded-lg bg-[#686e9e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme su nueva contraseña"
            required
          />
          <button
            type="submit"
            className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-lg transition"
          >
            Restablecer Contraseña
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PasswordReset;
