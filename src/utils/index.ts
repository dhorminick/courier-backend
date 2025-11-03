import { type Response, type Request } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function genRand(length = 10) {
  const alphaNum =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  }
  return str;
}
export function genOtp(length = 4): number {
  const alphaNum = "0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  }
  return Number(str);
}

export const validate = (param: any, res: Response, fieldName: string) => {
  if (!param || param === null) {
    res.status(400).json({
      message: `Missing required field - ${fieldName}`,
    });
    return false;
  }
  return true;
};

export const createToken = (id: string): string => {
  const token = jwt.sign(
    {
      id: id,
    },
    config.jwtSecret
  );
  return token;
};

export const validateToken = (token: string): { id?: string } => {
  const t = jwt.verify(token as string, config.jwtSecret) as {
    id?: string;
  };

  return t;
};

export const formatDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
