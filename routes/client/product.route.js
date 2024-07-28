const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/detail/:slugProduct", controller.detail);

router.get("/:slugCategory", controller.category);



router.post(
    "/detail/:slugProduct/create",
    controller.createPost
);

module.exports = router;