const express = require("express");
const router = express.Router();
const { getBarByCityId, addNewCity } = require("../controllers/cityController");

router.get("/:id", getBarByCityId);
router.post("/", addNewCity);

module.exports = router;
