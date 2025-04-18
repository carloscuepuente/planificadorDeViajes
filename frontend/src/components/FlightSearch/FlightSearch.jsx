import { useCallback, useState } from 'react';
import _debounce from 'lodash/debounce';
import FlightSearchDropdown from './FlightSearchDropdown';
import { useAddParamsToSearch } from '../../hooks/api';
import { useFlightSearchParams } from '../../context/FlightSearchParamsContext';
import areObjValuesTruthy from '../../utils/areObjValuesTruthy';
import { useNavigate } from 'react-router-dom';
// lo de react router DOM
import { useSearchParams } from 'react-router-dom';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

function FlightSearch() {
  const { t } = useTranslation();
  // lo del estado de react-router-dom
  const [searchParams, setSearchParams] = useSearchParams();

  const [origin, setOrigin] = useState(searchParams.get('originCode') || '');
  const [iataOriginCode, setIataOriginCode] = useState(
    searchParams.get('originCode') || ''
  );
  const [destination, setDestination] = useState(
    searchParams.get('destinationCode') || ''
  );
  const [iataDestinationCode, setIataDestinationCode] = useState(
    searchParams.get('destinationCode') || ''
  );
  const [departureDate, setDepartureDate] = useState(
    searchParams.get('departureDate') || ''
  );
  const [adults, setAdults] = useState(searchParams.get('adults') || 1);
  const [originResults, setOriginResults] = useState([]);
  const [destinationResults, setDestinationResults] = useState([]);
  const [showOriginResults, setShowOriginResults] = useState(false);
  const [showDestinationResults, setShowDestinationResults] = useState(false);

  const [flightSearchParams] = useFlightSearchParams();

  // no usar el contexto, vamos a pasar las cosas a la url
  useAddParamsToSearch({
    departureDate,
    iataOriginCode,
    iataDestinationCode,
    adults,
  });

  let navigate = useNavigate();

  const searchCityOrAirport = async (searchTerm, resultSeterFn) => {
    if (searchTerm !== '') {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/city-and-airport-search/${searchTerm}`
        );
        const data = await response.json();

        if (data) {
          resultSeterFn(data);
        }
      } catch (error) {
        console.error('Error searching cities and airports:', error);
      }
    }
  };

  const debounceOrigin = useCallback(
    _debounce(
      (searchTerm) => searchCityOrAirport(searchTerm, setOriginResults),
      1000
    ),
    []
  );
  const debounceDestination = useCallback(
    _debounce(
      (searchTerm) => searchCityOrAirport(searchTerm, setDestinationResults),
      1000
    ),
    []
  );

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
    debounceOrigin(event.target.value);
    setShowOriginResults(true);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
    debounceDestination(event.target.value);
    setShowDestinationResults(true);
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    if (areObjValuesTruthy(flightSearchParams)) {
      const queryParams = new URLSearchParams({
        originCode: iataOriginCode,
        destinationCode: iataDestinationCode,
        departureDate: departureDate,
        adults: adults,
      });
      // console.log('queryparams to string', queryParams);

      setSearchParams(queryParams);
      navigate(`/search/results?${queryParams.toString()}`);
    } else {
      toast.error(t('search.completeFieldsError'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#9AA5BC] ">
      <ToastContainer />
      <img
        className="w-full h-[500px] object-cover mt-20"
        src="/fondo-header.jfif"
        alt="Fondo"
        style={{ zIndex: -1 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className=" max-w-5xl w-full mx-auto mt-10 px-4 py-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {t('search.searchFlights')}
          </h2>
          <form className="space-y-6" onSubmit={handleButtonClick}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('search.origin')}
                </label>
                <input
                  id="origin"
                  type="text"
                  value={origin}
                  onChange={handleOriginChange}
                  placeholder={t('search.origin')}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                />
                {showOriginResults && originResults.length > 0 ? (
                  <FlightSearchDropdown
                    className="text-black"
                    seter={setOrigin}
                    results={originResults}
                    isOrigin={true}
                    setIataOriginCode={setIataOriginCode}
                    setIataDestinationCode={setIataDestinationCode}
                    setShow={setShowOriginResults}
                  />
                ) : null}
              </div>
              <div className="relative">
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('search.destination')}
                </label>
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={handleDestinationChange}
                  placeholder={t('search.destination')}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black "
                />
                {showDestinationResults && originResults.length > 0 ? (
                  <FlightSearchDropdown
                    seter={setDestination}
                    results={destinationResults}
                    isOrigin={false}
                    setIataOriginCode={setIataOriginCode}
                    setIataDestinationCode={setIataDestinationCode}
                    setShow={setShowDestinationResults}
                  />
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="departureDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('search.departureDate')}
                </label>
                <input
                  id="departureDate"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="adults"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('search.adults')}
                </label>
                <input
                  id="adults"
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  min="1"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500  text-black"
                />
              </div>
            </div>
            <button
              onClick={handleButtonClick}
              className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
            >
              {t('search.searchFlightsButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FlightSearch;
