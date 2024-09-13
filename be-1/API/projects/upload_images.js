/**
 * @fileoverview This file contains the API endpoint for adding an user.
 * @module API/upload_images
 */
const express = require("express");
const multer = require("multer");
const validateToken = require("../validate_token");
const fs = require("fs");
const path = require("path");
const Project = require("../../models/projects");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());

/**
 * Middleware for handling image upload.
 * The uploaded image will be stored in the "./uploads" directory.
 * The filename will be generated using the fieldname, current timestamp, and original filename.
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./projects_images/");
  },
  filename: async function (req, file, cb) {
    cb(null, Date.now() + "_" + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage }).single("image");


/**
 * @swagger
 * /api/upload_proj_images:
 *   post:
 *     summary: Upload project images
 *     description: Upload an image for a project.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: formData
 *         name: image
 *         description: The image file to upload.
 *         type: file
 *         required: true
 *       - in: formData
 *         name: project_id
 *         description: The ID of the project to associate the uploaded image with.
 *         type: string
 *         required: true
 *     responses:
 *       '201':
 *         description: Image Added Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: Image Added Successfully to Sample Project
 *       '500':
 *         description: Project not found or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 type:
 *                   type: string
 *                   description: The type of error
 *             example:
 *               message: Project not found
 *               type: danger
 */
router.post("/upload_proj_images", upload, validateToken, async (req, res) => {
  try {
    // Extract data from the POST input

    project = await Project.findById(req.body.project_id);
    if (!project) {
      //elimino la foto
      
        const directory = path.join(__dirname, '../../projects_images/');
        const filePath = directory + req.file.filename;
        try {
            fs.unlinkSync(filePath)
            //file removed
        } catch (err) {
            console.error(err)
        }
    
      res.status(500).json({ message: "Project not found", type: "danger" });
      //TODO eliminare file caricato
    } else {
      // Salva i nomi dei file in un array
      const nomeFile = req.file.filename;
      project.images.push(nomeFile);
      // Save the user to the database
      await project.save();
      // Respond with a success message
      res
        .status(201)
        .json({ message: "Image Added Successfully to " + project.name });
    }
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
