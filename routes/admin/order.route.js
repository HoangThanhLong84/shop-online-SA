const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/order.controller");

router.get("/", controller.index);

router.get("/change-status/:status/:id", controller.changeStatus);

router.get("/change-verify/:verify/:id", controller.changeVerify);

router.get("/detail/:id", controller.detail);

module.exports = router;