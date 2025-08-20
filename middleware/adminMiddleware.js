const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    // Check if userId is present in the request
    if (!req.body.userId) {
      return res.status(401).send({
        success: false,
        message: "User ID not found in request",
      });
    }

    const user = await userModel.findById(req.body.userId);
    
    // Check if user exists and is an admin
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Admin privileges required",
      });
    }

    next();
  } catch (error) {
    console.log("Admin Middleware Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error in admin verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};