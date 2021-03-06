import "dotenv/config";
import validateEnv from "./utils/validateEnv";

import App from "./App";

import AuthController from "./controllers/authentication/authentication.controller";
import NewsController from "./controllers/news/news.controller";
import PressController from "./controllers/press/press.controller";
import TopicController from "./controllers/topic/topic.contoller";
import SaveController from "./controllers/save/save.controller";
import UserController from "./controllers/user/user.controller";

validateEnv();

const app = new App([
  new AuthController(),
  new NewsController(),
  new PressController(),
  new TopicController(),
  new SaveController(),
  new UserController()
]);

app.listen();
