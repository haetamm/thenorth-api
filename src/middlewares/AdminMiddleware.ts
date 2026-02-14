import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../utilities/interface';

export const admin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - Not authenticated' })
      .end();
  }

  if (
    !req.user.roles ||
    req.user.roles.length === 0 ||
    req.user.roles[0] !== 'ADMIN'
  ) {
    return res.status(403).json({ message: 'Access denied!!' }).end();
  }

  next();
};
