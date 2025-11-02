import fsPromises from "fs/promises";
import fs from 'node:fs'; // Импортируем весь модуль fs
import path from "path";
import { resolvePath, isFile, isDirectory } from "../utils/helpers.js";

export const cat = async (cwd, rootDir, args) => {  
  const filePath = args[0];
  if (!filePath) throw new Error("Missing argument: path_to_file");
  const resolvedPath = resolvePath(cwd, filePath);
  console.log("resolvedPath", resolvedPath);
  if (!(await isFile(resolvedPath))) {   
    throw new Error(`Path "${filePath}" is not a valid file`);
  }

  const readStream = fs.createReadStream(resolvedPath, "utf-8");
  readStream.on("data", (chunk) => process.stdout.write(chunk));
  await new Promise((resolve, reject) => {
    readStream.on("end", resolve);
    readStream.on("error", reject);
  });
};

export const add = async (cwd, rootDir, args) => {
  const fileName = args[0];
  if (!fileName) throw new Error("Missing argument: new_file_name");
  const filePath = resolvePath(fileName, cwd);
  try {
    await fsPromises.writeFile(filePath, "", { flag: "wx" });
  } catch (err) {
    if (err.code === "EEXIST")
      throw new Error(`File "${fileName}" already exists`);
    else throw err;
  }
};

export const rn = async (cwd, rootDir, args) => {
  const [oldName, newName] = args;
  if (!oldName || !newName)
    throw new Error("Missing arguments: old_name new_name");
  const oldPath = resolvePath(oldName, cwd);
  const newPath = resolvePath(newName, cwd);
  if (!(await fs.stat(oldPath).catch(() => null)))
    throw new Error(`File or directory "${oldName}" not found`);
  try {
    await fsPromises.rename(oldPath, newPath);
  } catch (err) {
    throw err;
  }
};

export const cp = async (cwd, rootDir, args) => {
  const [sourceFile, destinationDir] = args;
  if (!sourceFile || !destinationDir)
    throw new Error("Missing arguments: path_to_file path_to_new_directory");
  const sourceFilePath = resolvePath(sourceFile, cwd);
  const destinationDirPath = resolvePath(destinationDir, cwd);
  if (!(await isFile(sourceFilePath)))
    throw new Error(`Source "${sourceFile}" is not a valid file`);
  if (!(await isDirectory(destinationDirPath)))
    throw new Error(`Destination "${destinationDir}" is not a valid directory`);
  const destinationFilePath = path.join(
    destinationDirPath,
    path.basename(sourceFile)
  );
  const readableStream = fs.createReadStream(sourceFilePath);
  const writableStream = fs.createWriteStream(destinationFilePath);
  await new Promise((resolve, reject) => {
    readableStream.on("error", reject);
    writableStream.on("error", reject);
    writableStream.on("finish", resolve);
    readableStream.pipe(writableStream);
  });
};

export const mv = async (cwd, rootDir, args) => {
  const [sourceFile, destinationDir] = args;
  if (!sourceFile || !destinationDir)
    throw new Error("Missing arguments: path_to_file path_to_new_directory");
  const sourceFilePath = resolvePath(sourceFile, cwd);
  const destinationDirPath = resolvePath(destinationDir, cwd);
  if (!(await isFile(sourceFilePath)))
    throw new Error(`Source "${sourceFile}" is not a valid file`);
  if (!(await isDirectory(destinationDirPath)))
    throw new Error(`Destination "${destinationDir}" is not a valid directory`);
  const destinationFilePath = path.join(
    destinationDirPath,
    path.basename(sourceFile)
  );
  const readableStream = fs.createReadStream(sourceFilePath);
  const writableStream = fs.createWriteStream(destinationFilePath);
  await new Promise((resolve, reject) => {
    readableStream.on("error", reject);
    writableStream.on("error", reject);
    writableStream.on("finish", resolve);
    readableStream.pipe(writableStream);
  });
  await fsPromises.unlink(sourceFilePath); // Удаляем исходный файл
};

export const rm = async (cwd, rootDir, args) => {
  const filePath = args[0];
  if (!filePath) throw new Error("Missing argument: path_to_file");
  const rmFilePath = resolvePath(filePath, cwd);
  if (!(await isFile(rmFilePath))) {
    // Убедимся, что это файл
    throw new Error(`Path "${filePath}" is not a valid file`);
  }
  await fsPromises.unlink(rmFilePath);
};

export const mkdir = async (cwd, rootDir, args) => {
  const newDirectoryName = args[0];
  if (!newDirectoryName)
    throw new Error("Missing argument: new_directory_name");
  const mkdirPath = resolvePath(newDirectoryName, cwd);
  try {
    await fsPromises.mkdir(mkdirPath, { recursive: false });
  } catch (err) {
    if (err.code === "EEXIST")
      throw new Error(`Directory "${newDirectoryName}" already exists`);
    else throw err;
  }
};
