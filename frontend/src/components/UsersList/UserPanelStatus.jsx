import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

export const UserPanelStatus = ({ userId, active, updateUserStatus }) => {
  const [user] = useUser();
  const [isActive, setIsActive] = useState(active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {}, [active]);

  const changeStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/${userId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${user.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setIsActive(result.data.response.enable);
      updateUserStatus(userId, result.data.enable);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  /*className={`status ${isActive ? 'Activo' : 'Inactivo'}`}*/
  return (
    <div className="p-4">
      <button
        className={`w-16 h-5 sm:w-24 sm:h-6 p-1 sm:p-2 flex items-center justify-center gap-1 sm:gap-2 rounded-full text-white font-manrope text-xs font-medium leading -4 sm:leading-5 text-center shadow-lg ${
          isActive
            ? 'bg-[#0df20d] hover:bg-[#45f945]'
            : 'bg-[#5d5d5d] hover:bg-[#454444]'
        }`}
        onClick={changeStatus}
      >
        {loading ? 'Actualizando...' : isActive ? 'Activo' : 'Inactivo'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};
