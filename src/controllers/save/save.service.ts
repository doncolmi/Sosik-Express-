import saveModel from "./save.model";
import newsModel from "../news/news.model";

import { SaveNews } from "./save.interface";

class SaveService {
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

  public getSaveNews = async (userId: number, page: number) => {
    const saveNewsList = await this.getSaveNewsList(userId, page);
    const getSaveNews = await this.news
      .find()
      .or(saveNewsList)
      .sort({ createdDate: -1 });
    return getSaveNews;
  };

  public getIsSaved = async (
    userId: number,
    newsId: string
  ): Promise<boolean> => {
    const cntData: SaveNews = {
      newsId: newsId,
      userId: userId,
    };
    const cntSaved: number = await this.saveNews.countDocuments(cntData);
    return cntSaved > 0;
  };

  public postSaveNews = async (userId: number, newsId: string) => {
    const saveData: SaveNews = {
      newsId: newsId,
      userId: userId,
    };
    const postSaveNews = await new this.saveNews(saveData).save();
    return postSaveNews.userId == userId;
  };

  public deleteSaveNews = async (userId: number, newsId: string) => {
    const deleteData: SaveNews = {
      newsId: newsId,
      userId: userId,
    };
    const deleteSaveNews = await this.saveNews.deleteMany(deleteData);
    return deleteSaveNews.deletedCount! > 0;
  };

  private getFirstSaveNewsList = async (userId: number) => {
    const saveNewsList = await this.saveNews
      .find({ userId: userId })
      .sort({ createdDate: -1 })
      .limit(10);
    return saveNewsList.map((element: any) => ({ newsId: element.newsId }));
  };

  private getSaveNewsList = async (userId: number, page: number) => {
    const saveNewsList = await this.saveNews
      .find({ userId: userId })
      .sort({ createdDate: -1 })
      .skip(page * 10)
      .limit(10);
    return saveNewsList.map((element: any) => ({ newsId: element.newsId }));
  };
}

export default SaveService;
