const express = require("express");
const Project = require("../../models/projects");
const Manager = require("../../models/managers");
const User = require("../../models/users");
const validateToken = require("../validate_token");
8;
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
/**
 * @swagger
 * /api/get_proj_created:
 *   post:
 *     summary: Get projects created by a user
 *     description: Retrieve projects created by a user based on their user_id.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User ID for getting projects created by the user.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *               description: User ID for getting projects created by the user.
 *         example:
 *           user_id: "user123"
 *     responses:
 *       200:
 *         description: Successful response with a list of projects created by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the project.
 *                   name:
 *                     type: string
 *                     description: The name of the project.
 *                   description:
 *                     type: string
 *                     description: The description of the project.
 *                   category:
 *                     type: string
 *                     description: The category of the project.
 *                   start_date:
 *                     type: string
 *                     description: The start date of the project.
 *                   end_date:
 *                     type: string
 *                     description: The end date of the project.
 *                   opensource:
 *                     type: boolean
 *                     description: The opensource status of the project.
 *                   manager:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the manager.
 *                       username:
 *                         type: string
 *                         description: The username of the manager.
 *                       name:
 *                         type: string
 *                         description: The name of the manager.
 *                       surname:
 *                         type: string
 *                         description: The surname of the manager.
 *                       age:
 *                         type: number
 *                         description: The age of the manager.
 *                       phone:
 *                         type: string
 *                         description: The phone number of the manager.
 *                       email:
 *                         type: string
 *                         description: The email of the manager.
 *                   images:
 *                     type: array
 *                     description: An array of image URLs associated with the project.
 *                     items:
 *                       type: string
 *                 example:
 *                   - _id: "project123"
 *                     name: "Project Name"
 *                     description: "Project Description"
 *                     category: "Technology"
 *                     start_date: "2024-01-01"
 *                     end_date: "2024-12-31"
 *                     opensource: true
 *                     manager:
 *                       _id: "user123"
 *                       username: "john_doe"
 *                       name: "John"
 *                       surname: "Doe"
 *                       age: 30
 *                       phone: "+1234567890"
 *                       email: "john.doe@example.com"
 *                     images:
 *                       - "image1.jpg"
 *                       - "image2.jpg"
 *                   - ... (additional projects created by the user)
 *       500:
 *         description: Internal Server Error
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
router.post("/get_proj_created", validateToken, async (req, res) => {
  try {
    const user_id = req.body.user_id;
    // Retrieve all projects from the database
    const created = await Manager.find({ user_id: user_id });
    const return_projects = [];
    for (let i = 0; i < created.length; i++) {
      const project = await Project.findById(created[i].project_id);
      const user = await User.findById(user_id);
      f = {
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
        images: project.images,
      };
        return_projects.push(f);
    }
    // Respond with the users in JSON format
    res.status(200).json(return_projects);
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
