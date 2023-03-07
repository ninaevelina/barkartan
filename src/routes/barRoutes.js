const express = require("express");
const router = express.Router();
const {
  getAllBars,
  getBarById,
  createNewBar,
  deleteBarById,
} = require("../controllers/barController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

router.get("/", getAllBars);
router.get("/:id", getBarById);
router.post("/", isAuthenticated, createNewBar);
router.delete("/:id", isAuthenticated, deleteBarById);

module.exports = router;
