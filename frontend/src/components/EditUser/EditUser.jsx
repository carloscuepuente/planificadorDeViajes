import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import AvatarUpload from './AvatarUpload';
import UserForm from './UserForm';
import avatar from '../../assets/avatar.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUser = () => {
  // Estados del componente
  const [avatarAct, setAvatarAct] = useState(avatar);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtiene el usuario del contexto
  const [user] = useUser();

  // Efecto para cargar los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const token = user?.token;
      const email = user?.email;

      if (!token || !email) {
        toast.error('Usuario no autenticado', {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/users/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ email }),
        });

        const responseData = await response.json();

        if (responseData.status === 'ok') {
          const userData = responseData.data;
          setUserData(userData);
          setAvatarAct(`http://localhost:3001/uploads/${userData.avatar}`);
          setLoading(false);
        } else {
          toast.error(responseData.message || 'Error al obtener datos', {
            position: "top-right",
            autoClose: 3000,
          });
          setLoading(false);
        }
      } catch {
        toast.error('Error al conectar con el servidor', {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Manejadores de eventos
  const handleFormSubmit = async (formData) => {
    try {
      const token = user?.token;
      const response = await fetch(`http://localhost:3001/users/edit/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Datos actualizados correctamente', {
          position: "bottom-center",
          autoClose: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al actualizar los datos', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch {
      toast.error('Error al conectar con el servidor', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setAvatarAct(`http://localhost:3001/uploads/${newAvatarUrl}`);
  };

  // Renderizado condicional de carga
  if (loading) {
    return <p className="text-white text-center">Cargando datos...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#9AA5BC] p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <h1 className="text-white mt-20 sm:mt-10 md:mt-20 text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-center">
        Configuración de la Cuenta
      </h1>
      
      <div className="flex flex-col sm:flex-row justify-center items-start gap-4 sm:gap-8 w-full max-w-4xl">
        {/* Avatar */}
        <div className="flex flex-col items-center bg-[#686E9E] p-4 sm:p-20 rounded-lg w-full sm:w-[350px] mb-4 sm:mb-0">
          <p className="text-white text-sm sm:text-base font-bold mb-2 sm:mb-4 text-center">Foto de perfil</p>
          <AvatarUpload
            currentAvatar={avatarAct}
            onAvatarUpdate={handleAvatarUpdate}
          />
          <p className="text-white text-xs sm:text-sm font-bold mt-4 sm:mt-10 text-center">
            Agrega tu foto de perfil o avatar favorito
          </p>
        </div>

        {/* Datos personales */}
        <div className="flex flex-col bg-[#686E9E] p-4 sm:p-7 rounded-lg w-full sm:w-[450px]">
          <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-1 text-center">
            Datos personales
          </h3>
          <UserForm 
            initialData={userData} 
            setAvatarAct={setAvatarAct} 
            onSubmit={handleFormSubmit} 
          />
        </div>
      </div>
    
      <button
        type="button"
        className="mt-4 sm:mt-8 px-4 sm:px-6 py-2 bg-[#F20D11] text-white font-bold text-sm sm:text-base rounded-full hover:bg-[#d10b0e]"
      >
        ELIMINAR PERFIL
      </button>
    </div>
  );
};

export default EditUser;
