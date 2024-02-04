import { pool } from "../db.js";

export const executeSP = async (spName, params) => {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`CALL ${spName}(?, ?)`, params);
    return rows;
  } catch (error) {
    console.error('Error en la ejecución del Stored Procedure:', error);
    throw error;
  } finally {
    connection.release(); // Liberar la conexión después de su uso
  }
};

export const dataController = async (req, res) => {
  const { body } = req;

  if (!body || !body.spName || !body.params || body.params.length !== 2) {
    return res.status(400).json({ error: 'Solicitud incorrecta' });
  }

  try {
    const result = await executeSP(body.spName, body.params);
    res.status(200).json({ data: result });
    console.log('Resultado de la ejecución del procedimiento almacenado:', result);
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en la API', details: error.message, stack: error.stack });
  }
};
