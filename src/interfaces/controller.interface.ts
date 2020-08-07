import { Router } from 'express';

interface Controller {
    path: string;
    router: Router;

    initializeRoutes(): Function;
}

export default Controller;