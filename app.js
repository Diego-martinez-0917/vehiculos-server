const express = require("express");
const cors = require("cors");
const vehiculeRouter = require("./routes/vehicle.routes");
const orderRouter = require("./routes/order.routes");
const app = express();

app.use(
  cors({
    exposedHeaders: ["Content-Pages", "Content-Total"],
  })
);
//midelwares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to back application." });
});

app.use("/vehicle", vehiculeRouter);
app.use("/order", orderRouter);

module.exports = app;
