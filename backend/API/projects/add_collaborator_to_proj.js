/**
 * @swagger
 * /api/add_collaborator_to_proj:
 *   post:
 *     summary: Add collaborator to project
 *     description: Add a collaborator to a project
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request body containing project_id and user_id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *             user_id:
 *               type: string
 *     responses:
 *       201:
 *         description: Project added successfully to a collaborator
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       401:
 *         description: This project has yet this collaborator
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             type:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             type:
 *               type: string
 */
const express = require("express");
const router = express.Router();
const Manager = require("../../models/managers");
const Follower = require("../../models/follower");
const Collaborator = require("../../models/collaborators");
const validate_token = require("../validate_token");

router.post("/add_collaborator_to_proj", validate_token, async (req, res) => {
  try {
    const { project_id, user_id } = req.body;
    const collaboratorExists = await Collaborator.findOne({ user_id, project_id });
    const managerExists = await Manager.findOne({ user_id, project_id });
    if(!collaboratorExists && !managerExists){
        const collaborator = new Collaborator({
            user_id,
            project_id
        });
        await collaborator.save();
        const follower = await Follower.findOne({ user_id, project_id });
        if(!follower){
            const follower = new Follower({
                user_id,
                project_id
            });
            await follower.save();
        }
        res.status(201).json({ message: "Project added successfully to a collaborator" });
    }else{
        res.status(401).json({ message: "This project has yet this collaborator", type: "danger" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
