import { createCommand } from "commander";
import { resolve } from "path";
import execSh from "exec-sh";

function logErrors(errorDescription: string, errors: string[]) {
  let errorReasons = "";

  for (const error of errors) {
    errorReasons += `\t- ${error}`;
  }

  console.log(
    `FAILED\n
    ${errorDescription}\n
    ${errorReasons}`.red
  );
}

const compose = `docker-compose -f ${resolve(
  __dirname,
  "../resources/hoppingmode-web.docker-compose.yml"
)}`;

export const hoppingmodeWebPullImages = createCommand("pull-images")
  .option("-f, --frontend", "Frontend")
  .option("-a, --api", "API")
  .action(async (args) => {
    const commands: string[] = [];
    const frontendPull = "docker pull mattgoespro/hoppingmode-web-frontend:latest";
    const apiPull = "docker pull mattgoespro/hoppingmode-web-api:latest";

    if (Object.keys(args).length === 0) {
      console.log("Pulling images...".green);
      commands.push(frontendPull, apiPull);
    } else {
      if (args.frontend) {
        console.log("Pulling frontend image...".green);
        commands.push(frontendPull);
      }

      if (args.api) {
        console.log("Pulling API image...".green);
        commands.push(apiPull);
      }
    }

    const errors: string[] = [];

    for (const command of commands) {
      try {
        await execSh.promise(command);
      } catch (err) {
        errors.push(err.stderr);
      }
    }

    if (errors.length > 0) {
      logErrors("Errors were encountered while pulling the docker images.", errors);
      return;
    }

    console.log("\nSUCCESS".green);
  });

export const hoppingmodeWebComposeStart = createCommand("start")
  .description("Start hoppingmode-web Docker services.")
  .action(async () => {
    try {
      await execSh.promise(`${compose} -p hoppingmode-web up -d`);
    } catch (err) {
      logErrors("Failed to start the docker compose stack.", err.stderr);
    }
  });

export const hoppingmodeWebComposeRemove = createCommand("remove")
  .description("Remove hoppingmode-web Docker services.")
  .action(async () => {
    try {
      await execSh.promise(`${compose} -p hoppingmode-web down`);
    } catch (err) {
      logErrors("Failed to remove the docker compose stack.", err.stderr);
    }
  });
