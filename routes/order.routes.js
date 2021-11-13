const router = require("express").Router()
const orderControler = require("../controllers/order.controllers")

router.route("/report").get(orderControler.getReports)
router.route("/create").post(orderControler.createNewOrder)

module.exports = router