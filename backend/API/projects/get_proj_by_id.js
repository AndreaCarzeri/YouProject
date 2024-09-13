const express = require("express");
const Project = require("../../models/projects");
const User = require("../../models/users");
const Manager = require("../../models/managers");
const mongoose = require('mongoose');
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
/**
 * @swagger
 * /api/get_proj_by_id:
 *   post:
 *     summary: Get project by ID
 *     description: Retrieve project information by ID.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing the project_id to retrieve.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *         example:
 *           project_id: "project123"
 *     responses:
 *       '200':
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                 project:
 *                   type: object
 *                   description: The details of the retrieved project
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the project
 *                     name:
 *                       type: string
 *                       description: The name of the project
 *                     description:
 *                       type: string
 *                       description: The description of the project
 *                     category:
 *                       type: string
 *                       description: The category of the project
 *                     start_date:
 *                       type: string
 *                       format: date
 *                       description: The start date of the project
 *                     end_date:
 *                       type: string
 *                       format: date
 *                       description: The end date of the project
 *                     opensource:
 *                       type: boolean
 *                       description: The opensource status of the project
 *                 example:
 *                   message: Project found!
 *                   project:
 *                     _id: "project123"
 *                     name: "Sample Project"
 *                     description: "A brief description of the project"
 *                     category: "Web Development"
 *                     start_date: "2024-01-01"
 *                     end_date: "2024-12-31"
 *                     opensource: true
 *       '404':
 *         description: Project does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the project does not exist
 *                 type:
 *                   type: string
 *                   description: The type of error
 *             example:
 *               message: Project does not exist
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
router.post("/get_proj_by_id", async (req, res) => {
    try {
        const { project_id } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(project_id)) {
            res.status(400).json({ message: "Invalid project_id", type: "danger" });
            return;
        }

        const project = await Project.findById(project_id);
        const manager = await Manager.findOne({ project_id: project_id});
        const user = await User.findById(manager.user_id);
        if (!!project && !!user) {
            res.status(200).json({ message: "Project found!", project, user });
        } else {
            res.status(404).json({ message: "Project does not exist", type: "danger" });
        }    
    } catch (error) {
        // Respond with an error message
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
