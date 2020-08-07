import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_DB: str(),
        MONGO_PORT: str() ,
        MONGO_DBNAME: str(),
        PORT: port()
    })
}

export default validateEnv;