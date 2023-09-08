import { createCommand, createOption } from "commander";
import { composeDown, composeUp, pullImage, startContainer } from "./docker";

type CmdArgs = { [key: string]: unknown };

export const hoppingmodeWebPullImages = createCommand("pull-images").action(async () => {
  try {
    await Promise.all([
      pullImage("mattgoespro/hoppingmode-web-frontend:latest"),
      pullImage("mattgoespro/hoppingmode-web-api:latest")
    ]);
  } catch (err) {
    console.log(err);
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
  .option("--rm, --remove", "Remove existing container")
  .action(async (args: CmdArgs) => {
    if (args != null && Object.keys(args).length === 0) {
      console.log("[ERROR] Option '-i': Image name missing".red);
      return;
    }

    try {
      switch (args.image) {
        case "api":
          console.log("[INFO] Starting api container...".green);
          break;
        case "frontend":
          console.log("[INFO] Starting frontend container...".green);
          await startContainer("frontend", "mattgoespro/hoppingmode-web-frontend:latest", 8080);

          break;
        default:
          console.log("[ERROR] option '-i, --image <name>' argument missing".red);
          await startContainer("frontend", "mattgoespro/hoppingmode-web-api:latest", 80);
          return;
      }
    } catch (err) {
      console.log(err);
      console.log("\nFAILED".red);
      return;
    }

    console.log("\nSUCCESS".green);
  });

export const hoppingmodeWebComposeStart = createCommand("start")
  .description("[INFO] Start the hoppingmode-web Docker stack.")
  .action(async () => {
    try {
      await composeUp();
    } catch (err) {
      console.log("\nFAILED".red);
    }

    console.log("\nSUCCESS".green);
  });

export const hoppingmodeWebComposeRemove = createCommand("remove")
  .description("[INFO] Remove the hoppingmode-web Docker stack.")
  .action(async () => {
    try {
      await composeDown();
    } catch (err) {
      2;
      console.log("\nFAILED".red);
    }

    console.log("\nSUCCESS".green);
  });
