import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utilities/interface";
import UserRepository from "../repository/UserRepository";
import GettedUser from "../entities/GetttedUser";
import AuthenticationService from "../service/AuthenticationService";

export const guest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.user = undefined;
    return next();
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized - Malformed token" }).end();
    }

    try {
      const decoded = await AuthenticationService.decodeToken(token);
      const user = await UserRepository.getUserById(decoded.user.sub);

      if (!user) {
        res
          .status(401)
          .json({ message: "Unauthorized - Not authenticated" })
          .end();
      } else {
        const data = new GettedUser(user);
        req.user = data;
        next();
      }
    } catch (err) {
      res.status(401).json({ message: "Unauthorized - Invalid token" }).end();
    }
  }
};
