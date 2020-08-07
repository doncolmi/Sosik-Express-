import {Request, Response, NextFunction, Router} from 'express';
import Controller from '../../interfaces/controller.interface';
import KakaoToken from '../../interfaces/kakaoToken.interface';
import CreateUserDto from '../user/user.dto';
import { User } from '../user/user.interface';
import UserModel from '../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDTO from './login.dto';
import userModel from '../user/user.model';

// todo: 완성해야합니다.

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = Router();
    public authenticationService = new AuthenticationService();
    private user = UserModel;

    constructor() {
        
    }

    private initalizeRoutes() {
        this.router.post(`${this.path}/login`, )
    }

}

export default AuthenticationController;