import fs from "node:fs";
import crypto from "crypto";
import { resolvePath, isFile } from "../utils/helpers.js";

export const hash = async (cwd, rootDir, args) => {
  const filePath = args[0];
  if (!filePath) throw new Error("Missing argument: path_to_file");
  const resolvedHashPath = resolvePath(cwd, filePath);
  console.log(resolvedHashPath);
  if (!(await isFile(resolvedHashPath))) {
    throw new Error(`Path "${filePath}" is not a valid file`);
  }
  const hash = crypto.createHash("sha256");
  const readStreamHash = fs.createReadStream(resolvedHashPath);

  readStreamHash.on("data", (chunk) => {
    hash.update(chunk);
  });

  await new Promise((resolve, reject) => {
    readStreamHash.on("end", resolve);
    readStreamHash.on("error", reject);
  });

  console.log("hash", hash.digest("hex"));
};
