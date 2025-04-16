import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { UsersPanel } from './UsersPanel';
import logoUsers from '../../assets/logoUsers.png';
export const UsersList = () => {
  const [user] = useUser();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getList = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const content = await res.json();
      setUserList(content.data.users || []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      getList();
    } else {
      setLoading(false);
      setError('Usuario no autorizado');
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      id="panel"
      className="mt-20 mb-10 top-5 sm:p-3 rounded-2xl w-full max-w-[600px] mx-auto text-center relative bg-[#7278a4]"
    >
      <article className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <img className="w-10 h-10" src={logoUsers} alt="icono de personas" />
        <h2 className="text-lg font-bold leading-tight text-white underline">
          Gestion de usuarios
        </h2>
      </article>
      <UsersPanel userList={userList} setUserList={setUserList} />
    </div>
  );
};
