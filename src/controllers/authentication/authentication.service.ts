import CreateUserDto from "../user/user.dto";
import { User } from "../user/user.interface";
import UserModel from "../user/user.model";
import KakaoToken from "../../interfaces/kakaoToken.interface";
import userModel from "../user/user.model";
import UserDto from "../user/user.dto";

import axios from "axios";

class AuthenticationService {
  public user = userModel;

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
