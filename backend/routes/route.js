const express = require("express");
const router = express.Router();
const User = require("../models/users");
const cors = require('cors');

//API
const apiRoutes = require("../API/index");
router.use(cors());
router.use("/api", apiRoutes);

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
  

module.exports = router;
