import getPool from '../../db/getPool.js';
import sendMailUtil from '../../utils/sendEmailUtil.js';

const recoverPasswordService = async (email, recoverPassCode) => {
  const pool = await getPool();
  const { FRONT_END_PORT } = process.env;
  await pool.query(
    `
    UPDATE users
    SET recoverPassCode = ?
    WHERE email = ?
    `,
    [recoverPassCode, email]
  );

  const subject = 'Recuperación de contraseña WonderFly';

  const body = `
    <html>
        <body>
          <table bgcolor="#210b57" width="670" border="0" cellspacing="0" cellpadding="0" align="left" >
            <tbody>
              <tr>
                <td align="left" style="padding: 20px 40px; color: white; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                  <p style="margin: 10px 0 20px; font-size: 35px; font-weight: bold; color: white;">
                    <img src="https://img.freepik.com/vector-gratis/personaje-dibujos-animados-happy-airplane_1308-165793.jpg" alt="Logo" style="width: 40px; margin: 0 -3px -10px 0" /> WonderFly ✈️
                  </p>
                  <p style="margin: 0 0 5px; font-size: 16px; color: white;">Se ha solicitado la recuperación de la contraseña para el siguiente email:</p>
                  <p style="margin: 0 0 15px; font-size: 20px; color: #046EF8;">${email}</p>
                  <p style="margin: 20px 0 5px; font-size: 16px; color: #ccc;">Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                  <a href="${FRONT_END_PORT}/reset/${recoverPassCode}" style="color: #046EF8; font-size: 18px; font-weight: bold; text-decoration: none;">Restablecer contraseña</a>
                  <p style="margin: 70px 0 2px; color: #fff;">Gracias por volar con nosotros.</p>
                  <p style="margin: 0 0 10px; color: #fff;">&copy; WonderFly ✈️ 2024</p>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
    </html>
  `;

  await sendMailUtil(email, subject, body);
};

export default recoverPasswordService;
