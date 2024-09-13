const express = require("express");
const User = require("../../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to handle JSON data in requests
router.use(express.json());

/**
 * @swagger
 * /api/login_user:
 *   post:
 *     summary: User login
 *     description: Authenticate user and generate JWT token
 *     tags:
 *      - Users
 *     parameters:
 *       - in: body
 *         name: userCredentials
 *         description: User credentials for login
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The username for login
 *             password:
 *               type: string
 *               description: The password for login
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post("/login_user", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Nome utente non trovato" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password errata" });
    }

    // Puoi creare un token JWT per l'autenticazione se le credenziali sono valide
    const token = jwt.sign({ username: username }, "ABFC", {
      expiresIn: 864000,
    });

    res.status(200).json({ message: "Login riuscito", token, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante il login", error: error.message });
  }
});

module.exports = router;
