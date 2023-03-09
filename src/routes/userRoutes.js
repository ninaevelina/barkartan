const express = require("express");
const { userRoles } = require("../constants/users");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/userControllers");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

router.get("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers);
router.get("/:id", isAuthenticated, getUserById);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles(userRoles.ADMIN),
  deleteUserById
);
router.put("/:id", isAuthenticated, updateUserById);

module.exports = router;
