import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../authentication/authentication.service";
import SaveService from "./save.service";

class SaveController implements Controller {
  public path = "/save";
  public router = Router();

  private auth = new AuthenticationService();
  private saveService = new SaveService();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.auth.hasAuth,
      this.getFirstSaveNewsList,
      this.getSaveNewsList
    );
    this.router.get(
      `${this.path}/all`,
      this.auth.hasAuth,
      this.getFirstSaveNewsList,
      this.getSaveNewsList
    );
    this.router.get(`${this.path}/:newsId`, this.auth.hasAuth, this.getIsSaved);
    this.router.post(`${this.path}`, this.auth.hasAuth, this.saveNews);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.deleteSaveNews);
  }

  private getFirstSaveNewsList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.page) next();
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res.json(await this.saveService.getFirstSaveNews(userId)).end();
    } catch (e) {
      next(e);
    }
  };

  private getIsSaved = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.saveService.getIsSaved(userId, req.params.newsId))
        .end();
    } catch (e) {
      next(e);
    }
  };

  private getSaveNewsList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page: number = +req.query.page!;
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res.json(await this.saveService.getSaveNews(userId, page)).end();
    } catch (e) {
      next(e);
    }
  };

  private saveNews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.saveService.postSaveNews(userId, req.body.newsId))
        .end();
    } catch (e) {
      next(e);
    }
  };

  private deleteSaveNews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.saveService.deleteSaveNews(userId, req.body.newsId))
        .end();
    } catch (e) {
      next(e);
    }
  };
}

export default SaveController;
