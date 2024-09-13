// Import necessary modules and dependencies
const express = require("express");
const router = express.Router();
const News = require("../../models/news");
const Project = require("../../models/projects");
const managers = require("../../models/managers");
const User = require("../../models/users");
const validateToken = require("../validate_token");
const collaborators = require("../../models/collaborators");
router.use(express.json());
/**
 * @swagger
 * /api/add_news:
 *   post:
 *     summary: Add a news article
 *     description: Add a news article to a specific project.
 *     tags:
 *       - News
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing project_id, title, description, publish_date, and author.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *               description: The ID of the project to which the news article belongs.
 *             title:
 *               type: string
 *               description: The title of the news article.
 *             description:
 *               type: string
 *               description: The description of the news article.
 *             publish_date:
 *               type: string
 *               format: date
 *               description: The publish date of the news article (formatted as "YYYY-MM-DD").
 *             author:
 *               type: string
 *               description: The username of the author of the news article.
 *         example:
 *           project_id: "project123"
 *           title: "Exciting News"
 *           description: "This is an exciting news article."
 *           publish_date: "2024-01-27"
 *           author: "john_doe"
 *     responses:
 *       '201':
 *         description: News added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: News added successfully
 *       '404':
 *         description: Project or author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the project or author was not found
 *             example:
 *               message: Project/Author Not Found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *             example:
 *               error: Internal Server Error
 */
// Define the route for adding a news
router.post("/add_news", validateToken, async (req, res) => {
  try {
    const author = req.body.author;
    const project = await Project.findById(req.body.project_id);
    const user = await User.findOne({ username: author });
    if (!user || !project) {
      res.status(404).json({ message: "Author/Project Not Found" });
    } else {
      var manager = await managers.findOne({
        user_id: user._id,
        project_id: project._id,
      });
      var collaborator = await collaborators.findOne({
        user_id: user._id,
        project_id: project._id,
      });
      if (!manager && !collaborator) {
        res.status(404).json({ message: "The user in not a Collaborator or a manager" });
      } else {
        const user_id = (manager || collaborator).user_id;
        // Extract the news data from the request body
        //  senza allegati
        const news = new News({
          project_id: req.body.project_id,
          project_name: project.name,
          title: req.body.title,
          description: req.body.description,
          publish_date: req.body.publish_date,
          author: req.body.author,
          author_id: user_id,
        });

        // Save the news object to the database
        await news.save();

        // Return a success response
        res.status(201).json({ message: "News added successfully" , news_id: news._id});
      }
    }
  } catch (error) {
    // Return an error response
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
