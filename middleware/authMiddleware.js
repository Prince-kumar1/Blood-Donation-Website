const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Split the token from the "Bearer" prefix
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Invalid authorization format. Use 'Bearer <token>'",
      });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify the token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Invalid or expired token",
        });
      } else {
        req.body.userId = decode.userId;
        next();
      }
    });
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error in authentication",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};