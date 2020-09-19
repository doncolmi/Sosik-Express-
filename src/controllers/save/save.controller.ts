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
  }

  private getFirstSaveNewsList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.date) next();
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res.json(await this.saveService.getFirstSaveNews(userId)).end();
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
      const date: string = req.query.date as string;
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res.json(await this.saveService.getSaveNews(userId, date)).end();
    } catch (e) {
      next(e);
    }
  };
}

export default SaveController;
