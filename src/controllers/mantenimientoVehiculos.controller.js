import { pool } from "../db.js";
import moment from 'moment';

export const getMantenimientosVehiculos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM MantenimientoVehiculos");

    // Formatear la fecha en cada objeto del array
    const formattedRows = rows.map((row) => {
      return {
        ...row,
        FechaMantenimiento: moment(row.FechaMantenimiento).format('DD/MM/YYYY'),
      };
    });

    res.json(formattedRows);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMantenimientoVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM MantenimientoVehiculos WHERE ID = ?",
      [id]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    // Formatear la fecha en el objeto antes de enviar la respuesta
    const formattedRow = {
      ...rows[0],
      FechaMantenimiento: moment(rows[0].FechaMantenimiento).format('DD/MM/YYYY'),
    };

    res.json(formattedRow);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteMantenimientoVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "DELETE FROM MantenimientoVehiculos WHERE ID = ?",
      [id]
    );

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createMantenimientoVehiculo = async (req, res) => {
  try {
    const {
      UnidadAsignada,
      TipoMantenimiento,
      DescripcionMantenimiento,
      FechaMantenimiento,
      CostoMantenimiento,
    } = req.body;

    const [rows] = await pool.query(
      "INSERT INTO MantenimientoVehiculos (UnidadAsignada, TipoMantenimiento, DescripcionMantenimiento, FechaMantenimiento, CostoMantenimiento) VALUES (?, ?, ?, ?, ?)",
      [
        UnidadAsignada,
        TipoMantenimiento,
        DescripcionMantenimiento,
        FechaMantenimiento,
        CostoMantenimiento,
      ]
    );

    res.status(201).json({
      ID: rows.insertId,
      UnidadAsignada,
      TipoMantenimiento,
      DescripcionMantenimiento,
      FechaMantenimiento,
      CostoMantenimiento,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMantenimientoVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      UnidadAsignada,
      TipoMantenimiento,
      DescripcionMantenimiento,
      FechaMantenimiento,
      CostoMantenimiento,
    } = req.body;

    const [result] = await pool.query(
      "UPDATE MantenimientoVehiculos SET UnidadAsignada = IFNULL(?, UnidadAsignada), TipoMantenimiento = IFNULL(?, TipoMantenimiento), DescripcionMantenimiento = IFNULL(?, DescripcionMantenimiento), FechaMantenimiento = IFNULL(?, FechaMantenimiento), CostoMantenimiento = IFNULL(?, CostoMantenimiento) WHERE ID = ?",
      [
        UnidadAsignada,
        TipoMantenimiento,
        DescripcionMantenimiento,
        FechaMantenimiento,
        CostoMantenimiento,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Maintenance record not found" });

    const [rows] = await pool.query(
      "SELECT * FROM MantenimientoVehiculos WHERE ID = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    return res.status(500).json({ message: "Error updating maintenance record" });
  }
};
