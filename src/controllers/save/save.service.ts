import saveModel from "./save.model";
import newsModel from "../news/news.model";

import { SaveNews } from "./save.interface";

class PressService {
  private saveNews = saveModel;
  private news = newsModel;

  public getFirstSaveNews = async (userId: number) => {
    const saveNewsList = await this.getFirstSaveNewsList(userId);
    const getSaveNews = await this.news
      .find()
      .or(saveNewsList)
      .sort({ createdDate: -1 });
    return getSaveNews;
  };

  public getSaveNews = async (userId: number, date: string) => {
    const saveNewsList = await this.getSaveNewsList(userId, date);
    const getSaveNews = await this.news
      .find()
      .or(saveNewsList)
      .sort({ createdDate: -1 });
    return getSaveNews;
  };

  private getFirstSaveNewsList = async (userId: number) => {
    try {
      const saveNewsList = await this.saveNews
        .find({ userId: userId })
        .sort({ createdDate: -1 })
        .limit(10);
      return saveNewsList.map((element: any) => ({ newsId: element.newsId }));
    } catch (e) {
      throw new Error(e);
    }
  };

  private getSaveNewsList = async (userId: number, date: string) => {
    try {
      // 하 이거 어떠케 하지?
      // 일단 진짜 news의 Date를 사용할지
      // 아니면 해당 news의 id값으로 조회할지 엄청난 고민을 해야할 거 같습니다...
      // 구조 다시자십시오...
      const saveNewsList = await this.saveNews
        .find({ userId: userId, createdDate: { $lt: new Date(date) } })
        .sort({ createdDate: -1 })
        .limit(10);
      return saveNewsList.map((element: any) => ({ newsId: element.newsId }));
    } catch (e) {
      throw new Error(e);
    }
  };
}

export default PressService;
