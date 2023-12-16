import jwt from "jsonwebtoken";
import {JWT_SECRET} from '../config.js'
import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";

const { compareSync } = bcryptjs;

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ message: 'Access denied',status:'400' });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  async function login(req, res) {
    try {
      const { email, password } = req.body;
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Verify the password
      const isPasswordValid = compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { userID: user.userID, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "1m",
        }
      );
        // Response JWT token
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
export { authenticateToken,login}
