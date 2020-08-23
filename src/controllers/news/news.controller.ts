import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import NewsModel from "./news.model";
import { getNewsListParam } from "./news.interface";

class NewsController implements Controller {
  public path = "/news";
  public router = Router();
  private news = NewsModel;

  constructor() {
    this.initializeRoutes();
  }

<<<<<<< HEAD
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getNewsListAll);
  }

  private getNewsListAll = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const page: number = +req.query.page!;
    console.log(page, " 입니다.");
    this.news
      .find({})
      .sort({ createdDate: -1 })
      .skip(page * 10)
      .limit(10)
      .then((result: any) => res.json(result))
      .catch((err: Error) => next(err));
  };
=======
    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getFirstNewsListAll, this.getNewsListAll);
    }

    private getFirstNewsListAll = (req: Request, res: Response, next: NextFunction) => {
        if(req.query.date) {
            next();
            return;
        }
        this.news
        .find({})
        .sort({ createdDate: -1})
        .limit(10)
        .then(((result: any) => res.json(result)))
        .catch((err: Error) => next(err));
    }

    private getNewsListAll = (req: Request, res: Response, next: NextFunction) => {
        const date: string = req.query.date as string;
        this.news
        .find({ "createdDate": { "$lt" : new Date(date) } })
        .sort({ createdDate: -1})
        .limit(10)
        .then(((result: any) => res.json(result)))
        .catch((err: Error) => next(err));
    }
>>>>>>> a52f3fdb0c79c6822892dbd6bfbe16b92a2f3db7
}

export default NewsController;
