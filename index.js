import FileManager from "./FileManager.js";

async function run() {
  try {
    const args = process.argv.slice(2);
    let username = "Guest";
    for (const arg of args) {
      if (arg.startsWith("--username=")) {
        [, username] = arg.split("=");
        break;
      }
    }

    const fileManager = new FileManager(username);
    await fileManager.start();
  } catch (error) {
    console.error("An unhandled error occurred:", error);
    process.exit(1);
  }
}

run();
