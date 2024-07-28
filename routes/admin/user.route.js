const express = require("express");
const router = express.Router();


const controller = require("../../controllers/admin/user.controller");

router.get("/", controller.index);

router.get("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteItem);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    controller.editPatch
);

router.get("/create", controller.create);

router.post(
    "/create",
    controller.createPost
);

router.get("/detail/:id", controller.detail);

module.exports = router;