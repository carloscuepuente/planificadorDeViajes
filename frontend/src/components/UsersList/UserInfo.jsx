//import { Accordion } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

export const UserInfo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const wonderUser = useFetch(`${import.meta.env.VITE_API_URL}/admin/users`);

  useEffect(() => {
    if (wonderUser && wonderUser.data && Array.isArray(wonderUser.data.users)) {
      const foundUser = wonderUser.data.users.find(
        (u) => u.id === parseInt(id)
      );
      if (foundUser) {
        setUser(foundUser);
        setLoading(false);
      } else {
        setError('Usuario no encontrado');
        setLoading(false);
      }
    }
  }, [wonderUser, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading user info</p>;
  if (!user) return <p>No existen datos de este usuario</p>;
  //const [isOpen, setIsOpen] = useState(false);

  // const toggleAccordion = () => {
  //   setIsOpen(!isOpen);
  // };
  const avatarUrl = `${import.meta.env.VITE_API_URL}/users/getAvatar/${id}`;
  return (
    <div className="mt-20 mb-10 top-5 p-5 rounded-2xl w-full max-w-xs sm:max-w-md mx-auto relative bg-[#7278a4]">
      <h1 className="text-center bg-[#515a9b] text-white font-manrope text-base sm:text-lg font-bold">
        {user.username}
      </h1>
      <img src={avatarUrl} className="rounded-full w-24 h-24 sm:w-32 sm:h-32" />
      <div className="mt-4 text-left text-[#252a31] font-semibold">
        <p>Email: {user.email}</p>
        <p>Name: {user.name}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Active Since: {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>

    //     <Accordion>
    //       <Accordion.Panel>
    //         <Accordion.Title>
    //         <button className='info' onClick={toggleAccordion}>ℹ️
    //         {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
    //   <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z" clipRule="evenodd" />
    // </svg>*/}

    //         </button>
    //         </Accordion.Title>
    //         {isOpen && (
    //           <Accordion.Content>
    //             <p> Username: {user.username} </p>
    //             <p>Email: {user.email}</p>
    //             <p>Name: {user.name}</p>
    //             <p>Last Name: {user.lastName}</p>
    //             <p>Avatar: {user.avatar}</p>
    //             <p>Created At: {user.createdAt}</p>
    //           </Accordion.Content>
    //         )}

    //       </Accordion.Panel>
    //     </Accordion>
  );
};
