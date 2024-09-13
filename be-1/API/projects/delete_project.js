const express = require("express");
const Project = require("../../models/projects");
const Manager = require("../../models/managers");
const news = require("../../models/news");
const collaborator = require("../../models/collaborators");
const follower = require("../../models/follower");
const fs = require("fs");
const path = require("path");
const validateToken = require("../validate_token");
const router = express.Router();
// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());

/**
 * @swagger
 * /api/delete_project:
 *   delete:
 *     summary: Delete project by ID
 *     description: Delete a project and associated manager by project ID.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing the project_id to be deleted.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             project_id:
 *               type: string
 *         example:
 *           project_id: "project123"
 *     responses:
 *       '201':
 *         description: Project Removed Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: Project Removed Successfully
 *       '404':
 *         description: Project or Manager Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the project or manager was not found
 *                 type:
 *                   type: string
 *                   description: The type of error
 *             example:
 *               message: Project Not Found
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

router.delete("/delete_project/", validateToken, async (req, res) => {
  const project = await Project.findById(req.body.project_id);
  if (!!project) {
    //eliminare le foto
    for (let i = 0; i < project.images.length; i++) {
      const directory = path.join(__dirname, "../../projects_images/");
      const filePath = directory + project.images[i];
      try {
        fs.unlinkSync(filePath);
        //file removed
      } catch (err) {
        console.error(err);
      }
    }
    Project.findByIdAndDelete(project._id)
      .then((data) => {
        if (data == null)
          res.status(404).json({ message: "Project Not Found" });
        else {
          Manager.findOneAndDelete({ project_id: project._id })
            .then(async (data) => {
              if (data == null)
                res.status(404).json({ message: "Manager Not Found" });
              else {
                await follower.deleteMany({ project_id: project._id });
                await collaborator.deleteMany({ project_id: project._id });
                await news.deleteMany({ project_id: project._id });
                res
                  .status(201)
                  .json({ message: "Project Removed Successfully" });
              }
            })
            .catch((error) => {
              res.status(500).json({ message: error.message, type: "danger" });
            });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message, type: "danger" });
      });
  } else {
    res.status(404).json({ message: "Project Not Found" });
  }
});

module.exports = router;
