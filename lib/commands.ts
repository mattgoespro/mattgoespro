import { Option, createCommand, createOption } from "commander";
import { resolve } from "path";
import execSh from "exec-sh";
import { format } from "util";

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

    // no args given, pull all images
    if (Object.keys(args).length === 0) {
      console.log("Pulling Docker images...".green);
      const res1 = await execCmd(frontendPull);
      const res2 = await execCmd(apiPull);

      if (res1 != null) {
        errors.push(res1);
      }

      if (res2 != null) {
        errors.push(res2);
      }
    } else {
      // pull frontend
      if (args.frontend) {
        console.log(`Pulling mattgoespro/hoppingmode-web-frontend...`.green);
        const res = await execCmd(frontendPull);

        if (res != null) {
          errors.push(res);
        }
      }

      // pull api
      if (args.api) {
        console.log("Pulling mattgoespro/hoppingmode-web-api...".green);
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

/**
 * Run hoppingmode-web Docker containers.
 */
export const hoppingmodeWebRunContainers = createCommand("run")
  .description("Start a hoppingmode-web Docker container.")
  .addOption(createOption("-i, --image <name>", "Image to run").choices(["api", "frontend"]))
  .option("-rm, --remove", "Remove existing container")
  .action(async (args) => {
    const run = "docker run -d -p %s --name %s mattgoespro/hoppingmode-web-%s:latest";
    const remove = "(docker rm -f %s || true)";

    if (Object.keys(args).length === 0) {
      console.log("Options: [-f | --frontend] [-a | --api]");
      return;
    }

    let runImage = format(run, "%s", args.image, args.image);

    if (args.remove) {
      runImage = `${format(remove, args.image)} && ${runImage}`;
    }

    let error = false;

    if (args.image === "frontend") {
      console.log("Starting frontend container...".green);

      try {
        await execSh.promise(format(runImage, "80:4000"));
      } catch (err) {
        error = true;
      }
    } else if (args.image === "api") {
      console.log("Starting api container...".green);

      try {
        await execSh.promise(format(runImage, "8080:3000"));
      } catch (err) {
        error = true;
      }
    }

    if (error) {
      console.log(`\nErrors were encountered while starting '${args.image}'`.red);
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
