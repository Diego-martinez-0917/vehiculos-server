// const { request } = require("../app");
let { getConection, sql } = require("../database/connection");
let queries = require("../database/queries");
class VehicleControler {
  createNewVehicle = async (req, res) => {
    const VehicleData = (({ name, manufactureTime }) => ({
      name,
      manufactureTime,
    }))(req.body);
    if (
      VehicleData.name === undefined ||
      VehicleData.manufactureTime === undefined
    ) {
      return res.status(400).json({ msg: "Bad request. imcomplete fileds" });
    }
    try {
      const pool = await getConection();
      await pool
        .request()
        .input("name", sql.VarChar, VehicleData.name)
        .input("manufactureTime", sql.Int, VehicleData.manufactureTime)
        .query(queries.createNewVehicle);
      res.status(201).json({
        name: VehicleData.name,
        manufactureTime: VehicleData.manufactureTime,
      });
    } catch (error) {
      res.status(400).json(err.message);
    }
  };

  getVehicles = async (req, res) => {
    try {
      const pool = await getConection();
      const result = await pool.request().query(queries.getAllvehicles);
      res.status(200).json(result.recordset);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  UpdateVehicleById = async (req, res) => {
    const { id, name, manufactureTime } = req.body;
    if (
      id === undefined ||
      name === undefined ||
      manufactureTime === undefined
    ) {
      return res.status(400).json({ msg: "Bad request. imcomplete fileds" });
    }
    try {
      const pool = await getConection();
      await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("manufactureTime", sql.Int, manufactureTime)
        .input("id", sql.Int, id)
        .query(queries.updateVehicleById);
      res.json({
        name,
        manufactureTime,
      });
    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  deleteVehicleById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Bad request. need ID vehicle" });
    }
    try {
      const pool = await getConection();
      await pool.request().input("id", id).query(queries.deleteVehicleById);
      res.status(201).json({ msg: "good request. vehicle deleted" });
    } catch (err) {
      res.status(400).json(err.message);
    }
  };
}

const vehicleControler = new VehicleControler();
module.exports = vehicleControler;
