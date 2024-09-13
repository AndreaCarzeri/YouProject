// Import required modules
const express = require("express");
const router = express.Router();
const Project = require("../../models/projects");
const User = require("../../models/users");
const Manager = require("../../models/managers");
const validate_token = require("../validate_token");

/**
 * @swagger
 * /api/add_project:
 *   post:
 *     summary: Add a new project
 *     description: Add a new project to the database.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Bearer JWT token (present in cookies).
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: JSON input containing project details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the project
 *             description:
 *               type: string
 *               description: The description of the project
 *             category:
 *               type: string
 *               description: The category of the project
 *             start_date:
 *               type: string
 *               format: date
 *               description: The start date of the project
 *             end_date:
 *               type: string
 *               format: date
 *               description: The end date of the project
 *             opensource:
 *               type: boolean
 *               description: The opensource status of the project
 *             manager:
 *               type: string
 *               description: The username of the project manager
 *         example:
 *           name: "Sample Project"
 *           description: "A brief description of the project"
 *           category: "Web Development"
 *           start_date: "2024-01-01"
 *           end_date: "2024-12-31"
 *           opensource: true
 *           manager: "john_doe"
 *     responses:
 *       '201':
 *         description: Project added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: Project added successfully
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
router.post("/add_project", validate_token, async (req, res) => {
  // Get the project data from the request body
  try {
    const {
      name,
      description,
      category,
      start_date,
      end_date,
      opensource,
      manager
    } = req.body;
    const project = new Project({
      name,
      description,
      category,
      start_date,
      end_date,
      opensource
    });

    const managerExists = await User.findOne({ username: manager });
    
    if(!!managerExists){
      const user_id=managerExists._id;
      const project_id=project._id;
      const manager = new Manager({
        user_id,
        project_id
      });
    await manager.save();
    await project.save();
    res.status(201).json({ message: "Project added successfully", project_id: project._id});
    }else{
        res.status(500).json({ message: "User does not exists", type: "danger" });
    }
    // Save the project to the database
    
    
  } catch (error) {
    res.status(500).json({ message: error.message, type: "danger" });
  }

});

module.exports = router;
