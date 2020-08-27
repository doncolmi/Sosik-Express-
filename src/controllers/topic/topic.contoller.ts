import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import userModel from "../user/user.model";
import topicFollowModel from "./topicFollow.model";
import AuthenticationService from "../authentication/authentication.service";
import TopicService from "./topic.service";

class TopicController implements Controller {
  public path = "/topic";
  public router = Router();

  private user = userModel;
  private topicFollow = topicFollowModel;
  private auth = new AuthenticationService();
  private topic = new TopicService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.hasAuth, this.getTopicFollow);
    this.router.post(`${this.path}`, this.auth.hasAuth, this.doFollow);
    this.router.delete(`${this.path}`, this.auth.hasAuth, this.doUnFollow);
  }

  private getTopicFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token: any = req.headers.authorization;
      const userInfo = await this.auth.getUserByToken(token);
      if (userInfo) {
        const topicNameList: any = [];
        const topicFollowList = await this.topicFollow.find({
          userId: userInfo.userId,
        });
        topicFollowList.forEach((element) => {
          topicNameList.push(element.topicName);
        });
        res.json(topicNameList).end();
      }
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
      const TopicName = this.topic.getTopicName(req.body.topicId);
      if (userInfo) {
        const save = await new this.topicFollow({
          topicName: TopicName,
          userId: userInfo.userId,
        }).save();
        if (save.topicName === TopicName) res.json(true).end();
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
      const TopicName = this.topic.getTopicName(req.body.topicId);

      if (userInfo) {
        const save = await this.topicFollow.deleteMany({
          topicName: TopicName,
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

export default TopicController;
