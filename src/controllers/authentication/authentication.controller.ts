import {
  Request as Req,
  Response as Res,
  NextFunction as Next,
  Router,
} from "express";
import Controller from "../../interfaces/controller.interface";

import AuthenticationService from "./authentication.service";

import UserModel from "../user/user.model";
import UserDTO from "../user/user.dto";

import validate from "../../middleware/validation.middleware";
import error from "../../middleware/error.middleware";
import axios from "axios";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = Router();

  private auth = new AuthenticationService();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.getCookies);
    this.router.post(
      `${this.path}/login`,
      validate(UserDTO),
      this.login,
      this.save
    );
    this.router.get(`${this.path}/logout`, this.auth.hasAuth, this.logout);
  }

  private getCookies = async (req: Req, res: Res) => {
    if (req.headers.cookie) {
      try {
        const refreshToken = req.headers.cookie.replace("refreshToken=", "");
        const kakaoUrl: string = `https://kauth.kakao.com/oauth/token?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&refresh_token=${refreshToken}&client_secret=${process.env.CLIENT_SECRET}`;
        const { data } = await axios.post(kakaoUrl);
        res.json({ status: true, token: data.access_token }).end();
      } catch (e) {
        res.json({ status: false }).end();
      }
    }
  };

  private login = async (req: Req, res: Res, next: Next) => {
    try {
      const {
        userId,
        refreshToken,
        tokenExp,
        profileImage,
        thumbnailImage,
      }: UserDTO = req.body;
      const updated = await this.auth.updateProfileImg(
        userId,
        profileImage,
        thumbnailImage
      );
      if (updated) {
        res
          .cookie("refreshToken", refreshToken, {
            maxAge: tokenExp,
            path: "/",
            httpOnly: true,
            sameSite: "none",
          })
          .json(true)
          .end();
      } else {
        next();
      }
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private save = async (req: Req, res: Res, next: Next) => {
    try {
      const saveUserData: UserDTO = req.body;
      await new this.user(saveUserData).save();
      res
        .cookie("refreshToken", saveUserData.refreshToken, {
          maxAge: saveUserData.tokenExp,
          path: "/",
          httpOnly: true,
          sameSite: "none",
        })
        .json(false)
        .end();
    } catch (e) {
      error(e, req, res, next);
    }
  };

  private logout = async (req: Req, res: Res, next: Next) => {
    res.clearCookie("refreshToken", { path: "/" }).json(true);
  };
}

export default AuthenticationController;
