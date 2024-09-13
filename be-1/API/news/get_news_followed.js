const express = require("express");
const News = require("../../models/news");
const router = express.Router();
const Follower = require("../../models/follower");
const Manager = require("../../models/managers");
const Project = require("../../models/projects");
const validateToken = require("../validate_token");

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());

/**
 * @swagger
 * /api/get_news_followed:
 *   post:
 *     summary: Get news by projects
 *     description: Retrieve news based on projects followed and managed by a user.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - News
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User ID to retrieve news.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *               description: The unique identifier of the user.
 *               example: "user123"
 *     responses:
 *       200:
 *         description: News retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 type:
 *                   type: string
 *                   description: Error type.
 *             example:
 *               message: "User Not Found"
 *               type: danger
 *       500:
 *         description: Internal Server Error.
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

router.post("/get_news_followed", validateToken, async (req, res) => {
  try {
    const return_news = [];
    const user_id = req.body.user_id;
    const projectsFollowed = await Follower.find({ user_id: user_id });
    if (!projectsFollowed) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      for (const project of projectsFollowed) {
        const news = await News.find({ project_id: project.project_id });
        for (const n of news) {
          if (n.publish_date <= new Date()) return_news.push(n);
        }
      }
      const projectsManaged = await Manager.find({ user_id: user_id });
      if (!!projectsManaged) {
        for (const project of projectsManaged) {
          const news = await News.find({ project_id: project.project_id });
          for (const n of news) {
            return_news.push(n);
          }
        }
      }
      //ordino
      return_news.sort((a, b) => (a.publish_date < b.publish_date ? 1 : -1));
      res.status(200).json(return_news);
    }
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
