
const express = require("express");
const Follower = require("../../models/follower");
const validateToken = require("../validate_token");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());
/**
 * @swagger
 * /api/unfollow_project:
 *   delete:
 *     summary: Unfollow a project
 *     description: Unfollow a project by providing user_id and project_id
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User ID and Project ID
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *               description: User ID
 *             project_id:
 *               type: string
 *               description: Project ID
 *     responses:
 *       201:
 *         description: The user unfollowed the project successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: User is not already following the project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user is not already following the project
 *                 type:
 *                   type: string
 *                   description: Error type
 *       500:
 *         description: Error occurred while unfollowing the project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 type:
 *                   type: string
 *                   description: Error type
 */
router.delete("/unfollow_project", validateToken, async (req, res) => {
  try {
    // Extract data from the POST input
    const { user_id, project_id } = req.body;
    const f = await Follower.findOne({ user_id, project_id });
    if (!!f) {
      await Follower.findByIdAndDelete(f._id);
      res
        .status(201)
        .json({ message: "The user unfollow the project Successfully" });
    } else {
        res.status(404).json({ message: "Already not following it", type: "danger" });
    }
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
