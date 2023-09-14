import { subsSchema } from "../models/subscriptionmodel.js";
import { ulid } from "ulid";
import { User } from "../models/userModel.js";

async function createSubs(req, res) {
  const { serviceName, serviceLink, monthlyFee } = req.body;
  // Create a subscription object from res body
  const body = {
    serviceID: ulid(),
    serviceLink: serviceLink,
    serviceName: serviceName,
    monthlyFee: monthlyFee,
    userID: req.user.userID,
    startDate: new Date(),
  };
  // Create subscription for resister user
  const ress = await subsSchema.create(body);
  if (ress)
    return res.status(200).json({
      message: `subscription added successfully with ${serviceName} and serviceID ${body.serviceID}`,
    });
  return res.sendStatus(400);
}

async function getSubsByUserIDServID(req, res) {
  try {
    // Check user is checking their subscription then fetch user all subscriptions
    if (req.user.userID === req.params.id) {
      // Fetch all subscription of user by their userID
      const subscriptions = await subsSchema.find({ userID: req.user.userID });
      // error is subscription not found
      if (!subscriptions.length)
        return res.status(404).json({ message: "No subscriptions found" });
      return res.json(subscriptions);
    }
    // else fetch subscription by seriveID
    const subscriptions = await subsSchema.findOne({
      serviceID: req.params.id,
      userID: req.user.userID,
    });
    // Error if subscription not found
    if (!subscriptions)
      return res.status(404).json({ message: "No subscriptions found" });
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateSubsByServID(req, res) {
  try {
    // Find subscription detail by serviceID and userID
    const subscription = await subsSchema.findOneAndUpdate(
      {
        serviceID: req.params.id,
        userID: req.user.userID,
      },
      {
        ...(req.body.serviceName ? { serviceName: req.body.serviceName } : {}),
        ...(req.body.serviceLink ? { serviceLink: req.body.serviceLink } : {}),
        ...(req.body.monthlyFee ? { monthlyFee: req.body.monthlyFee } : {}),
      }
    );
    // Error if subscription not found
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteByUserIDservID(req, res) {
  try {
    //Check if login user is deleting their subscription or not
    if (req.params.id === req.user.userID) {
      // Delete all subscription of user
      const deleteMany = await subsSchema.deleteMany({
        userID: req.user.userID,
      });
      if (!deleteMany)
        return res.status(404).json({ message: "Subscription not found" });
      return res.status(200).json({
        message: `Subscription Of ${req.user.userID} deleted successfully`,
      });
    }
    // Check if delete request is by serviceID and delete it by login userID and serviceID
    const subscription = await subsSchema.findOneAndDelete({
      serviceID: req.params.id,
      userID: req.user.userID,
    });
    // Error if subscription not found
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    return res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createSubsByDiscord(req, res) {
  try {
    const { username, serviceLink, serviceName, monthlyFee } = req.body;
    // check if authenticated user exist or not if not response user to register first 
    const user = await User.findOne({ username });
    if (!user)
      res.status(404).json({
        message: `${username} not registered, register user by using prompt /ppcreateuser`,
      });
      // if user exist create subscription
    const body = {
      serviceID: ulid(),
      serviceLink: serviceLink,
      serviceName: serviceName,
      monthlyFee: monthlyFee,
      userID: user.userID,
      startDate: new Date(),
    };
    const ress = await subsSchema.create(body);
    // sucessfully created subscription then provide detail of it 
    if (ress)
      return res.status(200).json({
        message: `subscription added successfully for ${username} with Service Name ${serviceName} and serviceID ${body.serviceID}`,
      });
    return res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  createSubs,
  getSubsByUserIDServID,
  updateSubsByServID,
  deleteByUserIDservID,
  createSubsByDiscord,
};
