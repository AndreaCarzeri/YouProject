const express = require("express");
const User = require("../../models/users");
const router = express.Router();

// Middleware per gestire i dati JSON nelle richieste
router.use(express.json());


/**
 * @swagger
 * /api/get_user_by_id:
 *   post:
 *     summary: Get user by ID
 *     description: Retrieve user information by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Numeric ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *         example:
 *           id: "user123"
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 name:
 *                   type: string
 *                   description: The name of the user
 *                 surname:
 *                   type: string
 *                   description: The surname of the user
 *                 phone:
 *                   type: string
 *                   description: The phone number of the user
 *                 age:
 *                   type: number
 *                   description: The age of the user
 *             example:
 *               username: john_doe
 *               email: john.doe@example.com
 *               name: John
 *               surname: Doe
 *               phone: +1234567890
 *               age: 30
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

router.post("/get_user_by_id", async (req, res) => {
  const { id } = req.body;
  try {
    // Retrieve all users
    const user = await User.findById(id);
    const specialUser = {
      username: user.username,
      email: user.email,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      age: user.age,
      supported_projects: user.supported_projects,
    };
    // Respond with the users in JSON format
    res.status(200).json(specialUser);
  } catch (error) {
    // Respond with an error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
