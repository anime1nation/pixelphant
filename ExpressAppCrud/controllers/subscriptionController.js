import { subsSchema } from "../models/subscriptionmodel.js";
import { ulid } from "ulid";
import { User } from "../models/userModel.js";

async function createSubs(req, res) {
  const { serviceName, serviceLink, monthlyFee } = req.body;
  console.log(req.user.userID);
  const body = {
    serviceID: ulid(),
    serviceLink: serviceLink,
    serviceName: serviceName,
    monthlyFee: monthlyFee,
    userID: req.user.userID,
    startDate: new Date(),
  };
  const ress = await subsSchema.create(body);
  if (ress)
    return res.status(200).json({
      message: `subscription added successfully with ${serviceName} and serviceID ${body.serviceID}`,
    });
  return res.sendStatus(400);
}

async function getAllSubs(req, res) {
  try {
    const subscriptions = await subsSchema.find({ userID: req.user.userID });
    if (!subscriptions.length)
      return res.status(404).json({ message: "No subscriptions found" });
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getSubsByServID(req, res) {
  try {
    const subscriptions = await subsSchema.findOne({
      serviceID: req.params.id,
      userID: req.user.userID,
    });
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
    const { serviceName, serviceLink, monthlyFee } = req.body;
    const subscription = await subsSchema.findOne({
      serviceID: req.params.id,
      userID: req.user.userID,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.serviceName = serviceName;
    subscription.serviceLink = serviceLink;
    subscription.monthlyFee = monthlyFee;

    await subscription.save();

    res.json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteByServID(req, res) {
  try {
    const subscription = await subsSchema.findOne({
      serviceID: req.params.id,
      userID: req.user.userID,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await subscription.deleteOne();

    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteManyByUserID(req, res) {
  try {
    const deleteMany = await subsSchema.deleteMany({ userID: req.user.userID });
    if (deleteMany)
      return res.status(200).json({
        message: `Subscription Of ${req.user.userID} deleted successfully`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createSubsByDiscord(req, res) {
  try {
    const { username, serviceLink, serviceName, monthlyFee } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      res
        .status(404)
        .json({
          message: `${username} not registered, register user by using prompt /ppcreateuser`,
        });

    const body = {
      serviceID: ulid(),
      serviceLink: serviceLink,
      serviceName: serviceName,
      monthlyFee: monthlyFee,
      userID: user.userID,
      startDate: new Date(),
    };
    const ress = await subsSchema.create(body);
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
  getAllSubs,
  updateSubsByServID,
  deleteByServID,
  getSubsByServID,
  deleteManyByUserID,
  createSubsByDiscord
};
