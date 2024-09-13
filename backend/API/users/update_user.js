const express = require("express");
const User = require("../../models/users");
const validateToken = require("../validate_token");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());
/**
 * @swagger
 * /api/update_user:
 *   post:
 *     summary: Update user by ID
 *     description: Update user information by ID
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: JSON input containing user data to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *             name:
 *               type: string
 *             surname:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             age:
 *               type: number
 *             password:
 *               type: string
 *         example:
 *           id: "user123"
 *           username: "john_doe"
 *           name: "John"
 *           surname: "Doe"
 *           email: "john.doe@example.com"
 *           phone: "+1234567890"
 *           age: 30
 *           password: "newpassword"
 *     responses:
 *       '201':
 *         description: User Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *             example:
 *               message: User Updated Successfully
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
router.post("/update_user", validateToken, async (req, res) => {
  try {
    // Extract data from JSON input
    const { id, username, name, surname, email, phone, age, password } =
      req.body;
    // Update the user
    const user = await User.findById(id);
    if (!!user) {
      if (password != user.password) {
        if (await User.checkPassword(password)) {
          user.password = await User.encryptPassword(password);
          console.log(user.password + " " + password);
        } else {
          res
            .status(500)
            .json({ message: "password is not valid", type: "danger" });
          return;
        }
      }
      user.name = name;
      user.email = email;
      user.phone = phone;
      user.age = age;
      user.surname = surname;
      user.username = username;

      User.findByIdAndUpdate(id, user, { new: true })
        .then((data) => {
          // Respond with success message
          res.status(200).json({ message: "User Updated Successfully" });
        })
        .catch((error) => {
          res.json({ message: error, type: "danger" });
        });
    } else {
      res.status(404).json({ message: "User not found", type: "danger" });
    }
  } catch (error) {
    // Respond with error message
    res.status(500).json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
