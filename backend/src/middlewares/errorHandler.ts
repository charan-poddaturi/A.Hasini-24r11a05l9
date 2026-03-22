import { Request, Response, NextFunction } from "express";

type HttpErrorLike = {
  status?: number;
  message?: string;
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  const e = err as HttpErrorLike;
  const status = e.status || 500;
  const message = e.message || "Internal Server Error";
  res.status(status).json({ message });
};
