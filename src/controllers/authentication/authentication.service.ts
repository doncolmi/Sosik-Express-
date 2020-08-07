import CreateUserDto from "../user/user.dto";
import { User } from "../user/user.interface";
import UserModel from "../user/user.model";
import KakaoToken from "../../interfaces/kakaoToken.interface";
import userModel from "../user/user.model";

class AuthenticationService {
  public user = userModel;
}

export default AuthenticationService;
