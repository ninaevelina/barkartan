const express = require("express");
const router = express.Router();
const { getBarByCityId } = require("../controllers/cityController");

router.get("/", getBarByCityId);

module.exports = router;
