import fs from "fs/promises";
import path from "path";
import { resolvePath, isDirectory } from "../utils/helpers.js";

export const up = async (cwd, rootDir, args) => {
  console.log("cwd", cwd);
  console.log("rootDir", rootDir);
  console.log("Hello");
  if (cwd === rootDir) return { newCwd: cwd }; // Остаемся в корне
  return { newCwd: path.dirname(cwd) }; // Возвращаем новое CWD, удаляя крайнюю правую директорию
};

export const cd = async (cwd, rootDir, args) => {
  const newPath = args[0];
  if (!newPath) throw new Error("Missing argument: path_to_directory");

  const resolvedPath = resolvePath(cwd, newPath);
  const relativeToRoot = path.relative(rootDir, resolvedPath);

  if (
    relativeToRoot.startsWith("..") ||
    (resolvedPath === rootDir && newPath === "..")
  ) {
    throw new Error("Cannot go higher than root directory");
  }
  if (!(await isDirectory(resolvedPath))) {
    throw new Error(`Path "${newPath}" is not a valid directory`);
  }
  return { newCwd: resolvedPath }; // Возвращаем новое CWD
};

export const ls = async (cwd, rootDir, args) => {
  const dirEntries = await fs.readdir(cwd, { withFileTypes: true });
  const folders = [];
  const files = [];
  for (const entry of dirEntries) {
    if (entry.isDirectory())
      folders.push({ name: entry.name, type: "Directory" });
    else if (entry.isFile()) files.push({ name: entry.name, type: "File" });
  }
  folders.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));
  [...folders, ...files].forEach((item) =>
    console.log(`${item.name} - Type: ${item.type}`)
  );
};
