const express = require("express");
const User = require("../../models/users");
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());

/**
 * @swagger
 * /api/get_all_users:
 *  
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users from the database.
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: Successful operation. Returns the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/users.js'
 *       500:
 *         description: Internal server error. Returns an error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 */

router.get("/get_all_users", async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find();
    // Respond with the users in JSON format
    res.status(200).json(users);
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
