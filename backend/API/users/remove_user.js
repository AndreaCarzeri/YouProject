const express = require("express");
const validateToken = require("../validate_token");
const User = require("../../models/users");
const Project = require("../../models/projects");
const Manager = require("../../models/managers");
const Collaborator = require("../../models/collaborators");
const Follower = require("../../models/follower");
const axios = require("axios");
const mongoose = require("mongoose");
const news = require("../../models/news");
const router = express.Router();
// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());
/**
 * @swagger
 * /api/remove_user:
 *   delete:
 *     summary: Remove user by ID
 *     description: Remove a user from the database by ID
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Numeric ID of the user to be removed
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *         example:
 *           id: "user123"
 *     responses:
 *       '201':
 *         description: User Removed Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: User Removed Successfully
 *       '404':
 *         description: User Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user was not found
 *             example:
 *               message: User Not Found
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
router.delete("/remove_user/", validateToken, (req, res) => {
  let id = req.body.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  User.findByIdAndDelete(id)
    .then(async (data) => {
      if (data == null) res.status(404).json({ message: "User Not Found" });
      else {
        const managers = await Manager.find({ user_id: id });
        if (!!managers) {
          const token = req.header("token");
          for (const m of managers) {
            const options = {
              headers: {
                token: token,
              },
              data: { project_id: m.project_id }, // Dati da inviare nel corpo della richiesta
            };
            try {
                const response = await axios.delete("http://localhost:5000/api/delete_project", options);
              } catch (apiError) {
                console.error("Error in project deletion API:", apiError.response.data);
                // Puoi gestire l'errore qui in base alle tue esigenze
              }
          }
        }
        await Collaborator.deleteMany({ user_id: id });
        await Follower.deleteMany({ user_id: id });
        res.status(201).json({ message: "User Removed Successfully" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error.message, type: "danger" });
    });
});

module.exports = router;
