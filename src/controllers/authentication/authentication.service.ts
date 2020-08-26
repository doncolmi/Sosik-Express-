import { Request, Response, NextFunction } from "express";
import userModel from "../user/user.model";

import axios from "axios";

class AuthenticationService {
  public user = userModel;

  public hasAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) next();
    else res.status(403).end();
  };

  public getUserByToken = async (token: string) => {
    const tokenHeader = {
      Authorization: token,
    };
    const { data } = await axios.get(
      `https://kapi.kakao.com/v1/user/access_token_info`,
      {
        headers: tokenHeader,
      }
    );
    const userInfo = this.user.findOne({ userId: data.id });
    return userInfo;
  };
}

export default AuthenticationService;
