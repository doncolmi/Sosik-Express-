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
    const tokenHeader = { Authorization: token };
    const kakaoUrl = `https://kapi.kakao.com/v1/user/access_token_info`;

    const { data } = await axios.get(kakaoUrl, { headers: tokenHeader });
    const userInfo = await this.user.findOne({ userId: data.id });

    return userInfo!;
  };

  public updateProfileImg = async (
    userId: number,
    newProfileImg: string,
    newThumbnailImage: string
  ): Promise<boolean> => {
    const userInfo = await this.user.findOne({ userId: userId });
    if (userInfo!.profileImage === newProfileImg) {
      this.user.updateOne(
        { userId: userId },
        {
          $set: {
            profileImage: newProfileImg,
            thumbnailImage: newThumbnailImage,
          },
        }
      );
      return true;
    } else return false;
  };
}

export default AuthenticationService;
