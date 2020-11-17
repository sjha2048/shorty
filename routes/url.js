const { Router } = require("express");
const express = require("express");
const url_controller = require("../controllers/url_controller");

const router = express.Router();

router.post("/shorten", url_controller.shorten);
router.get("/:code", url_controller.redirect);

module.exports = router;
