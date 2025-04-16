import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

const RatingsCarousel = () => {
  const [comments, setComments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); // Usar el hook para obtener la función de traducción

  const selectRandomComments = (allComments, count = 6) => {
    const midToHighRatedComments = allComments.filter(
      (comment) => comment.rating >= 3 && comment.rating <= 5
    );
    const shuffled = midToHighRatedComments.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ratings`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      const selectedComments = selectRandomComments(responseData.data);
      setComments(selectedComments);
    } catch (err) {
      console.error('Error al obtener los comentarios:', err);
      setError(t('errorFetchingComments')); // Usar la clave de traducción para el error
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const interval =
      comments.length > 1
        ? setInterval(() => {
            nextSlide();
          }, 5000)
        : null;
    return () => interval && clearInterval(interval);
  }, [currentIndex, comments]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % comments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? comments.length - 1 : prevIndex - 1
    );
  };

  if (comments.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-6 items-center bg-[#686E9E] w-full px-4 sm:px-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 text-center">
          {t('ratingCarousel.ratingsTitle')} {/* Usar la clave de traducción */}
        </h1>
        <p className="text-base sm:text-xl text-gray-100 mb-4 text-center">
          {t('ratingCarousel.ratingsDescription')}{' '}
          {/* Usar la clave de traducción */}
        </p>
        <div className="flex justify-center">
          <Link
            to="/ratings"
            className="text-white mb-10 hover:underline hover:text-blue-800 transition bg-[#ff5a1f] px-4 py-2 rounded-lg"
          >
            {t('ratingCarousel.seeAllRatings')}{' '}
            {/* Usar la clave de traducción */}
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto mt-8 mb-10 px-4">
        <div className="relative flex h-[250px] sm:h-[250px] md:h-[300px] overflow-hidden">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className={`absolute w-full h-full transition-transform duration-500 ${
                index === currentIndex
                  ? 'translate-x-0'
                  : index < currentIndex
                    ? '-translate-x-full'
                    : 'translate-x-full'
              }`}
            >
              <div className="w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl italic mb-4 text-black">{`"${comment.comment}"`}</p>
                  <div className="flex justify-center items-center space-x-2 mb-2">
                    <span className="font-bold">{comment.user_name}</span>
                    <div className="flex items-center">
                      {[...Array(comment.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/75 transition text-black"
              onClick={prevSlide}
            >
              &#10094;
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/75 transition text-black"
              onClick={nextSlide}
            >
              &#10095;
            </button>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
              {comments.map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full cursor-pointer transition ${
                    index === currentIndex
                      ? 'bg-gray-200'
                      : 'bg-black hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></span>
              ))}
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          {error} {/* Mostrar el error traducido */}
        </div>
      )}
    </>
  );
};

export default RatingsCarousel;
