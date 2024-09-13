const express = require("express");
const News = require("../../models/news");
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
/**
 * @swagger
 * /api/get_news_by_proj:
 *   post:
 *     summary: Get news by project
 *     description: Retrieve news related to a specific project based on its project_id.
 *     tags:
 *       - News
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Object containing the project_id.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *               description: The unique identifier for the project.
 *               example: "project123"
 *     responses:
 *       200:
 *         description: Successful response with a list of news related to the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the news.
 *                   project_id:
 *                     type: string
 *                     description: The unique identifier for the project associated with the news.
 *                   title:
 *                     type: string
 *                     description: The title of the news.
 *                   description:
 *                     type: string
 *                     description: The description of the news.
 *                   publish_date:
 *                     type: string
 *                     description: The publish date of the news.
 *                   author:
 *                     type: string
 *                     description: The author of the news.
 *                   comments:
 *                     type: array
 *                     description: An array of comments associated with the news.
 *                     items:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           description: The username of the commenter.
 *                         comment:
 *                           type: string
 *                           description: The comment text.
 *                     example:
 *                       - username: "john_doe"
 *                         comment: "Great news!"
 *                       - ... (additional comments)
 *                 example:
 *                   - _id: "news123"
 *                     project_id: "project123"
 *                     title: "Exciting News"
 *                     description: "This is an exciting update about the project."
 *                     publish_date: "2024-01-27T12:00:00Z"
 *                     author: "john_doe"
 *                     comments:
 *                       - username: "jane_doe"
 *                         comment: "Awesome!"
 *                       - ... (additional comments)
 *                   - ... (additional news related to the project)
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                 type:
 *                   type: string
 *                   description: The type of error.
 *             example:
 *               message: Internal Server Error
 *               type: danger
 */

router.post("/get_news_by_proj", async (req, res) => {
    try {
        const project_id = req.body.project_id;
        // Retrieve all projects from the database
        const news = await News.find({ project_id: project_id });
        const return_news = [];
        for (const n of news) {
            if (n.publish_date <= new Date()) return_news.push(n);
        }
        // Respond with the users in JSON format
        res.status(200).json(return_news);
    } catch (error) {
        // Respond with an error message
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
