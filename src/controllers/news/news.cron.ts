import { schedule } from "node-cron";

import newsService from "./news.service";

export const test = schedule("30 */3 * * * *", async () => {
  console.log("실행");
  new newsService().doCrawling();
});
