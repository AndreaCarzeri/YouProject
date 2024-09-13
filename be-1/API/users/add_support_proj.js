const express = require("express");
const User = require("../../models/users");
const validateToken = require("../validate_token");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());
/**
 * @swagger
 * /api/add_support_proj:
 *   post:
 *     summary: Add support to a project for a user
 *     description: Add support to a project for a user by incrementing the supported_projects count
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
 *         description: The user successfully supported a new project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: The user supported a new project successfully
 *       401:
 *         description: User does not exist
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
 *             example:
 *               message: User does not exist
 *               type: danger
 *       500:
 *         description: Internal server error
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
 *             example:
 *               message: Internal server error
 *               type: danger
 */
router.post("/add_support_proj", validateToken, async (req, res) => {
  try {
    // Extract data from the POST input
    const { user_id } = req.body;
    const u = await User.findById(user_id);
    if (!!u) {
      u.supported_projects += 1;
      await u.save();
      res
        .status(201)
        .json({ message: "The user support a new project Successfully" });
    } else {
      res.status(401).json({ message: "User does not exist", type: "danger" });
    }
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
