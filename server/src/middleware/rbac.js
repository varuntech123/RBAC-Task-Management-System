export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log(`[RBAC] Authorizing path: ${req.baseUrl}${req.path} | Required: ${roles} | Found: ${req.user.role}`);
    
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(`[RBAC] Authorization FAILED for role: ${req.user ? req.user.role : "none"}`);
      return res.status(403).json({
        message: `User role ${req.user ? req.user.role : "none"} is not authorized to access this route`,
      });
    }
    console.log(`[RBAC] Authorization PASSED`);
    next();
  };
};
