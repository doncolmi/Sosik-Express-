import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import UserModel from "./user.model";
import AuthenticationService from "../authentication/authentication.service";
import UserDTO from "./user.dto";
import validate from "../../middleware/validation.middleware";

class UserController implements Controller {
  public path = "/user";
  public router = Router();
  public auth = new AuthenticationService();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getUserInfo);
  }

  private getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getUserInfo: any = await this.auth.getUserByToken(
          req.headers.authorization!
        );
        const UserInfo = {
            name: getUserInfo.name,
            profileImage: getUserInfo.profileImage,
            thumbnailImage: getUserInfo.thumbnailImage
        }
        res
          .json(UserInfo)
          .end();
      } catch (e) {
        next(e);
      }
  };
}

export default UserController;
