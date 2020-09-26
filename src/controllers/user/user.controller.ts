import {
  Request as Req,
  Response as Res,
  NextFunction as Next,
  Router,
} from "express";
import Controller from "../../interfaces/controller.interface";

import UserService from "./user.service";
import AuthenticationService from "../authentication/authentication.service";

import error from "../../middleware/error.middleware";

class UserController implements Controller {
  public path = "/user";
  public router = Router();

  private user = new UserService();
  private auth = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getUserInfo);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.deleteUserInfo);
  }

  private getUserInfo = async (req: Req, res: Res, next: Next) => {
    try {
      const getUserInfo: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const UserInfo = {
        name: getUserInfo.name,
        profileImage: getUserInfo.profileImage,
        thumbnailImage: getUserInfo.thumbnailImage,
        createdDate: getUserInfo.createdDate,
      };
      res.json(UserInfo).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private deleteUserInfo = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId } = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const deleteUser = this.user.deleteUser(userId);
      res
        .clearCookie("refreshToken", {
          path: "/",
          secure: true,
          domain: ".limc-pf.com",
        })
        .json(deleteUser);
    } catch (e) {
      error(e, req, res, next);
    }
  };
}

export default UserController;
