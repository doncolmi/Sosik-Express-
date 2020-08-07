import "dotenv/config";
import validateEnv from "./utils/validateEnv";

import App from "./App";

import AuthController from "./controllers/authentication/authentication.controller";

validateEnv();

const app = new App([new AuthController()]);

app.listen();
