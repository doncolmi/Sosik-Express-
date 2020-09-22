import {
  Request as Req,
  Response as Res,
  NextFunction as Next,
  Router,
} from "express";
import Controller from "../../interfaces/controller.interface";

import AuthenticationService from "../authentication/authentication.service";
import SaveService from "./save.service";

import error from "../../middleware/error.middleware";

class SaveController implements Controller {
  public path = "/save";
  public router = Router();

  private auth = new AuthenticationService();
  private saveService = new SaveService();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getSaveNewsList);
    this.router.get(
      `${this.path}/all`,
      this.auth.hasAuth,
      this.getSaveNewsList
    );
    this.router.get(`${this.path}/:newsId`, this.auth.hasAuth, this.getIsSaved);
    this.router.post(`${this.path}`, this.auth.hasAuth, this.saveNews);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.deleteSaveNews);
  }

  private getIsSaved = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.saveService.getIsSaved(userId, req.params.newsId))
        .end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getSaveNewsList = async (req: Req, res: Res, next: Next) => {
    try {
      const page: number = +req.query.page!;
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res.json(await this.saveService.getSaveNews(userId, page)).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private saveNews = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.saveService.postSaveNews(userId, req.body.newsId))
        .end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private deleteSaveNews = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.saveService.deleteSaveNews(userId, req.body.newsId))
        .end();
    } catch (e) {
      error(e, req, res, next);
    }
  };
}

export default SaveController;
