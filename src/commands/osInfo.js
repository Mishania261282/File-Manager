import osInfo from "os";

export const os = async (cwd, rootDir, args) => {
  const osCommand = args[0];
  if (!osCommand) throw new Error("Missing argument for os command");  
  switch (osCommand) {
    case "--EOL":      
      console.log(osInfo.EOL);
      break;
    case "--cpus":
      const cpus = osInfo.cpus();
      console.log(`Total amount of CPUs: ${cpus.length}`);
      cpus.forEach((cpu, index) => {
        const clockRateGHz = (cpu.speed / 1000).toFixed(2);
        console.log(
          `CPU ${index}: Model - ${cpu.model}, Clock Rate - ${clockRateGHz} GHz`
        );
      });
      break;
    case "--homedir":
      console.log(osInfo.homedir());
      break;
    case "--username": // Get current system user name
      console.log(osInfo.userInfo().username);
      break;
    case "--architecture": // Get CPU architecture
      console.log(osInfo.arch());
      break;
    default:
      throw new Error(`Unknown os command: ${osCommand}`);
  }
};
