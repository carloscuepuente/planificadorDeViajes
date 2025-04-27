// importamos el server
import server from './src/server.js';

//IMPORTARD DOTENV
import 'dotenv/config';
// port donde va a escuchar de forma condicional
// asi la escribe en el servidor de producción o toma el puerto 3001 para trabajar en local
const PORT = process.env.PORT || 3001;

// codigo previo a deploy en railway
// server.listen(PORT, () => {
// console.log(`Server listening in port ${PORT}`);
// });

// railway fix for deploy to use the host
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening in port ${PORT}`);
});
