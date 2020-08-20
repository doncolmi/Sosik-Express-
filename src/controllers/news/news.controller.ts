import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import NewsModel from "./news.model";
import { getNewsListParam } from "./news.interface";
import { json } from "envalid";

class NewsController implements Controller {
    public path = "/news";
    public router = Router();
    private news = NewsModel;

    constructor() {
        this.initializeRoutes();
    }

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
}

export default NewsController;