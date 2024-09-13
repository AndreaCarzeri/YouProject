const express = require("express");
const User = require("../../models/users");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());

/**
 * @swagger
 * /api/add_user:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to add
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             name:
 *               type: string
 *             surname:
 *               type: string
 *             age:
 *               type: number
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: User Added Successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: ["danger"]
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: ["danger"]
 */
  
router.post("/add_user", async (req, res) => {
    try {
        // Extract data from the POST input
        const { username, name, surname, age, phone, email, password } = req.body;

        if (await User.checkPassword(password)) {
            // Create a new user
            const newUser = new User({
                username,
                name,
                surname,
                age,
                phone,
                email,
                password,
            });

            // Save the user to the database
            await newUser.save();

            // Respond with a success message
            res.status(201).json({ message: "User Added Successfully" });
        } else {
            res.status(400).json({ message: "password is not valid", type: "danger" });
        }
    } catch (error) {
        // Respond with an error message
        res.status(501).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
