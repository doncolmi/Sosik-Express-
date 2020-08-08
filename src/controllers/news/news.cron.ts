import { schedule } from "node-cron";

import newsService from "./news.service";

export const test = schedule("*/10 * * * * *", async () => {
  console.log("하이");
  new newsService().getNewsTitleList("100");
});
