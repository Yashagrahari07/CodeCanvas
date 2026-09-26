import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      req.user = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const authorizeUser = (req, res, next) => {
  if (!req.user?.id || String(req.user.id) !== req.params.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export default auth;
