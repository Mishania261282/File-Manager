import fsPromises from "node:fs/promises";
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { resolvePath, isFile } from "../utils/helpers.js";

export const compress = async (cwd, rootDir, args) => {
  const [sourceFile, destination] = args;
  if (!sourceFile || !destination)
    throw new Error("Missing arguments: path_to_file path_to_destination");

  const resolvedCompressPath = resolvePath(cwd, sourceFile);
  const resolvedDestinationDir = resolvePath(cwd, destination);

  if (!(await isFile(resolvedCompressPath))) {
    throw new Error(`Source "${sourceFile}" is not a valid file`);
  }

  const sourceFileName = path.basename(resolvedCompressPath);
  const archiveFileName = `${sourceFileName}.br`;
  const finalArchivePath = path.join(resolvedDestinationDir, archiveFileName);
  const stats = await fsPromises.stat(resolvedDestinationDir);
  if (stats.isFile()) {
    throw new Error(`Destination "${destination}" is a file, not a directory.`);
  }

  if (!stats.isDirectory()) {
    try {
      await fsPromises.mkdir(resolvedDestinationDir, { recursive: true });
      console.log(`Created destination directory: ${resolvedDestinationDir}`);
    } catch (err) {
      throw new Error(
        `Could not create destination directory "${destination}": ${err.message}`
      );
    }
  }

  const writableStream = fs.createWriteStream(finalArchivePath);
  const brotliCompress = zlib.createBrotliCompress();
  const readableStream = fs.createReadStream(resolvedCompressPath);

  await new Promise((resolve, reject) => {
    readableStream.on("error", reject);
    writableStream.on("error", reject);
    writableStream.on("finish", resolve);

    readableStream.pipe(brotliCompress).pipe(writableStream);
  });

  console.log(`File "${sourceFile}" compressed to "${finalArchivePath}"`);
};
export const decompress = async (cwd, rootDir, args) => {
    const [sourceArchive, destination] = args;
  
    if (!sourceArchive || !destination) {
      throw new Error("Missing arguments: path_to_archive path_to_destination");
    }
  
    const resolvedSourceArchive = resolvePath(cwd, sourceArchive);
    const resolvedDestination = resolvePath(cwd, destination);
  
    if (!(await isFile(resolvedSourceArchive))) {
      throw new Error(`Source archive "${sourceArchive}" is not a valid file.`);
    }
    if (path.extname(resolvedSourceArchive).toLowerCase() !== '.br') {
        console.warn(`Warning: Source file "${sourceArchive}" does not have a .br extension.`);
    }
  
    let finalOutputPath;
    try {
      const destStat = await fsPromises.stat(resolvedDestination);
      if (destStat.isDirectory()) {
        // Если назначение - директория, формируем имя файла
        const archiveName = path.basename(resolvedSourceArchive);
        const originalFileName = path.basename(archiveName, '.br');
        finalOutputPath = path.join(resolvedDestination, originalFileName);
      } else if (destStat.isFile()) {
        // Если назначение - файл, используем его
        finalOutputPath = resolvedDestination;
      } else {
        throw new Error(`Destination "${destination}" is not a valid file or directory.`);
      }
    } catch (error) {      
      if (error.code === 'ENOENT') {        
        if (!path.extname(resolvedDestination)) {
          await fsPromises.mkdir(resolvedDestination, { recursive: true });
          const archiveName = path.basename(resolvedSourceArchive);
          const originalFileName = path.basename(archiveName, '.br');
          finalOutputPath = path.join(resolvedDestination, originalFileName);
        } else {          
          finalOutputPath = resolvedDestination;
        }
      } else {
        throw error;
      }
    }
  
    const brotliDecompress = zlib.createBrotliDecompress();
    const readableStream = fs.createReadStream(resolvedSourceArchive);
    const writableStream = fs.createWriteStream(finalOutputPath);
  
    await new Promise((resolve, reject) => {
      readableStream.on("error", reject);
      writableStream.on("error", reject);
      writableStream.on("finish", resolve);
      readableStream.pipe(brotliDecompress).pipe(writableStream);
    });
  
    console.log(`Successfully decompressed "${sourceArchive}" to "${finalOutputPath}"`);
  };
