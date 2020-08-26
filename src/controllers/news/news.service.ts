import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";

import { logger } from "../../middleware/winston.middleware";

import Topic from "../topic/topic.service";
import { replaceContent } from "../../utils/newsReplace";
import * as Inews from "./news.interface";
import * as Ipress from "../press/press.interface";
import newsModel from "./news.model";
import pressModel from "../press/press.model";
import pressFollowModel from "../press/pressFollow.model";
import topicFollowModel from "../topic/topicFollow.model";
import { get } from "mongoose";

class newsService {
  private news = newsModel;
  private press = pressModel;
  private pressFollow = pressFollowModel;
  private topicFollow = topicFollowModel;
  private topic = new Topic();

  public doCrawling = async () => {
    const Topics = this.topic.getTopicId();
    Topics.forEach(async (Topic) => {
      const NewsHrefList = await this.getNewsHrefList(Topic);
      const NewsList = await this.checkDuplicate(NewsHrefList);
      const PressSetList = await this.getPressSetList(NewsList);
      await this.savePress(PressSetList);
      NewsList.forEach(async (News) => {
        this.getContents(News.href!)
          .then((res) => {
            this.saveNews(News, res);
          })
          .catch((err) => logger.error(err));
      });
    });
  };

  private crawling = (url: string): Promise<any> => {
    return new Promise((resolve, reject): any => {
      axios
        .get(url, { responseType: "arraybuffer" })
        .then(({ data }: AxiosResponse) => resolve(data))
        .catch((err) => reject(err));
    });
  };

  private getPressId = (href: any): string => {
    const codeArray = href.split("&");
    return codeArray[3].replace("oid=", "");
  };

  private getNewsId = (href: any): string => {
    const codeArray = href.split("&");
    return codeArray[4].replace("aid=", "");
  };

  private getNewsHrefList = (topicId: string): Promise<Inews.newsList[]> => {
    const ListUrl = `https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=${topicId}&listType=title`;
    return new Promise((resolve, reject) => {
      this.crawling(ListUrl)
        .then((crwalingData: Buffer) => {
          const $: CheerioStatic = cheerio.load(
            iconv.decode(crwalingData, "EUC-KR").toString()
          );
          const list: Cheerio = $("ul.type02").children("li");
          const NewsHrefList: Inews.newsList[] = [];
          list.toArray().forEach((element) => {
            const href: string = $(element).find("a").attr("href")!;
            NewsHrefList.push({
              newsId: this.getNewsId(href),
              href: href,
              title: $(element).find("a").text().trim(),
              topicName: this.topic.getTopicName(topicId),
              press: {
                pressId: this.getPressId(href),
                pressName: $(element).find("span.writing").text().trim(),
              },
            });
          });
          resolve(NewsHrefList);
        })
        .catch((err) => reject(new Error(err)));
    });
  };

  private getContents = (href: string): Promise<Inews.newsContent> => {
    return new Promise((resolve, reject) => {
      this.crawling(href).then((crwalingData: Buffer) => {
        const $: CheerioStatic = cheerio.load(
          iconv.decode(crwalingData, "EUC-KR").toString()
        );
        const contentWrapper = $("div#main_content");
        let content = $(contentWrapper).find("div#articleBodyContents").html();

        if (!content)
          content = $(contentWrapper).find("div#newsEndContents").html();

        let date = $(contentWrapper)
          .find("div.sponsor span.t11:nth-child(1)")
          .text()
          .trim();

        if (!date)
          date = $(contentWrapper).find("div.sponsor span.t11").text().trim();

        if (!content) reject(new Error("no Contents"));
        if (!date) reject(new Error("no Dates"));

        resolve({
          content: replaceContent(content),
          date: date,
        });
      });
    });
  };

  private savePress = (pressSetList: Set<string>): Promise<Boolean> => {
    return new Promise((resolve, reject) => {
      pressSetList.forEach((pressToString) => {
        const pressInfo: string[] = pressToString.split(",");
        const pressDto: Ipress.Press = {
          pressId: pressInfo[0],
          pressName: pressInfo[1],
        };
        new this.press(pressDto)
          .save()
          .then((res) => {
            logger.info("saveInfo - Press : ", pressDto.pressName, "!save! ");
            resolve(true);
          })
          .catch((err) => {
            logger.error(new Error(err));
            resolve(false);
          });
      });
    });
  };

  private getPressSetList = (NewsList: Inews.newsList[]): Set<string> => {
    const pressSetList: Set<string> = new Set();
    NewsList.forEach(({ press }: Inews.newsList) => {
      pressSetList.add(`${press.pressId},${press.pressName}`);
    });
    return pressSetList;
  };

  private checkDuplicate = async (
    NewsList: Inews.newsList[]
  ): Promise<Inews.newsList[]> => {
    const resultList: Inews.newsList[] = [];
    for (const elem of NewsList) {
      const check = await this.news.countDocuments({ newsId: elem.newsId });
      if (check > 0) {
        break;
      } else resultList.push(elem);
    }
    return resultList;
  };

  private saveNews = (
    NewsList: Inews.newsList,
    NewsContent: Inews.newsContent
  ) => {
    new this.news({
      newsId: NewsList.newsId,
      title: NewsList.title,
      contents: NewsContent.content,
      newsDate: NewsContent.date,
      href: NewsList.href,
      pressId: NewsList.press.pressId,
      pressName: NewsList.press.pressName,
      topicName: NewsList.topicName,
    })
      .save()
      .then((saveInfo) => {
        logger.info(
          "title : ",
          saveInfo.title,
          ",topic : ",
          saveInfo.topicName,
          "save!!!"
        );
      })
      .catch((err) => {
        logger.error(new Error(err));
      });
  };

  public getPressFollowList = async (userId: number) => {
    const PressFollow = await this.pressFollow.find({ userId: userId });
    const PressFollowList: any = [];
    PressFollow.map((element) => {
      PressFollowList.push({ pressId: element.pressId });
    });
    return PressFollowList;
  };

  public getTopicFollowList = async (userId: number) => {
    const topicFollow = await this.topicFollow.find({ userId: userId });
    const topicFollowList: any = [];
    topicFollow.map((element) => {
      topicFollowList.push({ topicName: element.topicName });
    });
    return topicFollowList;
  };
}

export default newsService;
