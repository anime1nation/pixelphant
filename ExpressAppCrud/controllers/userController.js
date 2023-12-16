import { User } from "../models/userModel.js";
import { ulid } from "ulid";
import bcryptjs from "bcryptjs";

const { hashSync } = bcryptjs;

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    // Check if the user email exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "User email already exists" });
    }
    if(!username || !email || !password) {
      return res.status(400).json({message:""})
    }
    // Check if the user username is already exists 
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
    // Create user
    await User.create(body);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllUser(req, res) {
  try {
    // Find all user
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
    // Find userwith userID
    const users = await User.findOne({userID: req.params.id});
    if (!users)
      return res.status(404).json({ message: "No user found" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateUser(req, res) {
  try {
    // check login user updating their user credentials
    if(req.params.id !== req.user.userID) return res.status(401).json({ message: "Unauthorized" });
    //finding the user with userID and updating the credentials
    const updateUser = await User.findOneAndUpdate(
      { userID: req.params.id },
      {
        ...(req.body.username? {username:req.body.username} : {}),
        ...(req.body.email? {email:req.body.email} : {}),
        ...(req.body.password? {password:hashSync(req.body.password, 10)} : {}),
      }
    );
    //check if user exists or not
    if(!updateUser) return res.status(404).json({ message:"User not found"})
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  try {
    // check login user updating their user credentials
    if(req.params.id !== req.user.userID) return res.status(401).json({ message: "Unauthorized" });
    //finding the user with userID and deleting user credentials
    await User.findOneAndDelete({ userID: req.user.userID });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function getUserWithService(req, res) {
try {
  // Finding user detail with the username
  const user = await User.findOne({ username:req.params.id });
  // error if not found
  if(!user) return res.status(404).json({ message: "user not found" });
  //if user found then finding user subscription detail and join with user data
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
  //creating data to show if userdetail with subscription is found
  const [data] = userDetail
  const { username,email,subscriptions } = data;
  const details = `username: ${username}, email: ${email},${subscriptions.map(({serviceLink,serviceName,monthlyFee},i)=> {return ` 
Service  ${i+1} :-
service Name: ${serviceName},
service Link: ${serviceLink},
monthly Fee: ${monthlyFee}`})}`

  res.json({message:details})
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal Server error"})
}
}
export { createUser, getAllUser, updateUser, deleteUser, getUser, getUserWithService };
