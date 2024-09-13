// Import necessary modules and dependencies
const express = require("express");
const router = express.Router();
const News = require("../../models/news");
const User = require("../../models/users");
const validateToken = require("../validate_token");
router.use(express.json());

/**
 * @swagger
 * /api/add_or_remove_like:
 *   post:
 *     summary: Add or remove a like from news
 *     description: Add or remove a like to/from a specific news article.
 *     tags:
 *       - News
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing news_id and username.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             news_id:
 *               type: string
 *               description: The ID of the news article to add or remove a like from.
 *             username:
 *               type: string
 *               description: The username of the user adding or removing the like.
 *         example:
 *           news_id: "news123"
 *           username: "john_doe"
 *     responses:
 *       '201':
 *         description: Like operation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: Like added successfully
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
router.post("/add_or_remove_like", validateToken, async (req, res) => {
  try {
    const { news_id, username } = req.body;
    const news = await News.findById(news_id);
    const user = await User.findOne({username: username});

    if (!!news && !!user) {
      
      if (!news.likes.includes(username)) {
        news.likes.push(username);
        await news.save();
        res.status(201).json({ message: "Like added successfully" });
      } else {
        news.likes.pull(username);
        await news.save();
        res.status(201).json({ message: "Like removed successfully" });
      }
    }else{
        res.status(404).json({ message: "News or user Not Found" });
    }
  } catch (error) {
    // Return an error response
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
