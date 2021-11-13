let { getConection, sql } = require("../database/connection");
let queries = require("../database/queries");
const moment = require("moment");
class OrderControler {
  createNewOrder = async (req, res) => {
    const { vehicle, quantity, date } = req.body;
    if (vehicle === undefined || quantity === undefined || date === undefined) {
      return res.status(400).json({ msg: "Bad request. imcomplete fileds" });
    }
    try {
      const pool = await getConection();
      await pool
        .request()
        .input("vehicle", sql.VarChar, vehicle)
        .input("quantity", sql.Int, quantity)
        .input("date", sql.Date, date)
        .query(queries.createNewOrder);
      res.status(201).json({
        vehicle,
        quantity,
        date,
      });
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  getReports = async (req, res) => {
    try {
      const pool = await getConection();
      const vehicles = (await pool.request().query(queries.getAllvehicles))
        .recordset;

      let day = moment().format();
      let days = [];
      let pending = [];

      for (let numDay = 0; numDay < 7; numDay++) {
        const dayWeek = moment(day).day();
        let limit = 16;
        if (dayWeek === 0) limit = 0;
        if (dayWeek === 6) limit = 8;

        let hours = 0;
        let result = await pool
          .request()
          .input("date", sql.Date, day)
          .query(queries.getOrdersReport);
        result = result.recordset;

        let obj = {};

        for (let i = 0; i < vehicles.length; i++) {
          const idCurrentVehicle = vehicles[i].id;
          const manufactureTimeVehicle = vehicles[i].manufactureTime;
          const findPendingVehicule = pending.find(
            (val) => val.idVehiculo === idCurrentVehicle
          );
          const findVehicule = result.find(
            (v) => v.idVehiculo === idCurrentVehicle
          );

          if (findPendingVehicule) {
            pending = pending.filter(
              (v) => v.idVehiculo !== findPendingVehicule.idVehiculo
            );
            let pendingQuantity = 0;
            for (let i = 0; i < findPendingVehicule.quantity; i++) {
              if (manufactureTimeVehicle <= limit) {
                const newValue = (obj[idCurrentVehicle] || 0) + 1;
                const aux = obj[idCurrentVehicle] || 0;
                obj[idCurrentVehicle] = aux + 1;
                limit -= manufactureTimeVehicle;
              } else {
                obj[idCurrentVehicle] = obj[idCurrentVehicle] || 0;
                pendingQuantity += 1;
              }
            }
            pendingQuantity !== 0 &&
              pending.push({
                idVehiculo: idCurrentVehicle,
                quantity: pendingQuantity,
              });
          } else {
            obj[idCurrentVehicle] = 0;
          }

          if (findVehicule) {
            let pendingQuantity = 0;
            for (let i = 0; i < findVehicule.quantity; i++) {
              if (manufactureTimeVehicle <= limit) {
                const newValue = obj[idCurrentVehicle] + 1;
                obj[idCurrentVehicle] = newValue;
                limit -= manufactureTimeVehicle;
              } else {
                obj[idCurrentVehicle] = obj[idCurrentVehicle] || 0;
                pendingQuantity += 1;
              }
            }
            pendingQuantity !== 0 &&
              pending.push({
                idVehiculo: idCurrentVehicle,
                quantity: pendingQuantity,
              });
          } else {
            obj[idCurrentVehicle] = obj[idCurrentVehicle] + 0;
          }
        }

        days.push(obj);
        day = moment(day).add(1, "days").format();
      }
      res.status(201).json(days);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
}

const orderControler = new OrderControler();
module.exports = orderControler;
