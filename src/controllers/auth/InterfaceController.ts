import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../utilities/interface";

interface IController {
  index(req: AuthenticatedRequest, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
}

export default IController;
