import 'dotenv/config';
import mysql from 'mysql2/promise';

// Determinar si estamos en producción o desarrollo
const isProduction = process.env.NODE_ENV === 'production';

let pool;

const getPool = async () => {
  try {
    if (!pool) {
      if (isProduction) {
        // En Railway, usamos directamente MYSQL_URL
        console.log('Conectando en entorno de producción (Railway)');

        if (!process.env.MYSQL_URL) {
          throw new Error(
            'La variable MYSQL_URL no está definida en el entorno de producción'
          );
        }

        // Crear el pool usando la URL completa de conexión
        pool = mysql.createPool(process.env.MYSQL_URL);
      } else {
        // En desarrollo local, usamos las variables individuales del .env
        console.log('Conectando en entorno de desarrollo local');

        const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

        console.log('DB_HOST:', DB_HOST);
        console.log('DB_PORT:', DB_PORT);
        console.log('DB_USER:', DB_USER);
        console.log('DB_PASSWORD:', DB_PASSWORD ? '****' : 'NO PASSWORD');
        console.log('DB_NAME:', DB_NAME);

        // En desarrollo, intentamos crear la base de datos si no existe
        const poolTemp = mysql.createPool({
          host: DB_HOST || 'localhost',
          port: DB_PORT || 3306,
          user: DB_USER,
          password: DB_PASSWORD,
        });

        await poolTemp.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);

        // Luego creamos el pool con la base de datos seleccionada
        pool = mysql.createPool({
          connectionLimit: 10,
          host: DB_HOST || 'localhost',
          port: DB_PORT || 3306,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          timezone: 'Z',
        });
      }
    }

    return pool;
  } catch (error) {
    console.log('Error al conectar a la base de datos:', error);
    throw error;
  }
};

export default getPool;
