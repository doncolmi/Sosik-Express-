import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";

import * as http from "http";

import { News, Press } from "./news.interface";
import newsModel from "./news.model";
import pressModel from "./press.model";
import { get } from "mongoose";

class newsService {
  public news = newsModel;
  public press = pressModel;

  public topic: Object = {
    "100": "정치",
    "101": "경제",
    "102": "사회",
    "103": "생활",
    "105": "IT",
    "110": "오피니언",
  };

  public getNewsTitleList = (topicId: string) => {
    const ListUrl = `https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=${topicId}&listType=title`;

    axios
      .get(ListUrl, {
        responseEncoding: "binary",
        responseType: "arraybuffer",
      })
      .then(({ data }: AxiosResponse) => {
        const icon = iconv.decode(data, "UTF-8").toString();
        console.log(iso88592.decode(response.data.toString("binary")));

        // const $: CheerioStatic = cheerio.load(
        //   iconv.decode(data, "EUC-KR").toString()
        // );
        // const attrList = $("ul.type02 > li > a").toArray();
        // const test = attrList.forEach((element) => {
        //   console.log(element);
        // });
        // const list: Cheerio = $("ul.type02").children("li");
      });
  };
}

export default newsService;
