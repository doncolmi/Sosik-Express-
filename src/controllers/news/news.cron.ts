import { schedule } from "node-cron";

import newsService from "./news.service";

export const test = schedule("*/10 * * * * *", async () => {
  new newsService().test();
});
