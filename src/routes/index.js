const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const barRoutes = require("./barRoutes");
//const reviewRoutes = require("./reviewRoutes");
//const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
router.use("/bar", barRoutes);
//router.use("/review", reviewRoutes);
//router.use("/user", userRoutes);

module.exports = router;
