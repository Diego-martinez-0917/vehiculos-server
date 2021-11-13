const router = require("express").Router()
const vehicleControler = require("../controllers/vehiculos.controllers")

router.route("/").get(vehicleControler.getVehicles)
router.route("/create").post(vehicleControler.createNewVehicle)
router.route("/update").put(vehicleControler.UpdateVehicleById)
router.route("/delete/:id").delete(vehicleControler.deleteVehicleById)

module.exports = router