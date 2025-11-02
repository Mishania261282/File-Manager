import path from "path";
import fs from "fs/promises";

export const resolvePath = (cwd, newPath) => path.resolve(cwd, newPath);

export const isDirectory = async (newPath) => {
  try {
    const stats = await fs.stat(newPath);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
};

export const isFile = async (newPath) => {
  try {
    const stats = await fs.stat(newPath);
    return stats.isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
};
