import { User } from "../models/userModel.js";
import { ulid } from "ulid";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
const { compareSync, hashSync } = bcryptjs;

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "User email already exists" });
    }
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: "username already exists" });
    }

    // Hash the password
    const hashedPassword = hashSync(password, 10);

    const body = {
      userID: ulid(),
      username: username,
      email: email,
      password: hashedPassword,
    };
    await User.create(body);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

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
        expiresIn: "9h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllUser(req, res) {
  try {
    console.log(req);
    const users = await User.find();
    if (!users.length)
      return res.status(404).json({ message: "No user found" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function getUser(req, res) {
  try {
    console.log(req);
    console.log({userID: req.params.id});
    const users = await User.findOne({userID: req.params.id});
    console.log(users);
    if (!users)
      return res.status(404).json({ message: "No user found" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = hashSync(password, 10);
    console.log(req.user);
    await User.findOneAndUpdate(
      { userID: req.user.userID },
      {
        userID: req.user.userID,
        username,
        email,
        password: hashedPassword,
      }
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  try {
    await User.findOneAndDelete({ userID: req.user.userID });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function getUserWithService(req, res) {
try {
  const user = await User.findOne({ username:req.params.id });
  if(!user) return res.status(404).json({ message: "user not found" });

  const userDetail = await User.aggregate([
    {
      $match: {
        userID: user.userID
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "userID",
        foreignField: "userID",
        as: "subscriptions"
      }
    }
  ])

  if(!userDetail) res.status(404).json({ message: "No details found" })
  const [data] = userDetail
  const { username,email,subscriptions } = data;
  const d = `username: ${username}, email: ${email},${subscriptions.map(({serviceLink,serviceName,monthlyFee},i)=> {return ` 
Subscriptions ${i+1} :-
service Name: ${serviceName},
service Link: ${serviceLink},
monthly Fee: ${monthlyFee}`})}`

  res.json({message:d})
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal Server error"})
}
}
export { createUser, login, getAllUser, updateUser, deleteUser, getUser, getUserWithService };
