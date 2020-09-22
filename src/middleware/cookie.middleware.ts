import { Request as Req, Response as Res, NextFunction as Next } from "express";

function CookieMiddleware(
  bool: boolean,
  tokenExp: number,
  cookie: string,
  name: string,
  req: Req,
  res: Res,
  next: Next
) {
  const config: any = {
    maxAge: tokenExp,
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: false,
  };
  res.cookie(name, cookie, config).json(bool).end();
}

export default CookieMiddleware;
