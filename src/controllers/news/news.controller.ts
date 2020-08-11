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

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getCookies);
    }

    private getNewsList = (({page}: getNewsListParam) => {
        // todo: 해당 구조부터 한번 짜보자
    })
}

export default NewsController;