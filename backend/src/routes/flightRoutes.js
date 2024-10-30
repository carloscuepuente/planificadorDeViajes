// librerías y dependencias
import express from 'express';

// controladores
import cityAndAirportSearch from '../controllers/amadeus/cityAndAirport.js';
import flightSearch from '../controllers/amadeus/flightSearch.js';
import { combinedSearch } from '../controllers/amadeus/search.js';


// middlewares
/* import authUser from '../middlewares/authUser.js';
import newFavoriteFlightController from '../controllers/newFavoriteFlightController.js'; */



// router
export const flightRouter = express.Router();

// Rutas

// ruta para marcar un vuelo como favorito con posibilidad de crear una nota
//flightRouter.post('/flights/:id/favorite', authUser, newFavoriteFlightController);


// ruta para buscar ciudad y aeropuerto
flightRouter.get(`/city-and-airport-search/:parameter`, cityAndAirportSearch);
// ruta para buscar vuelos origen-destino
flightRouter.get(`/flight-search`, flightSearch);
// ruta combinada de las dos anteriores
flightRouter.get(`/search`, combinedSearch);
