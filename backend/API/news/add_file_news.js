/**
 * @fileoverview This file contains the API endpoint for adding an user.
 * @module API/add_file_news
 */
const express = require("express");
const multer = require("multer");
const validateToken = require("../validate_token");
const fs = require("fs");
const path = require("path");
const News = require("../../models/news");
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
    cb(null, "./news_files/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage }).single("attachment");

/**
 * @swagger
 * /api/add_file_news:
 *   post:
 *     summary: Add a file to news
 *     description: Add an attachment file to a specific news article.
 *     tags:
 *       - News
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: formData
 *         name: attachment
 *         description: The file to upload as an attachment.
 *         type: file
 *         required: true
 *       - in: formData
 *         name: news_id
 *         description: The ID of the news article to associate the uploaded file with.
 *         type: string
 *         required: true
 *     responses:
 *       '201':
 *         description: File Added Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: File Added Successfully to Sample News
 *       '404':
 *         description: News not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the news was not found
 *             example:
 *               message: News not found
 *       '500':
 *         description: Internal Server Error
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
 *               message: Internal Server Error
 *               type: danger
 */

router.post("/add_file_news", upload, validateToken, async (req, res) => {
  try {
    // Extract data from the POST input

    news = await News.findById(req.body.news_id);
    if (!news) {
      //elimino la foto
      
        const directory = path.join(__dirname, '../../news_files/');
        const filePath = directory + req.file.filename;
        try {
            fs.unlinkSync(filePath)
            //file removed
        } catch (err) {
            console.error(err)
        }
    
      res.status(500).json({ message: "News not found", type: "danger" });
      //TODO eliminare file caricato
    } else {
      // Salva i nomi dei file in un array
      const nomeFile = req.file.filename;
      news.attachments.push(nomeFile);
      // Save the user to the database
      await news.save();
      // Respond with a success message
      res
        .status(201)
        .json({ message: "File Added Successfully to " + news.title });
    }
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
