import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import NewsModel from "./news.model";
import { getNewsListParam } from "./news.interface";
import AuthenticationService from "../authentication/authentication.service";
import NewsService from "./news.service";

class NewsController implements Controller {
  public path = "/news";
  public router = Router();
  private news = NewsModel;
  private auth = new AuthenticationService();
  private newsService = new NewsService();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.getFirstNewsListAll,
      this.getNewsListAll
    );
    this.router.get(
      `${this.path}/press`,
      this.auth.hasAuth,
      this.getFirstNewsListByPress,
      this.getNewsListByPress
    );
    this.router.get(
      `${this.path}/topic`,
      this.auth.hasAuth,
      this.getFirstNewsListByTopic,
      this.getNewsListByTopic
    );
    this.router.get(
      `${this.path}/press/:name`,
      this.auth.hasAuth,
      this.getFirstNewsByOnlyPress,
      this.getNewsByOnlyPress
    );
    this.router.get(
      `${this.path}/topic/:name`,
      this.auth.hasAuth,
      this.getFirstNewsByOnlyTopic,
      this.getNewsByOnlyTopic
    );
  }

  private getFirstNewsListAll = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.date) {
      next();
      return;
    }
    this.news
      .find({})
      .sort({ createdDate: -1 })
      .limit(10)
      .then((result: any) => res.json(result))
      .catch((err: Error) => next(err));
  };

  private getNewsListAll = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const date: string = req.query.date as string;
    this.news
      .find({ createdDate: { $lt: new Date(date) } })
      .sort({ createdDate: -1 })
      .limit(10)
      .then((result: any) => res.json(result))
      .catch((err: Error) => next(err));
  };

  private getFirstNewsListByPress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.date) {
      next();
      return;
    }
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      const pressfollowList = await this.newsService.getPressFollowList(
        userInfo.userId
      );
      this.news
        .find()
        .or(pressfollowList)
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getNewsListByPress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const date: string = req.query.date as string;
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      const pressfollowList = await this.newsService.getPressFollowList(
        userInfo.userId
      );
      this.news
        .find({ createdDate: { $lt: new Date(date) } })
        .or(pressfollowList)
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getFirstNewsListByTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.date) {
      next();
      return;
    }
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      const pressFollowList = await this.newsService.getTopicFollowList(
        userInfo.userId
      );
      this.news
        .find()
        .or(pressFollowList)
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getNewsListByTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const date: string = req.query.date as string;
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      const topicFollowList = await this.newsService.getTopicFollowList(
        userInfo.userId
      );
      this.news
        .find({ createdDate: { $lt: new Date(date) } })
        .or(topicFollowList)
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getFirstNewsByOnlyPress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.date) {
      next();
      return;
    }
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      this.news
        .find({ pressName: req.params.name })
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getNewsByOnlyPress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const date: string = req.query.date as string;
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      this.news
        .find()
        .and([
          { pressName: req.params.name },
          { createdDate: { $lt: new Date(date) } },
        ])
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getFirstNewsByOnlyTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.query.date) {
      next();
      return;
    }
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      this.news
        .find({ topicName: req.params.name })
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };

  private getNewsByOnlyTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const date: string = req.query.date as string;
    const userInfo = await this.auth.getUserByToken(req.headers.authorization!);
    if (userInfo) {
      this.news
        .find()
        .and([
          { topicName: req.params.name },
          { createdDate: { $lt: new Date(date) } },
        ])
        .sort({ createdDate: -1 })
        .limit(10)
        .then((result: any) => res.json(result))
        .catch((err: Error) => next(err));
    }
  };
}

export default NewsController;
