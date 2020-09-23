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
    sameSite: "lax",
    secure: true,
    domain: ".limc-pf.com",
  };
  res.cookie(name, cookie, config).json(bool).end();
}

export default CookieMiddleware;
