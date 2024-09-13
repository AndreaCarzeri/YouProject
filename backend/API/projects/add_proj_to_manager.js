const express = require("express");
const router = express.Router();
const Manager = require("../../models/managers");
const validate_token = require("../validate_token");
/**
 * @swagger
 * /api/add_project_to_manager:
 *   post:
 *     summary: Add project to manager
 *     description: Add a project to a manager's assignments
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing project_id and user_id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *               description: The ID of the project to be added
 *             user_id:
 *               type: string
 *               description: The ID of the manager to whom the project will be assigned
 *         example:
 *           project_id: "project123"
 *           user_id: "manager456"
 *     responses:
 *       '201':
 *         description: Project added successfully to a manager
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: Project added successfully to a manager
 *       '501':
 *         description: Project already assigned to manager
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the project is already assigned to the manager
 *                 type:
 *                   type: string
 *                   description: The type of error
 *             example:
 *               message: Project already assigned to manager
 *               type: danger
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 type:
 *                   type: string
 *                   description: The type of error
 *             example:
 *               message: Internal Server Error
 *               type: danger
 */
router.post("/add_project_to_manager", validate_token, async (req, res) => {
  try {
    const { project_id, user_id } = req.body;
    const managerExists = await Manager.findOne({ user_id, project_id });
    if(!managerExists){
        const manager = new Manager({
            user_id,
            project_id
        });
        await manager.save();
        res.status(201).json({ message: "Project added successfully to a manager" });
    }else{
        res.status(501).json({ message: "Project already assigned to manager", type: "danger" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
