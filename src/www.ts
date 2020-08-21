import "dotenv/config";
import validateEnv from "./utils/validateEnv";

import App from "./App";

import AuthController from "./controllers/authentication/authentication.controller";
import NewsController from "./controllers/news/news.controller";
import PressController from "./controllers/press/press.controller";

validateEnv();

const app = new App([
  new AuthController(),
  new NewsController(),
  new PressController(),
]);

app.listen();
