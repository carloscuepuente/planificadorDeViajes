import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { TrashIcon } from '@heroicons/react/16/solid';
export const RatingDelete = ({ id }) => {
  const [user] = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRate = async () => {
    if (!window.confirm('va a eliminar su valoracion, desea continuar?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${user.token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.error('Error al eliminar la valoracion', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        id="trash"
        className=" w-6 h-6 p-1 mt-2.5 m-0 gap-0 bg-[#7278a4] text-[#252a31] rounded-full transition-transform transform hover:scale-150"
        onClick={deleteRate}
        disabled={loading}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      {error && <div className="text-red-700 text-sm mt-2">{error}</div>}
    </div>
  );
};
