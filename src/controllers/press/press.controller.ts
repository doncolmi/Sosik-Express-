import {
  Request as Req,
  Response as Res,
  NextFunction as Next,
  Router,
} from "express";
import Controller from "../../interfaces/controller.interface";

import AuthenticationService from "../authentication/authentication.service";
import PressService from "./press.service";

import error from "../../middleware/error.middleware";

class PressController implements Controller {
  public path = "/press";
  public router = Router();

  private auth = new AuthenticationService();
  private pressService = new PressService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getPressListAll);
    this.router.post(`${this.path}`, this.auth.hasAuth, this.doFollow);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.doUnFollow);
    this.router.get(`${this.path}/:name`, this.getPress);
    this.router.get(
      `${this.path}/:name/follow`,
      this.auth.hasAuth,
      this.getPressFollow
    );
  }

  private getPressListAll = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const PressList = await this.pressService.getPressListAll(userId);
      res.json(PressList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private doFollow = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const isSave = await this.pressService.doFollow(req.body.pressId, userId);
      res.json(isSave).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private doUnFollow = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const isDelete = await this.pressService.doUnFollow(
        req.body.pressId,
        userId
      );
      res.json(isDelete).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getPress = async (req: Req, res: Res, next: Next) => {
    try {
      res.json(await this.pressService.getPress(req.params.name)).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getPressFollow = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.pressService.getPressFollow(req.params.name, userId))
        .end();
    } catch (e) {
      error(e, req, res, next);
    }
  };
}

export default PressController;
