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
  .description("Run a hoppingmode-web container.")
  .option("-i, --image name", "Image to run", (opt, _) => {
    if (opt == null) {
      console.error("[ERROR] Image name is required".red);
      return;
    }

    if (!["api", "frontend"].includes(opt)) {
      console.error("[ERROR] Invalid image name.".red);
      console.error("[ERROR] Supported names: api, frontend".red);
      return;
    }

    return opt.trim().toLowerCase();
  })
  .addOption(
    createOption(
      "--rm, --remove",
      "Remove container with same name before starting if it exists"
    ).choices(["api", "frontend"])
  )
  .action(async (args: CmdArgs) => {
    try {
      switch (args.image) {
        case "api":
          console.log("[INFO] Starting api container...".green);
          await startContainer("api", "mattgoespro/hoppingmode-web-api:latest", 8080);
          break;
        case "frontend":
          console.log("[INFO] Starting frontend container...".green);
          await startContainer("frontend", "mattgoespro/hoppingmode-web-frontend:latest", 8080);
          break;
        default:
          return;
      }
    } catch (err) {
      console.log("[ERROR] Failed to start container.".red);
      return;
    }

    console.log("\nSUCCESS".green);
  });

export const hoppingmodeWebComposeStart = createCommand("start")
  .description("Start the hoppingmode-web Docker stack.")
  .action(async () => {
    try {
      await composeUp();
    } catch (err) {
      console.error("\nFAILED".red);
      return;
    }

    console.error("\nSUCCESS".green);
  });

export const hoppingmodeWebComposeRemove = createCommand("remove")
  .description("Remove the hoppingmode-web Docker stack.")
  .action(async () => {
    try {
      await composeDown();
    } catch (err) {
      console.error("\nFAILED".red);
      return;
    }

    console.log("\nSUCCESS".green);
  });
