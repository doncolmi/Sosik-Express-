import "dotenv/config";
import validateEnv from "./utils/validateEnv";

import App from "./App";

import AuthController from "./controllers/authentication/authentication.controller";
import NewsController from "./controllers/news/news.controller";

validateEnv();

const app = new App([new AuthController(), new NewsController()]);

app.listen();
