import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(' ')[1];
  
  if (!token)
    return res.status(401).json({
      message: "No token found",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.user = {
      userId: decoded.userId,
      role: decoded.role || "user" 
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};
