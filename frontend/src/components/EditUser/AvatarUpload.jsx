import { useState, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { useTranslation } from 'react-i18next'; // Importamos useTranslation

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }) => {
  const { t } = useTranslation(); // Usamos useTranslation para obtener las traducciones

  // Estado para controlar si el modal está abierto.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para almacenar el archivo seleccionado.
  const [selectedFile, setSelectedFile] = useState(null);

  // Estado para almacenar la URL de vista previa de la imagen.
  const [previewUrl, setPreviewUrl] = useState(null);

  // Referencia al input de archivo para disparar el selector de archivos.
  const fileInputRef = useRef(null);

  // Estado para obtener el usuario desde el contexto.
  const [user] = useUser();

  // Estado para mostrar mensajes al usuario (éxito o error).
  const [message, setMessage] = useState({ text: '', type: '' });

  // Función para abrir el modal al hacer clic en el avatar.
  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  // Maneja la selección de un archivo desde el input.
  const handleFileSelect = (event) => {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado.
    if (file) {
      // Verifica si el archivo es una imagen.
      if (!file.type.match('image.*')) {
        setMessage({
          text: t('selectFileError'), // Utilizamos la traducción aquí
          type: 'error',
        });
        return;
      }

      // Crea una URL de vista previa para mostrar la imagen seleccionada.
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Actualiza el archivo seleccionado en el estado.
      setSelectedFile(file);
    }
  };

  // Maneja la subida del avatar al servidor.
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({
        text: t('selectFile'), // Utilizamos la traducción aquí
        type: 'error',
      });
      return;
    }

    const formData = new FormData(); // Crea un FormData para enviar el archivo.
    formData.append('avatar', selectedFile);

    try {
      const token = user?.token; // Obtiene el token del contexto de usuario.
      if (!token) {
        setMessage({
          text: t('errorAvatarUpdate'), // Utilizamos la traducción aquí
          type: 'error',
        });
        return;
      }

      // Realiza la solicitud para subir el avatar.

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        setMessage({ text: t('errorAvatarUpdate'), type: 'error' });
        return;
      }

      const data = await response.json();

      if (data.status === 'ok') {
        setMessage({
          text: t('successAvatarUpdate'), // Utilizamos la traducción aquí
          type: 'success',
        });
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setIsModalOpen(false);
        setSelectedFile(null);
        onAvatarUpdate && onAvatarUpdate(data.data.avatar); // Notifica al componente padre.
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: t('errorServerConnection'), type: 'error' }); // Utilizamos la traducción aquí
    }
  };

  // Dispara el selector de archivos de manera programada.
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {/* Contenedor del avatar */}
      <div onClick={handleAvatarClick} className="cursor-pointer">
        <div className="w-[200px] sm:w-[290px] h-[200px] sm:h-[290px] rounded-full overflow-hidden bg-white flex justify-center items-center">
          {/* Muestra la imagen del avatar */}
          <img
            src={previewUrl || currentAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Modal para editar el avatar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-full sm:max-w-2xl w-full relative">
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="w-full sm:w-[400px] h-[250px] sm:h-[400px] rounded-lg overflow-hidden bg-gray-100">
                {/* Vista previa del avatar */}
                <img
                  src={previewUrl || currentAvatar}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={triggerFileInput}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#F66136] text-white font-bold rounded-full hover:bg-[#e25630] text-xs sm:text-base"
                >
                  {t('selectImage')} {/* Traducción para el botón */}
                </button>
                {selectedFile && (
                  <button
                    onClick={handleUpload}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 text-xs sm:text-base"
                  >
                    {t('save')} {/* Traducción para el botón */}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Muestra el mensaje si existe */}
      {message.text && (
        <p
          className={`text-xs sm:text-sm font-bold mt-2 text-center ${
            message.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}
    </>
  );
};

export default AvatarUpload;
