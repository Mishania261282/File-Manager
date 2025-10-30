import os from "os";
import path from "path";
import readline from "readline";
import fs from "fs/promises";

const args = process.argv.slice(2);
let username = "Guest";
for (const arg of args) {
  if (arg.startsWith("--username=")) {
    [, username] = arg.split("=");
    break;
  }
}

// Инициализация
let currentWorkingDirectory = os.homedir();
const rootDirectory = path.parse(currentWorkingDirectory).root;

// Используем шаблонные строки для приветствия
console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${currentWorkingDirectory}`);
