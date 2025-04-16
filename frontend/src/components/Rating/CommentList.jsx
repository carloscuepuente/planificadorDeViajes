// import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Modal from 'react-modal';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const CommentList = ({ comment, comments, setComments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newComment, setNewComment] = useState(comment.comment);
  const [newRating, setNewRating] = useState(comment.rating);
  const [user] = useUser();

  const token = user?.token;

  // Función para guardar los cambios de un comentario
  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/ratings/${comment.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            rating: newRating,
            comment: newComment,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('No se pudo actualizar la valoración');
      }

      const updatedComment = await res.json();
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? updatedComment : c))
      );

      // Actualizamos el comentario editado
      const updatedComments = comments.map((c) =>
        c.id === comment.id
          ? { ...c, comment: newComment, rating: newRating }
          : c
      );
      setComments(updatedComments);
      setIsEditing(false); // Cerrar modal después de guardar
      toast.success('Comentario actualizado con éxito!'); // Toast de éxito
    } catch (err) {
      console.error('Error al editar el comentario:', err);
      toast.error('Vaya! parece que tenemos un problema!. Intenta de nuevo.'); // Toast de error
    }
  };

  // Función para eliminar un comentario
  const handleDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar la valoración');
      }

      // Confirma que el back responde
      const result = await res.json();
      console.log(result.message);

      // Actualiza el estado
      setComments((prevComments) =>
        prevComments.filter((c) => c.user_id !== user.id)
      );

      setIsDeleting(false);
      toast.success('Valoración eliminada!'); // Toast de éxito
    } catch (err) {
      console.error('Error al eliminar la valoración:', err);
      toast.error('No hemos podido borrarlo!. Intentalo de nuevo.'); // Toast de error
    }
  };

  // botón "Editar"
  const handleEditClick = () => {
    setNewComment(comment.comment);
    setNewRating(comment.rating);
    setIsEditing(true);
  };

  // Función para renderizar las estrellas
  const renderStars = (currentRating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-6 h-6 cursor-pointer ${currentRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 22 20"
        onClick={() => setNewRating(index + 1)}
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.433-.767l-1.302-5.006 3.91-3.505a1.53 1.53 0 0 0 .353-1.538z" />
      </svg>
    ));
  };

  // const { t } = useTranslation();
  return (
    <div className="mt-8">
      <div className="mb-4 p-4 bg-white border rounded shadow w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center bg-zinc-200">
        <div className="flex-shrink-0 mb-4 sm:mb-0">
          <img
            src={
              comment.avatar
                ? `${import.meta.env.VITE_API_URL}/uploads/${comment.avatar}`
                : '/default-avatar.png' // imagen predeterminada
            }
            alt={`${comment.username}'s avatar`}
            className="w-20 h-20 m-5 rounded-full border-4 border-white shadow-md"
          />
        </div>

        <div className="flex flex-col mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto">
          <p>
            <strong>🧑‍💻Usuario: </strong> {comment.username}
          </p>
          <div className="flex items-center">
            <strong className="mr-2">🏅Puntuación :</strong>
            <div className="flex">{renderStars(comment.rating)}</div>
          </div>
          <p>
            <strong>💬 Comentario : </strong> {comment.comment}
          </p>
          <p>
            <strong>📅 Fecha :</strong>{' '}
            {new Date(
              comment.updated_at || comment.created_at
            ).toLocaleString()}
            {comment.updated_at &&
              comment.updated_at !== comment.created_at && (
                <span className="text-sm text-gray-500 ml-2">(updated)</span>
              )}
          </p>
        </div>

        {/* Mostrar los botones de editar y eliminar solo si el usuario es el dueño del comentario */}
        {user && comment.user_id === user.id && (
          <div className="flex-shrink-0 mt-2 ml-auto">
            <button
              onClick={handleEditClick}
              className="bg-orange-500 ml-2 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Editar
            </button>
            <button
              onClick={() => setIsDeleting(true)} // Abrimos modal eliminación
              className="bg-red-500 ml-2 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Modal para editar el comentario */}
      <Modal
        isOpen={isEditing}
        onRequestClose={() => setIsEditing(false)}
        contentLabel="Editar Comentario"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Editar Comentario</h2>
          <div className="mb-4">
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Puntuación:
            </label>
            <div className="flex space-x-2">{renderStars(newRating)}</div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comentario:
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border-2 border-gray-300 p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para confirmar la eliminación */}
      <Modal
        isOpen={isDeleting}
        onRequestClose={() => setIsDeleting(false)}
        contentLabel="Confirmar Eliminación"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">
            ¿Estás seguro de eliminar este comentario?
          </h2>
          <div className="flex justify-between">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommentList;
