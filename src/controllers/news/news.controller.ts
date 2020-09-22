import {
  Request as Req,
  Response as Res,
  NextFunction as Next,
  Router,
} from "express";
import Controller from "../../interfaces/controller.interface";

import NewsService from "./news.service";
import AuthenticationService from "../authentication/authentication.service";

import NewsModel from "./news.model";

import error from "../../middleware/error.middleware";

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
      this.getAllNewsListFirst,
      this.getAllNewsList
    );
    this.router.get(
      `${this.path}/press`,
      this.auth.hasAuth,
      this.getPressNewsListFirst,
      this.getPressNewsList
    );
    this.router.get(
      `${this.path}/press/name`,
      this.auth.hasAuth,
      this.getPressNameList
    );
    this.router.get(
      `${this.path}/topic`,
      this.auth.hasAuth,
      this.getTopicNewsListFirst,
      this.getTopicNewsList
    );
    this.router.get(
      `${this.path}/topic/name`,
      this.auth.hasAuth,
      this.getTopicNameList
    );
    this.router.get(
      `${this.path}/press/:name`,
      this.auth.hasAuth,
      this.getPressNewsFirst,
      this.getPressNews
    );
    this.router.get(
      `${this.path}/topic/:name`,
      this.auth.hasAuth,
      this.getTopicNewsFirst,
      this.getTopicNews
    );
    this.router.get(
      `${this.path}/fake/:newsId`,
      this.auth.hasAuth,
      this.getIsFakeNewsLog
    );
    this.router.post(`${this.path}/fake`, this.auth.hasAuth, this.saveFakeNews);
    this.router.delete(
      `${this.path}/fake`,
      this.auth.hasAuth,
      this.deleteFakeNews
    );
  }

  private getAllNewsListFirst = async (req: Req, res: Res, next: Next) => {
    if (req.query.date) next();
    else {
      try {
        const newsList = await this.news
          .find({})
          .sort({ createdDate: -1 })
          .limit(10);
        res.json(newsList).end();
      } catch (e) {
        error(e, req, res, next);
      }
    }
  };

  private getAllNewsList = async (req: Req, res: Res, next: Next) => {
    try {
      const date: string = req.query.date as string;
      const newsList = await this.news
        .find({ createdDate: { $lt: new Date(date) } })
        .sort({ createdDate: -1 })
        .limit(10);
      res.json(newsList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getPressNewsListFirst = async (req: Req, res: Res, next: Next) => {
    if (req.query.date) next();
    else {
      try {
        const { userId } = await this.auth.getUserByToken(
          req.headers.authorization!
        );
        const pressfollowList = await this.newsService.getPressFollowList(
          userId
        );
        if (pressfollowList.length === 0)
          res.status(500).json({ err: "empty array" }).end();
        const newsList = await this.news
          .find()
          .or(pressfollowList)
          .sort({ createdDate: -1 })
          .limit(10);
        res.json(newsList).end();
      } catch (e) {
        error(e, req, res, next);
      }
    }
  };

  private getPressNewsList = async (req: Req, res: Res, next: Next) => {
    try {
      const date: string = req.query.date as string;
      const { userId } = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const pressfollowList = await this.newsService.getPressFollowList(userId);
      const newsList = await this.news
        .find({ createdDate: { $lt: new Date(date) } })
        .or(pressfollowList)
        .sort({ createdDate: -1 })
        .limit(10);
      res.json(newsList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getPressNameList = async (req: Req, res: Res, next: Next) => {
    try {
      const userInfo = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const pressfollowList = await this.newsService.getPressFollowNameList(
        userInfo!.userId
      );
      res.json(pressfollowList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getTopicNewsListFirst = async (req: Req, res: Res, next: Next) => {
    if (req.query.date) next();
    else {
      try {
        const { userId } = await this.auth.getUserByToken(
          req.headers.authorization!
        );
        const topicFollowList = await this.newsService.getTopicFollowList(
          userId
        );
        if (topicFollowList.length === 0)
          res.status(500).json({ err: "empty array" }).end();
        const newsList = await this.news
          .find()
          .or(topicFollowList)
          .sort({ createdDate: -1 })
          .limit(10);
        res.json(newsList).end();
      } catch (e) {
        error(e, req, res, next);
      }
    }
  };

  private getTopicNewsList = async (req: Req, res: Res, next: Next) => {
    try {
      const date: string = req.query.date as string;
      const { userId } = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const topicFollowList = await this.newsService.getTopicFollowList(userId);
      const newsList = await this.news
        .find({ createdDate: { $lt: new Date(date) } })
        .or(topicFollowList)
        .sort({ createdDate: -1 })
        .limit(10);
      res.json(newsList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getTopicNameList = async (req: Req, res: Res, next: Next) => {
    try {
      const userInfo = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const topicFollowList = await this.newsService.getTopicFollowNameList(
        userInfo!.userId
      );
      res.json(topicFollowList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getPressNewsFirst = async (req: Req, res: Res, next: Next) => {
    if (req.query.date) next();
    else {
      try {
        const newsList = await this.news
          .find({ pressName: req.params.name })
          .sort({ createdDate: -1 })
          .limit(10);
        res.json(newsList).end();
      } catch (e) {
        error(e, req, res, next);
      }
    }
  };

  private getPressNews = async (req: Req, res: Res, next: Next) => {
    try {
      const date: string = req.query.date as string;
      const newsList = await this.news
        .find()
        .and([
          { pressName: req.params.name },
          { createdDate: { $lt: new Date(date) } },
        ])
        .sort({ createdDate: -1 })
        .limit(10);
      res.json(newsList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getTopicNewsFirst = async (req: Req, res: Res, next: Next) => {
    if (req.query.date) next();
    else {
      try {
        const newsList = await this.news
          .find({ topicName: req.params.name })
          .sort({ createdDate: -1 })
          .limit(10);
        res.json(newsList).end();
      } catch (e) {
        error(e, req, res, next);
      }
    }
  };

  private getTopicNews = async (req: Req, res: Res, next: Next) => {
    try {
      const date: string = req.query.date as string;
      const newsList = await this.news
        .find()
        .and([
          { topicName: req.params.name },
          { createdDate: { $lt: new Date(date) } },
        ])
        .sort({ createdDate: -1 })
        .limit(10);
      res.json(newsList).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private getIsFakeNewsLog = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );

      const getFakeNewsLog = await this.newsService.getIsFakeNewsLog(
        userId,
        req.params.newsId
      );
      res.json(getFakeNewsLog).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private saveFakeNews = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );

      const saveFakeNews = await this.newsService.saveFakeNews(
        userId,
        req.body.newsId
      );
      res.json(saveFakeNews).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private deleteFakeNews = async (req: Req, res: Res, next: Next) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const deleteFakeNews = await this.newsService.deleteFakeNews(
        userId,
        req.body.newsId
      );
      res.json(deleteFakeNews).end();
    } catch (e) {
      error(e, req, res, next);
    }
  };
}

export default NewsController;
