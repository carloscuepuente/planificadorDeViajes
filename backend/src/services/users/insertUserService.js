import bcrypt from 'bcrypt';
import joi from 'joi';

import getPool from '../../db/getPool.js';
import generateErrorsUtils from '../../utils/generateErrorsUtils.js';

const userSchema = joi.object({
  email: joi.string().email().required(),
  username: joi.string().alphanum().min(3).max(30).required(),
  password: joi.string().min(8).required(),
  name: joi.string().max(50).required(),
  lastName: joi.string().max(50).required(),
  registrationCode: joi.string().max(100)
});


export const insertUserService = async ( 
  email,
  username,
  password,
  name,
  lastName,
  registrationCode
) => {
  try {
    //Validamos los datos de entrada.
    const { error } =userSchema.validate({ email, username, password, name, lastName,registrationCode});
    if(error){
      throw generateErrorsUtils(`Error de validación: ${error.details[0].message}`, 400);
    }
    // Obtenemos la conexión con la base de datos.
    const pool = await getPool();
    //Comprobamos si existe el usuario previamente.
    const [userExists] = await pool.query(
      'SELECT * FROM users WHERE email=?',
      [email]
    );
    if (userExists.length > 0) {
    throw generateErrorsUtils('El usuario ya está registrado', 409);
    }
    // Hasheamos la contraseña.
    const hashedPass = await bcrypt.hash(password, 10);

    //Insertamos el usuario en la base de datos.
    const [result] = await pool.query(
      `
            INSERT INTO users(email, username, password, name, lastName, registrationCode) VALUES(?,?,?,?,?,?)
            `,
      [
        email,
        username,
        hashedPass,
        name,
        lastName, 
        registrationCode
      ]
    );
    console.log('Usuario guardado en la base de datos', result);
  } catch (error) {
    //Manejamos el error
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
};
