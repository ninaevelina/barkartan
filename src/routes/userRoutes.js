const express = require("express");
// const { userRoles } = require("../constants/users");

const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

router.get("/", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);
router.delete("/:id", isAuthenticated, deleteUserById);
router.put("/:id", isAuthenticated, updateUserById);

module.exports = router;
