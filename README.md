# Readme

# Sosik(소식) - ExpressServer 프로젝트

---

### 프로젝트 소개

---

뉴스를 크롤링 하여 언론사나 주제별로 묶어 피드를 만들어주는 웹 애플리케이션입니다. Express로 구성한 해당 서버는 소식의 프론트엔드 서버와 통신하는 REST API 서버입니다.

TypeScript를 적용하였고, Express를 이용하여 서버를 구성하였습니다.

### 특징

---

`winston` 을 사용하여 로그를 쌓았습니다.

`cookie-parser` 를 이용하여 카카오 로그인 처리를 하였습니다.

`mongoose` 를 사용하여 MongoDB를 사용하였습니다.

`axios` 를 이용해 크롤링할 사이트의 html을 수집하였습니다.

`iconv-lite` 를 이용하여 수집한 html 정보를 인코딩하였습니다.

`cheerio` 를 이용하여 크롤링한 사이트의 html 정보에서 데이터를 수집하였습니다.

`node-cron` 을 이용하여 크롤링 메소드를 스케쥴링 하였습니다.

**개발 시 특징**

`typescript` 를 사용하였습니다.

`nodemon` 을 사용하였습니다.

`class-validator` 를 사용하여 유효성 검사를 하였습니다.

### 폴더 구조

```
src
│  App.ts // 서버 구동 관련 파일입니다.
│  www.ts // 환경 변수 로드 및 컨트롤러 로드 관련 파일입니다.
│
├─controllers
│  ├─authentication // 로그인, 로그아웃 및 쿠키 인증 관련
│  │      authentication.controller.ts
│  │      authentication.service.ts
│  │
│  ├─news // 기사 관련
│  │      fakeNewsLog.model.ts // 가짜 뉴스 로그 Model
│  │      news.controller.ts // 가짜 뉴스 관련 라우팅 포함 
│  │      news.cron.ts // 크롤링 관련 스케쥴링
│  │      news.interface.ts
│  │      news.model.ts
│  │      news.service.ts // 크롤링, 가짜 뉴스 로그 관련 로직 포함
│  │
│  ├─press // 언론사 관련
│  │      press.controller.ts
│  │      press.interface.ts
│  │      press.model.ts
│  │      press.service.ts
│  │      pressFollow.model.ts // 언론사 팔로우 Model
│  │
│  ├─save // 뉴스 관련
│  │      save.controller.ts
│  │      save.interface.ts
│  │      save.model.ts
│  │      save.service.ts
│  │
│  ├─topic // 주제 관련
│  │      topic.contoller.ts
│  │      topic.interface.ts
│  │      topic.service.ts
│  │      topicFollow.model.ts // 주제 팔로우 Model
│  │
│  └─user // 유저 관련
│          user.controller.ts
│          user.dto.ts // user 정보 관련 DTO
│          user.interface.ts
│          user.model.ts
│          user.service.ts
│
├─exceptions
│      HttpException.ts // HTTP 오류 처리
│
├─interfaces
│      controller.interface.ts // 컨트롤러 관련 인터페이스
│      kakaoToken.interface.ts // 카카오톡 로그인 API 인터페이스
│
├─middleware
│      cookie.middleware.ts // 쿠키 등록 미들웨어
│      error.middleware.ts // 에러 처리 미들웨어
│      validation.middleware.ts // user DTO 유효성 검사 미들웨어
│      winston.middleware.ts // 로그 생성 미들웨어
│
└─utils
        newsReplace.ts // 뉴스 내용 처리 유틸
        validateEnv.ts // 유효성 검사 유틸
```

### 환경 변수 파일

---

```
# 몽고DB 유저 네임
MONGO_USER
# 몽고DB 유저 비밀번호
MONGO_PASSWORD
# 몽고DB 서버 주소
MONGO_DB
# 몽고DB 서버 포트
MONGO_PORT
# 몽고DB DB이름
MONGO_DBNAME
# 서버를 구동할 포트
PORT

# 카카오 클라이언트 ID
CLIENT_ID
# 카카오 클라이언트 시크릿ID
CLIENT_SECRET
```