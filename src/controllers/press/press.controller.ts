import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "../user/user.model";
import pressModel from "./press.model";
import pressFollowModel from "./pressFollow.model";
import AuthenticationService from "../authentication/authentication.service";

class PressController implements Controller {
  public path = "/press";
  public router = Router();

  private user = userModel;
  private press = pressModel;
  private pressFollow = pressFollowModel;
  private auth = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getPressListAll);
    this.router.post(`${this.path}`, this.auth.hasAuth, this.doFollow);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.doUnFollow);
  }

  private getPressListAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token: any = req.headers.authorization;
      const userInfo = await this.auth.getUserByToken(token);
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

  private doFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token: string = req.headers.authorization!;
      const userInfo = await this.auth.getUserByToken(token);
      if (userInfo) {
        const save = await new this.pressFollow({
          pressId: req.body.pressId,
          userId: userInfo.userId,
        }).save();
        if (save.pressId === req.body.pressId) res.json(true).end();
        else res.json(false).end();
      }
    } catch (e) {
      next(e);
    }
  };

  private doUnFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token: string = req.headers.authorization!;
      const userInfo = await this.auth.getUserByToken(token);
      if (userInfo) {
        const save = await this.pressFollow.deleteMany({
          pressId: req.body.pressId,
          userId: userInfo.userId,
        });
        if (save.deletedCount! > 0) res.json(true).end();
        else res.json(false).end();
      }
    } catch (e) {
      next(e);
    }
  };
}

export default PressController;
