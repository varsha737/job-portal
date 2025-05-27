import User from '../models/userModel.js';

const checkRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: 'Access denied. You do not have permission to perform this action.'
        });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkRole; 