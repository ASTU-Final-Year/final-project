import fs from "fs";
import { config } from "./config";

export const LOGI = (...args: any[]) => {
  const timestamp = Date.now();
  const infoStr = `${timestamp}:${process.pid} | ${args.map((a) => String(a)).join(" ")}\n`;
  fs.writeSync(config.infoFd, infoStr);
};

export const LOGE = (...args: any[]) => {
  const timestamp = Date.now();
  const infoStr = `${timestamp}:${process.pid} | ${args.map((a) => String(a)).join(" ")}\n`;
  fs.writeSync(config.errorFd, infoStr);
};
