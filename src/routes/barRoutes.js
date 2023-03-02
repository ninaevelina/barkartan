const express = require("express");
const router = express.Router();
const { getAllBars } = require("../controllers/barController");

router.get("/bars", getAllBars);

module.exports = router;
