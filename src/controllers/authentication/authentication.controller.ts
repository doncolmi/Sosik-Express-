import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import UserModel from "../user/user.model";
import AuthenticationService from "./authentication.service";
import UserDTO from "../user/user.dto";
import validate from "../../middleware/validation.middleware";
import userModel from "../user/user.model";

// todo: 완성해야합니다.

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = Router();
  public authenticationService = new AuthenticationService();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getCookies);
    this.router.post(
      `${this.path}/login`,
      validate(UserDTO),
      this.login,
      this.save
    );
  }

  private getCookies = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    res.json(req.cookies);
  };

  private login = (req: Request, res: Response, next: NextFunction) => {
    const { userId, refreshToken, tokenExp }: UserDTO = req.body;
    this.user
      .findOne({ userId: userId })
      .then((user) => {
        if (user) {
          res.cookie("refreshToken", refreshToken, {
            maxAge: tokenExp,
            httpOnly: true,
          });
          res.json(true);
          return;
        }
        next();
      })
      .catch((err: Error) => next(err));
  };

  private save = (req: Request, res: Response, next: NextFunction) => {
    const saveUserData: UserDTO = req.body;
    const userSchema = new userModel(saveUserData);
    userSchema
      .save()
      .then((result: any) => {
        console.log("궁금해하던거", result);
        res.cookie("refreshToken", saveUserData.refreshToken, {
          maxAge: saveUserData.tokenExp,
          httpOnly: true,
        });
        res.json(false);
      })
      .catch((err: Error) => next(err));
  };
}

export default AuthenticationController;
