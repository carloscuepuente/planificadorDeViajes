import { useState } from 'react';
import { ConfirmDeleteModal } from '../../ConfirmDeleteModal/ConfirmDeleteModal';

function DeleteFavoriteButton({ flightId, user, onRemove }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/flights/favoritos/${flightId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: user.token, // Incluye el token del usuario
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar el vuelo de favoritos');
      }

      // Llama a la función pasada como prop para actualizar la lista en el componente padre
      onRemove(flightId);
    } catch (error) {
      console.error('Error al eliminar el vuelo de favoritos:', error);
      alert('No se pudo eliminar el vuelo de favoritos. Inténtalo de nuevo.');
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="inline-flex items-center px-3 py-2 text-sm font-medium"
        onClick={handleDeleteClick}
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-gray-200 hover:text-orange-500 transition duration-150 focus:text-red-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
          />
        </svg>
      </button>
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
      >
        <p className="mt-0 mb-3 text-gray-900 font-bold">
          El vuelo se eliminará de la lista, ¿desea continuar?
        </p>
      </ConfirmDeleteModal>
    </>
  );
}

export default DeleteFavoriteButton;
