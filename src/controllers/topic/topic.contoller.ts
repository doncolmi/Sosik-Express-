import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../authentication/authentication.service";
import TopicService from "./topic.service";

class TopicController implements Controller {
  public path = "/topic";
  public router = Router();

  private auth = new AuthenticationService();
  private topic = new TopicService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getTopicFollow);
    this.router.post(`${this.path}`, this.auth.hasAuth, this.doFollow);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.doUnFollow);
    this.router.get(`${this.path}/:name`, this.getTopic);
    this.router.get(
      `${this.path}/:name/follow`,
      this.auth.hasAuth,
      this.getTopicFollowOne
    );
  }

  private getTopicFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const topicNameList = await this.topic.getTopicFollow(userId);
      res.json(topicNameList).end();
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
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const TopicName = this.topic.getTopicName(req.body.topicId);
      res.json(await this.topic.doFollow(userId, TopicName)).end();
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
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      const TopicName = this.topic.getTopicName(req.body.topicId);
      res.json(await this.topic.doUnFollow(userId, TopicName)).end();
    } catch (e) {
      next(e);
    }
  };

  private getTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.topic.getTopic(req.params.name)).end();
    } catch (e) {
      next(e);
    }
  };

  private getTopicFollowOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId }: any = await this.auth.getUserByToken(
        req.headers.authorization!
      );
      res
        .json(await this.topic.getTopicFollowOne(userId, req.params.name))
        .end();
    } catch (e) {
      next(e);
    }
  };
}

export default TopicController;
