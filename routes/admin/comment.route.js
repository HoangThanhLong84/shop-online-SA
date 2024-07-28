const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/comment.controller");

router.get("/", controller.index);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;