require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const employeeRoutes = require("./routes/employeeRoutes");

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const WEBAPP_URI = process.env.WEBAPP_URI;

app.use(
  cors([
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    WEBAPP_URI && WEBAPP_URI,
  ])
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/employee", employeeRoutes);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`listening on ${PORT} `));
  })
  .catch((err) => console.log("Error in DB connection:", err));
