const express = require("express");
const router = express.Router();
const {
  getAllBars,
  getBarById,
  createNewBar,
  deleteBarById,
} = require("../controllers/barController");

router.get("/", getAllBars);
router.get("/:id", getBarById);
router.post("/", createNewBar);
router.delete("/:id", deleteBarById);

module.exports = router;
