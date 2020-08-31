import topicFollowModel from "./topicFollow.model";
import newsModel from "../news/news.model";

class Topic {
  private topicFollow = topicFollowModel;
  private news = newsModel;

  public getTopicFollow = async (userId: number) => {
    const topicFollowList = await this.topicFollow.find({
      userId: userId,
    });
    const topicNameList = topicFollowList.map((topic) => topic.topicName);
    return topicNameList;
  };

  public doFollow = async (userId: number, name: string) => {
    const save = await new this.topicFollow({
      topicName: name,
      userId: userId,
    }).save();
    return save.topicName === name;
  };

  public doUnFollow = async (userId: number, name: string) => {
    const del = await this.topicFollow.deleteMany({
      topicName: name,
      userId: userId,
    });
    return del.deletedCount! > 0;
  };

  public getTopic = async (name: string) => {
    const topicFollowCnt: number = await this.topicFollow.countDocuments({
      topicName: name,
    });
    const topicNewsCnt: number = await this.news.countDocuments({
      topicName: name,
    });
    const recentTopicNews: any = await this.news
      .find({ topicName: name })
      .sort({ createdDate: -1 })
      .limit(100);
    const recentPressCnt: number = this.getRecentPress(recentTopicNews);
    return {
      followCnt: topicFollowCnt,
      newsCnt: topicNewsCnt,
      recentPress: recentPressCnt,
    };
  };

  public getTopicFollowOne = async (userId: number, name: string) => {
    const isFollow = await this.topicFollow.countDocuments({
      userId: userId,
      topicName: name,
    });
    return isFollow > 0;
  };

  private getRecentPress = (newsData: any): number => {
    const PressNameList = newsData.map((news: any) => news.pressName);
    const PressNameSet = new Set(PressNameList);
    return PressNameSet.size;
  };

  private 100 = "정치";
  private 101 = "경제";
  private 102 = "사회";
  private 103 = "생활";
  private 105 = "IT";
  private 110 = "오피니언";

  public getTopicName = (topicId: string) => {
    if (topicId === "100") return this[100];
    if (topicId === "101") return this[101];
    if (topicId === "102") return this[102];
    if (topicId === "103") return this[103];
    if (topicId === "105") return this[105];
    return this[110];
  };

  public getTopicId = (): string[] => {
    return ["100", "101", "102", "103", "105", "100"];
  };
}

export default Topic;
