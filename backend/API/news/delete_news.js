const express = require("express");
const validateToken = require("../validate_token");
const News = require("../../models/news");
const router = express.Router();
// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());

/**
 * @swagger
 * /api/delete_news:
 *   delete:
 *     summary: Delete news
 *     description: Delete a specific news item based on its news_id.
 *     tags:
 *       - News
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Object containing the news_id to be deleted.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             news_id:
 *               type: string
 *               description: The unique identifier for the news item to be deleted.
 *               example: "news123"
 *     responses:
 *       201:
 *         description: News deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *             example:
 *               message: "News Removed Successfully"
 *       404:
 *         description: News not found.
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
 *               message: "News Not Found"
 *               type: danger
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

router.delete("/delete_news/", validateToken, (req, res) => {
    let news_id = req.body.news_id;
    News.findByIdAndDelete(news_id)
      .then((data) => {
        if(data == null) 
            res.status(404).json({ message: "News Not Found" });
        else
            res.status(201).json({ message: "News Removed Successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message, type: "danger" });
      });
  });

module.exports = router;
