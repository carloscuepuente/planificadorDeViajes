import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function RatingBanner() {
  const { t } = useTranslation();
  const [averageRating, setAverageRating] = useState(null);
  const [numVotes, setNumVotes] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ratings`);
        if (!response.ok) {
          throw new Error('Error al obtener la valoración');
        }
        const data = await response.json();
        setAverageRating(data.averageRating);
        setNumVotes(data.numVotes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRating();
  }, []);

  const getStars = (rating) => {
    if (rating === null) return [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const stars = [
      ...Array(fullStars).fill('full'),
      ...Array(emptyStars).fill('empty'),
    ];
    return stars;
  };

  const stars = getStars(averageRating);

  return (
    <>
      <div className="bg-[#9AA5BC] text-white py-10 flex justify-center mt-0">
        <div className="bg-white bg-opacity-80 text-black rounded-lg px-6 py-4 flex items-center justify-between w-auto">
          <div className="text-center">
            <p className="font-bold">⭐ {t('ratingMessage')}</p>
            <div className="flex justify-center mt-2">
              <div className="flex items-center">
                {stars.map((star, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${star === 'full' ? 'text-yellow-300' : 'text-gray-400'}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>
              {averageRating !== null && numVotes !== null && (
                <p className="text-sm ml-2">
                  ({numVotes} {t('ratingVotes')})
                </p>
              )}
            </div>
          </div>
          <Link
            to="/ratings"
            className="text-white bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-lg ml-4 transition-colors"
          >
            {t('ratingButton')}
          </Link>
        </div>
      </div>
    </>
  );
}

export default RatingBanner;
