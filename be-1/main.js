//imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 4000;
//
//connect to database
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("projects_images"));
app.use(express.static("news_files"));

//swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "YouProject API",
      description: "YouProject API Information",
      contact: {
        name: "Andrea, Elia, Lorenzo",
      },
      servers: ["http://localhost:5000"],
      
    },
    securityDefinitions: {
      BearerAuth: {
        type: "apiKey",
        in: "header",
        name: "token",
      },
    },
  },
  apis: ["./API/users/*.js", "./API/projects/*.js", "./API/news/*.js"],
};
const spacs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));

//set temple engine
app.set("view engine", "ejs");

//route prefix
app.use("", require("./routes/route"));

// Servi i file statici dalla build di React
app.use(express.static(path.join(__dirname, '/views')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/views', 'index.html'));
});



// Consenti a tutti i domini di accedere alle risorse
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors());

// Altri middleware e route possono seguire...

const PORT = 5000;

if (require.main === module) {
  // Avvia il server solo se l'applicazione è in modalità standalone
  app.listen(port, () => {
    console.log(`YouProjectDB listening at http://localhost:${port}`);
  });
}

module.exports = app;
