import os from "os";
import path from "path";
import readline from "readline";
import Commands from "./src/commands/index.js"; // Импортируем все команды
const { stdin, stdout } = process;

export default class FileManager {
  constructor(username) {
    this.username = username;
    this.CWD = os.homedir(); //CWD-current working directory
    this.rootDirectory = path.parse(this.CWD).root;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });
    console.log(`Welcome to the File Manager, ${this.username}!`);
    this.printCWD();
  }

  async start() {    
    this.rl.prompt();
    this.rl.on("line", async (input) => {      
      const [commandName, ...commandArgs] = input.trim().split(/\s+/);
      try {
        await this.executeCommand(commandName, commandArgs);
        // Вывод CWD происходит после успешного выполнения команды
        if (commandName !== ".exit") {
          // выводим CWD если команда не является ".exit"
          this.printCWD();
        }
      } catch (error) {
        this.handleError(error);
        this.printCWD(); // Выводим CWD даже при ошибке
      }
      this.rl.prompt();
    });

    process.on("exit", () =>
      console.log(
        `\nThank you for using File Manager1, ${this.username}, goodbye!`
      )
    );

    process.on("SIGINT", () => {
      stdout.write(
        `\nThank you for using File Manager2, ${this.username}, goodbye!\n`
      );
      process.exit(0);
    });
  }
  //  выводим Current Working Directory
  printCWD() {
    console.log(`You are currently in ${this.CWD}`);
  }

  async executeCommand(commandName, commandArgs) {
    // Проверяем, есть ли такая команда в нашем наборе команд

    if (!Commands[commandName]) {
      throw new Error("Unknown command");
    }

    const commandHandler = Commands[commandName];    

    // Вызываем команду, передавая ей контекст и аргументы
    // Команда может вернуть новое CWD, если оно изменилось (например, после cd)
    const commandResult = await commandHandler(
      this.CWD,
      this.rootDirectory,
      commandArgs
    );

    if (commandResult?.newCwd) {
      this.CWD = commandResult.newCwd;
    }
  }

  handleError(error) {
    const isInvalidInputError =
      error.message.includes("Missing argument:") ||
      error.message.includes("not a valid") ||
      error.message.includes("already exists") ||
      error.message.includes("Unknown command") ||
      error.message.includes("is not a directory") ||
      error.message.includes("is not a file") ||
      error.message.includes("Cannot go higher than root directory") ||
      error.message.includes("not found");

    if (isInvalidInputError) {
      console.error("Invalid input");
    } else {
      console.error("Operation failed");
      console.error(`Details: ${error.message}`); // Отладочная информация
    }
  }

  exit() {
    this.rl.close();
    process.exit(0);
  }
}
