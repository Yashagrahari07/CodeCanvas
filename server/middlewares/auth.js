import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    let decodedData;
    try {
      console.log(token);
      
      decodedData = jwt.verify(token, process.env.SECRET_KEY);
      
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next(); // pass action to next functionality that user wants to
  } catch (error) {
    console.error("Authentication error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default auth;
