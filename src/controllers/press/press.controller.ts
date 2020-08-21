import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "../user/user.model";
import pressModel from "./press.model";
import pressFollowModel from "./pressFollow.model";
import { Press } from "./press.interface";
import AuthenticationService from "../authentication/authentication.service";
import { User } from "../user/user.interface";

class PressController implements Controller {
  public path = "/press";
  public router = Router();

  private user = userModel;
  private press = pressModel;
  private pressFollow = pressFollowModel;
  private authentication = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getPressListAll);
  }

  private getPressListAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token: any = req.headers.authorization;
      const userInfo = await this.authentication.getUserByToken(token);
      const pressListAll = await this.press.find({}).sort({ pressName: 1 });
      if (userInfo) {
        const pressIdList: any = [];
        const pressFollowList = await this.pressFollow.find({
          userId: userInfo.userId,
        });
        pressFollowList.forEach((element) => {
          pressIdList.push(element.pressId);
        });
        res
          .json({
            pressList: pressListAll,
            pressFollowList: pressIdList,
          })
          .end();
      }
      next(userInfo);
    } catch (e) {
      next(e);
    }
  };
}

export default PressController;
