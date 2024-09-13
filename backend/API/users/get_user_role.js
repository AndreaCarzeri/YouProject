
const express = require("express");
const User = require("../../models/users");
const Project = require("../../models/projects");
const Manager = require("../../models/managers");
const Collaborator = require("../../models/collaborators");
const validateToken = require("../validate_token");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());

/**
 * @swagger
 * /api/get_user_role:
 *   post:
 *     summary: Get the role of a user in a project
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
 *         description: Role successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role_id:
 *                   type: integer
 *             example:
 *               role_id: 2
 *       404:
 *         description: User or project not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: User/Project Not Found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *             example:
 *               message: Internal server error
 *               type: danger
 */
// logged = 0
// collaborator = 1
// manager = 2
router.post("/get_user_role", validateToken, async (req, res) => {
    try {
        // Extract data from the POST input
        const { user_id, project_id } = req.body;
        const u = await User.findById(user_id);
        const p = await Project.findById(project_id);
        const m = await Manager.findOne({ project_id, user_id });
        if (!!u && !!p) {
            if (!!m) {
                res.status(201).json({ role_id: 2 });
            } else {
                const c = await Collaborator.findOne({ project_id, user_id });
                if (!!c) {
                    res.status(201).json({ role_id: 1 });
                } else {
                    res.status(201).json({ role_id: 0 });
                }
            }
        } else {
            res.status(404).json({ message: "User/Project Not Found" });
        }
    } catch (error) {
        // Respond with an error message
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
