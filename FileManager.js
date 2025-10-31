import os from "os";
import path from "path";
import readline from "readline";
const { stdin, stdout } = process;

export default class FileManager {
  constructor(username) {
    this.username = username;
    this.currentWorkingDirectory = os.homedir();
    this.rootDirectory = path.parse(this.currentWorkingDirectory).root;
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
        `\nThank you for using File Manager, ${this.username}, goodbye!`
      )
    );

    process.on("SIGINT", () => {
      process.stdout.write(
        `\nThank you for using File Manager, ${this.username}, goodbye!\n`
      );
      process.exit(0);
    });
  }
  //  выводим Current Working Directory
  printCWD() {
    console.log(`You are currently in ${this.currentWorkingDirectory}`);
  }
  exit() {
    this.rl.close();
    process.exit(0);
  }
}
