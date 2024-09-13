const express = require("express");
const Project = require("../../models/projects");
const User = require("../../models/users");
const mongoose = require('mongoose');
const Collaborators = require("../../models/collaborators");
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
/**
 * @swagger
 * /api/get_collabs_from_proj:
 *   post:
 *     summary: Get collaborators from a project
 *     description: Retrieve collaborators associated with a specific project.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User ID and Project ID
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *               description: Project ID
 *     responses:
 *       200:
 *         description: Collaborators retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 collaborators:
 *                   type: array
 *                   items:
 *                     $ref: './models/users'
 *       404:
 *         description: Project not found.
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
 *               message: "Project does not exist"
 *               type: danger
 *       400:
 *         description: Invalid project_id.
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
 *               message: "Invalid project_id"
 *               type: danger
 *       500:
 *         description: Internal Server Error.
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


router.post("/get_collabs_from_proj", async (req, res) => {
    try {
        const { project_id } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(project_id)) {
            res.status(400).json({ message: "Invalid project_id", type: "danger" });
            return;
        }

        const project = await Project.findById(project_id);
        const collaborators = await Collaborators.find({ project_id: project_id});
        const returnUsers = [];
        if(!!project && !!collaborators){
            for (let i = 0; i < collaborators.length; i++) {
                const user = await User.findById(collaborators[i].user_id);
                returnUsers.push(user);
            }
            if(returnUsers.length === 0){
                res.status(200).json({ message: "No collaborators found", collaborators: returnUsers});
                return;
            }
            res.status(200).json({ message: "Collaborators found!", collaborators: returnUsers });
        }else{
            res.status(404).json({ message: "Project does not exist", type: "danger" });
        }
          
    } catch (error) {
        // Respond with an error message
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
