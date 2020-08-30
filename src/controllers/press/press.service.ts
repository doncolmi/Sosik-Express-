import axios, { AxiosResponse } from "axios";

import { logger } from "../../middleware/winston.middleware";

import * as Ipress from "./press.interface";
import pressModel from "./press.model";
import pressFollowModel from "./pressFollow.model";
import newsModel from "../news/news.model";
import { get } from "mongoose";

class PressService {
  private press = pressModel;
  private pressFollow = pressFollowModel;
  private news = newsModel;

  public getPressListAll = async (userId: number) => {
    const pressListAll = await this.press.find({}).sort({ pressName: 1 });
    const pressFollowList = await this.pressFollow.find({ userId: userId });
    const pressIdList = pressFollowList.map((press) => press.pressId);
    return {
      pressList: pressListAll,
      pressFollowList: pressIdList,
    };
  };

  public doFollow = async (pressId: string, userId: number) => {
    const save = await new this.pressFollow({
      pressId: pressId,
      userId: userId,
    }).save();
    return save.pressId === pressId;
  };

  public doUnFollow = async (pressId: string, userId: number) => {
    const save = await this.pressFollow.deleteMany({
      pressId: pressId,
      userId: userId,
    });
    return save.deletedCount! > 0;
  };

  public getPress = async (name: string) => {
    const pressInfo: any = await this.press.findOne({ pressName: name });
    const pressFollowCnt = await this.pressFollow.countDocuments({
      pressId: pressInfo.pressId,
    });
    const pressNewsCnt = await this.news.countDocuments({
      pressId: pressInfo.pressId,
    });

    const recentPressNews: any = await this.news
      .find({ pressId: pressInfo.pressId })
      .sort({ createdDate: -1 })
      .limit(100);
    const recentTopic = this.getRecentTopic(recentPressNews);
    return {
      pressId: pressInfo.pressId,
      followCnt: pressFollowCnt,
      newsCnt: pressNewsCnt,
      recentTopic: recentTopic,
    };
  };

  public getPressFollow = async (name: string, userId: number) => {
    const pressInfo: any = await this.press.findOne({ pressName: name });
    const isFollow = await this.pressFollow.countDocuments({
      pressId: pressInfo.pressId,
      userId: userId,
    });
    return isFollow > 0;
  };

  private getRecentTopic = (newsData: any): string => {
    const topicCheck = [0, 0, 0, 0, 0, 0];
    newsData.forEach((element: any) => {
      if (element.topicName === "정치") topicCheck[0]++;
      else if (element.topicName === "경제") topicCheck[1]++;
      else if (element.topicName === "사회") topicCheck[2]++;
      else if (element.topicName === "생활") topicCheck[3]++;
      else if (element.topicName === "IT") topicCheck[4]++;
      else if (element.topicName === "오피니언") topicCheck[5]++;
    });
    return this.getTopicNameInTopicName(topicCheck);
  };

  private getTopicNameInTopicName = (numArr: number[]): string => {
    if (numArr.length !== 6) return "없음";
    const returnName = ["정치", "경제", "사회", "생활", "IT", "오피니언"];
    let max = 0;
    let idx = 0;
    let now = 0;
    numArr.forEach((element: number) => {
      if (element > max) {
        max = element;
        idx = now;
      }
      now++;
    });
    return returnName[idx];
  };
}

export default PressService;
