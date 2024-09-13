/**
 * @swagger
 * /api/follow_project:
 *   post:
 *     summary: Follow a project
 *     description: Follow a project by providing user_id and project_id
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
 *         description: The user followed a new project successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message
 *       401:
 *         description: User does not exist
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *             type:
 *               type: string
 *               description: Error type
 *       402:
 *         description: Project does not exist
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *             type:
 *               type: string
 *               description: Error type
 *       403:
 *         description: User is a manager of this project
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *             type:
 *               type: string
 *               description: Error type
 *       405:
 *         description: Already following the project
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *             type:
 *               type: string
 *               description: Error type
 */
const express = require("express");
const User = require("../../models/users");
const Follower = require("../../models/follower");
const Project = require("../../models/projects");
const Manager = require("../../models/managers");
const validateToken = require("../validate_token");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());

router.post("/follow_project", validateToken, async (req, res) => {
  try {
    // Extract data from the POST input
    const { user_id, project_id } = req.body;
    const u = await User.findById(user_id);
    const p = await Project.findById(project_id);
    const m = await Manager.findOne({ project_id, user_id });
    const f = await Follower.findOne({ user_id, project_id });
    if (!f && !!u && !!p && !m) {
      const follower = new Follower({
        user_id,
        project_id,
      });
      await follower.save();
      res
        .status(201)
        .json({ message: "The user follow a new project Successfully" });
    } else {
      if (!!f)
        res.status(405).json({ message: "Already following", type: "danger" });
      else if (!u)
        res
          .status(401)
          .json({ message: "User does not exists", type: "danger" });
      else if (!p)
        res
          .status(402)
          .json({ message: "Project does not exists", type: "danger" });
      else if (!!m)
        res
          .status(403)
          .json({
            message: "User is a manager of this project",
            type: "danger",
          });
    }
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
