import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { TrashIcon } from '@heroicons/react/16/solid';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal/ConfirmDeleteModal';
export const UserDelete = ({ userId, setUserList }) => {
  const [user] = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `${user.token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setUserList((prevList) => prevList.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar el usuario', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        id="trash"
        className=" w-6 h-6 p-1 mt-2.5 m-0 gap-0 bg-[#7278a4] text-[#252a31] rounded-full transition-transform transform hover:scale-150"
        onClick={handleDeleteClick}
        disabled={loading}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      {error && <div className="text-red-700 text-sm mt-2">{error}</div>}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={deleteUser}
      >
        <p className="mt-4 mb-3 text-gray-900">
          El usuario se eliminará, ¿desea continuar?
        </p>
      </ConfirmDeleteModal>
    </div>
  );
};
