const express = require("express");
const router = express.Router();
const {
  getAllBars,
  getBarById,
  getBarByCityId,
  createNewBar,
  deleteBarById,
} = require("../controllers/barController");

router.get("/", getAllBars);
router.get("/:id", getBarById);
//router.get("")

module.exports = router;
