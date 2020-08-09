import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";

import Topic from "./topic";
import { News, Press, newsList } from "./news.interface";
import newsModel from "./news.model";
import pressModel from "./press.model";
import { get } from "mongoose";

class newsService {
  public news = newsModel;
  public press = pressModel;
  public topic = new Topic();

  public crawling = (url: string): Promise<any> => {
    return new Promise((resolve, reject): any => {
      axios
        .get(url, { responseType: "arraybuffer" })
        .then(({ data }: AxiosResponse) => resolve(data))
        .catch((err) => reject(err));
    });
  };

  public getNewsId = (href: any): string => {
    const codeArray = href.split("&");
    return codeArray[3].replace("oid=", "");
  };

  public getPressId = (href: any): string => {
    const codeArray = href.split("&");
    return codeArray[4].replace("aid=", "");
  };

  public getNewsHrefList = (topicId: string) => {
    const ListUrl = `https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=${topicId}&listType=title`;
    return new Promise((resolve, reject) => {
      this.crawling(ListUrl)
        .then((crwalingData: Buffer) => {
          const $: CheerioStatic = cheerio.load(
            iconv.decode(crwalingData, "EUC-KR").toString()
          );
          const list: Cheerio = $("ul.type02").children("li");
          const NewsHrefList: newsList[] = [];
          list.toArray().forEach((element) => {
            const href: string = $(element).find("a").attr("href");
            NewsHrefList.push({
              newsId: this.getNewsId(href),
              href: href,
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

  public getContents = (href: string) => {
    return new Promise((resolve, reject) => {});
  };
}

export default newsService;
