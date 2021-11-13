let { getConection, sql } = require("../database/connection");
let queries = require("../database/queries");
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
      console.log(error.message);
    }
  };

  getReports = async (req, res) => {
    try {
      const pool = await getConection();
      const vehicles = (await pool.request().query(queries.getAllvehicles))
        .recordset;
      console.log(vehicles);
      let day = new Date();
      let days = [];
      let pending = {}

      for (let numDay = 0; numDay < 7; numDay++) {
        let hours = 0;
        let result = await pool
          .request()
          .input("date", sql.Date, day)
          .query(queries.getOrdersReport);
        result = result.recordset;

        let obj = {};

        if (Object.keys(pending).length > 0) {
          obj = pending
        }

        for (let i = 0; i < vehicles.length; i++) {
          const idCurrentVehicle = vehicles[i].id;
          const manufactureTimeVehicle = vehicles[i].manufactureTime;         
          const findVihicle =result.find((elemt) => elemt.idVehiculo === idCurrentVehicle)
          if (findVihicle) {
            const quantityResultVehicle =  result.find(res => findVihicle.idVehiculo === res.idVehiculo ).quantity;
                        
            let limit = 16;
            const dayWeek = day.getDay();
            if (dayWeek === 0) limit = 0;
            if (dayWeek === 6) limit = 8;

            hours += quantityResultVehicle * manufactureTimeVehicle;
            if (hours <= limit) {
              obj[idCurrentVehicle] = quantityResultVehicle;
            } else {
              hours -= quantityResultVehicle * manufactureTimeVehicle;
              obj[idCurrentVehicle] = 0;
              pending[idCurrentVehicle]= quantityResultVehicle ;
            }
            console.log("horas", hours, "limite", limit, "pendite", pending);
          } else {
            // console.log("sin valor")
            obj[idCurrentVehicle] = 0;
          }
        }
        days.push(obj);
        day.setDate(day.getDate() + 1);
      }
      // console.log(days);
      res.status(201).json(days);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
}

const orderControler = new OrderControler();
module.exports = orderControler;
