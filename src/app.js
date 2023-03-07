require("dotenv").config();
require("express-async-errors");
const express = require("express");
const apiRoutes = require("./routes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const { sequelize } = require("./database/config");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

/* ----------- Create our Express app ------------ */
const app = express();

/* ---------------------------------------------- */
/* ----------------- Middleware ----------------- */
/* ---------------------------------------------- */
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});
/* ---------------------------------------------- */
/* ------------ Secutiry Middleware ------------- */
/* ---------------------------------------------- */

app.use(helmet());
app.use(xss());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  })
);

app.use(
  rateLimit({
    windowMs: 10 * 50 * 1000,
    max: 50,
  })
);

/* ---------------------------------------------- */
/* ------------------- Routes ------------------- */
/* ---------------------------------------------- */
app.use("/api/v1", apiRoutes);

/* ---------------------------------------------- */
/* --------------- Error Handling --------------- */
/* ---------------------------------------------- */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

/* ---------------------------------------------- */
/* ---------------- Server Setup ---------------- */
/* ---------------------------------------------- */
const port = process.env.PORT || 5000;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
