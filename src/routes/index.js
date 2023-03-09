const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const barRoutes = require("./barRoutes");
const cityRoutes = require("./cityRoutes");
const reviewRoutes = require("./reviewRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
router.use("/bar", barRoutes);
router.use("/city", cityRoutes);
router.use("/reviews", reviewRoutes);
router.use("/user", userRoutes);

module.exports = router;
