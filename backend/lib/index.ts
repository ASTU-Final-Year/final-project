import fs from "fs";
import { config } from "../config";

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

export const toMainUrl = (url: URL) => {
  const mainUrl = new URL(url);
  // mainUrl.origin = url.origin.replace(config.port.toFixed(), config.frontendPort.toFixed());
  mainUrl.port = config.frontendPort.toFixed();
  return mainUrl;
};

export const toDriverUUID: { (v: string): string } = (v) => {
  const hex = Buffer.from(v, "base64url").toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const fromDriverUUID: { (v: string): string } = (v) => {
  const hex = `${v[0]}${v[1]}${v[2]}${v[3]}${v[4]}${v[5]}${v[6]}${v[7]}${v[9]}${v[10]}${v[11]}${v[12]}${v[14]}${v[15]}${v[16]}${v[17]}${v[19]}${v[20]}${v[21]}${v[22]}${v[24]}${v[25]}${v[26]}${v[27]}${v[28]}${v[29]}${v[30]}${v[31]}${v[32]}${v[33]}${v[34]}${v[35]}`;
  return Buffer.from(hex, "hex").toString("base64url");
};
