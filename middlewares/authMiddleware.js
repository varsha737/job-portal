import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      success: false,
      message: "Auth Failed: No token provided"
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Auth Failed: Token expired"
      });
    }
    return res.status(401).json({
      success: false,
      message: "Auth Failed: Invalid token"
    });
  }
};

export default userAuth;

