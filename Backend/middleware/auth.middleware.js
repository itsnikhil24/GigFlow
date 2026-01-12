import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;


    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    // Token expired or invalid
    return res.status(401).json({
      message: "Not authorized, token invalid or expired",
    });
  }
};
