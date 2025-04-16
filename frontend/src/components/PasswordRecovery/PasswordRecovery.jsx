import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PasswordRecovery() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/password/recover`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Correo de recuperación enviado.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al enviar la solicitud.', {
          position: 'bottom-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`Ocurrió un error: ${error.message}`, {
        position: 'bottom-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#9AA5BC] text-white">
      <div
        className="bg-black bg-opacity-50 p-10 rounded-lg shadow-lg w-[500px] text-center bg-cover bg-center"
        style={{ backgroundImage: `url('/fondoLogin.png')` }}
      >
        <h2 className="text-2xl font-bold mb-6">RECUPERAR CONTRASEÑA</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-semibold mt-10 mb-2 text-white">
            EMAIL
          </label>
          <input
            className="placeholder:text-gray-300 w-full p-3 mb-4 border rounded-lg bg-[#686e9e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo..."
            required
          />
          <button
            type="submit"
            className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-lg transition"
          >
            Enviar
          </button>
        </form>

        <p className="mt-20 text-sm">
          ¿Recuerdas tu contraseña?{' '}
          <a
            href="/login"
            className="text-[#046ef8] font-semibold text-lg hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PasswordRecovery;
