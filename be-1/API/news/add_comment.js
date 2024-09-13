// Import necessary modules and dependencies
const express = require("express");
const router = express.Router();
const News = require("../../models/news");
const User = require("../../models/users");
const validateToken = require("../validate_token");
router.use(express.json());
/**
 * @swagger
 * /api/add_comment_news:
 *   post:
 *     summary: Add a comment to news
 *     description: Add a comment to a specific news article.
 *     tags:
 *       - News
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing news_id, username, and comment.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             news_id:
 *               type: string
 *               description: The ID of the news article to comment on.
 *             username:
 *               type: string
 *               description: The username of the user adding the comment.
 *             comment:
 *               type: string
 *               description: The comment text to be added.
 *         example:
 *           news_id: "news123"
 *           username: "john_doe"
 *           comment: "Great article!"
 *     responses:
 *       '201':
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: Comment added successfully
 *       '404':
 *         description: News or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the news or user was not found
 *             example:
 *               message: News or user Not Found
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
// Define the route for adding a comment to a news
router.post("/add_comment_news", validateToken, async (req, res) => {
  try {
    const { news_id, username } = req.body;
    const news = await News.findById(news_id);
    const user = await User.findOne({username: username});

    if (!!news && !!user) {
      news.comments.push({
        username: username,
        comment: req.body.comment
      });
      await news.save();
        res.status(201).json({ message: "Comment added successfully" });
    }else{
        res.status(404).json({ message: "News or user Not Found" });
    }
  } catch (error) {
    // Return an error response
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
