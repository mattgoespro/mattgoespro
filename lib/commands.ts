import { createCommand } from "commander";
import { resolve } from "path";
import execSh from "exec-sh";

const compose = `docker-compose -f ${resolve(
  __dirname,
  "../resources/hoppingmode-web.docker-compose.yml"
)}`;

type ShellError = { stdout: string; stderr: string };

async function execCmd(pullCmd: string): Promise<ShellError> {
  try {
    await execSh.promise(pullCmd);
    return null;
  } catch (err) {
    return err;
  }
}

export const hoppingmodeWebPullImages = createCommand("pull-images")
  .option("-f, --frontend", "Frontend")
  .option("-a, --api", "API")
  .action(async (args) => {
    const frontendPull = "docker pull mattgoespro/hoppingmode-web-frontend:latest";
    const apiPull = "docker pull mattgoespro/hoppingmode-web-api:latest";
    const errors: ShellError[] = [];

    if (Object.keys(args).length === 0) {
      console.log("Pulling images...".green);
      const res1 = await execCmd(frontendPull);
      const res2 = await execCmd(apiPull);

      if (res1 != null) {
        errors.push(res1);
      }

      if (res2 != null) {
        errors.push(res2);
      }
    } else {
      if (args.frontend) {
        console.log(`Pulling frontend image...`.green);
        const res = await execCmd(frontendPull);

        if (res != null) {
          errors.push(res);
        }
      }

      if (args.api) {
        console.log("Pulling api image...".green);
        const res = await execCmd(apiPull);

        if (res != null) {
          errors.push(res);
        }
      }
    }

    if (errors.length > 0) {
      console.log("Errors were encountered while pulling the Docker images.".red);
      console.log("\nFAILED".red);
      return;
    }

    console.log("\nSUCCESS".green);
  });

export const hoppingmodeWebRunContainers = createCommand("run")
  .description("Start a hoppingmode-web Docker container.")
  .option("-f, --frontend", "Frontend")
  .option("-a, --api", "API")
  .action(async (args) => {
    const frontendRun =
      "docker run -d -p 80:4000 --name api mattgoespro/hoppingmode-web-frontend:latest";
    const apiRun = "docker run -d -p 8080:3000 --name api mattgoespro/hoppingmode-web-api:latest";

    if (Object.keys(args).length === 0) {
      console.log("options: [-f | --frontend] [-a | --api]");
      return;
    }

    const errors: ShellError[] = [];

    if (args.frontend) {
      console.log("Starting frontend container...".green);
      try {
        await execSh.promise(frontendRun);
      } catch (err) {}
    }

    if (args.api) {
      console.log("Starting api container...".green);
      try {
        await execSh.promise(apiRun);
      } catch (err) {}
    }

    if (errors.length > 0) {
      console.log("Errors were encountered while starting the Docker containers.");
      console.log("\nFAILED".red);
      return;
    }

    console.log("\nSUCCESS".green);
  });

export const hoppingmodeWebComposeStart = createCommand("start")
  .description("Start the hoppingmode-web Docker stack.")
  .action(async () => {
    try {
      await execSh.promise(`${compose} -p hoppingmode-web up -d`);
    } catch (err) {
      console.log("Failed to start hoppingmode-web.");
      console.log("\nFAILED".red);
    }
  });

export const hoppingmodeWebComposeRemove = createCommand("remove")
  .description("Remove the hoppingmode-web Docker stack.")
  .action(async () => {
    try {
      await execSh.promise(`${compose} -p hoppingmode-web down`);
    } catch (err) {
      console.log("Failed to remove hoppingmode-web.");
      console.log("\nFAILED".red);
    }
  });
