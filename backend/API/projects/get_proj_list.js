const express = require("express");
const Project = require("../../models/projects");
const Manager = require("../../models/managers");
const User = require("../../models/users");
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
/**
 * @swagger
 * /api/get_all_projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve information for all projects and their associated managers.
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: List of all projects with associated manager details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the project
 *                   name:
 *                     type: string
 *                     description: The name of the project
 *                   description:
 *                     type: string
 *                     description: The description of the project
 *                   category:
 *                     type: string
 *                     description: The category of the project
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     description: The start date of the project
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     description: The end date of the project
 *                   opensource:
 *                     type: boolean
 *                     description: The opensource status of the project
 *                   manager:
 *                     type: object
 *                     description: Details of the associated manager
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the manager
 *                       username:
 *                         type: string
 *                         description: The username of the manager
 *                       name:
 *                         type: string
 *                         description: The name of the manager
 *                       surname:
 *                         type: string
 *                         description: The surname of the manager
 *                       age:
 *                         type: number
 *                         description: The age of the manager
 *                       phone:
 *                         type: string
 *                         description: The phone number of the manager
 *                       email:
 *                         type: string
 *                         description: The email of the manager
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of image filenames associated with the project
 *                 example:
 *                   - _id: "project123"
 *                     name: "Sample Project"
 *                     description: "A brief description of the project"
 *                     category: "Web Development"
 *                     start_date: "2024-01-01"
 *                     end_date: "2024-12-31"
 *                     opensource: true
 *                     manager:
 *                       _id: "user456"
 *                       username: "john_doe"
 *                       name: "John"
 *                       surname: "Doe"
 *                       age: 30
 *                       phone: "+1234567890"
 *                       email: "john.doe@example.com"
 *                     images: ["image1.jpg", "image2.jpg"]
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
router.get("/get_all_projects", async (req, res) => {
    try {
        // Retrieve all projects from the database
        const projects = await Project.find();
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            console.log(project);
            const manager = await Manager.findOne({ project_id: project._id });
            const user = await User.findById( manager.user_id );
            projects[i] = {
                _id: project._id,
                name: project.name, 
                description: project.description,
                category: project.category,
                start_date: project.start_date,
                end_date: project.end_date,
                opensource: project.opensource,
                manager: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    surname: user.surname,
                    age: user.age,
                    phone: user.phone,
                    email: user.email,
                },
                images: project.images
            };
        }
        // Respond with the users in JSON format
        res.status(200).json(projects);
    } catch (error) {
        // Respond with an error message
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
