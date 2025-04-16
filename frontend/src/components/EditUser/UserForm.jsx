import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UserForm = ({ initialData, setAvatarAct, onSubmit }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [editableFields, setEditableFields] = useState({});
  const [message] = useState({ text: '', type: '' });

  // Actualiza los datos del formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        lastName: initialData.lastName || '',
        username: initialData.username || '',
        email: initialData.email || '',
        password: '',
      });

      // Si hay un avatar, actualiza el avatar en el padre
      if (initialData.avatar) {
        setAvatarAct(
          `${import.meta.env.VITE_API_URL}/uploads/${initialData.avatar}`
        );
      }
    }
  }, [initialData, setAvatarAct]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:gap-4 w-full"
    >
      {['name', 'lastName', 'username', 'email', 'password'].map((field) => (
        <div key={field} className="flex flex-col gap-1 sm:gap-2 w-full">
          <label
            htmlFor={field}
            className="text-white text-xs sm:text-sm font-bold"
          >
            {t(field.charAt(0).toUpperCase() + field.slice(1))}{' '}
            {/* Traducción dinámica */}
          </label>
          <div className="flex items-center w-full">
            <input
              type={field === 'password' ? 'password' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              readOnly={!editableFields[field]}
              className="w-full px-3 sm:px-12 py-1 sm:py-2 bg-[#9AA5BC] text-black font-bold rounded-lg focus:outline-none text-xs sm:text-base"
            />
            <button
              type="button"
              onClick={() => handleEditClick(field)}
              className="ml-2 sm:ml-3 text-blue-500 hover:text-blue-300 text-xs sm:text-base"
            >
              ✏
            </button>
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="
          mt-2 sm:mt-4 
          px-4 sm:px-5 
          py-2 
          bg-[#ff5a1f]
          text-white 
          font-bold 
          text-xs sm:text-sm 
          rounded-lg 
          hover:bg-orange-600
          w-full
        "
      >
        {t('saveChanges')} {/* Traducción del botón */}
      </button>

      {message.text && (
        <p
          className={`mt-2 text-xs sm:text-sm font-bold text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
        >
          {message.type === 'success' ? t('successUpdate') : t('errorUpdate')}{' '}
          {/* Mensaje de éxito o error */}
        </p>
      )}
    </form>
  );
};

export default UserForm;
