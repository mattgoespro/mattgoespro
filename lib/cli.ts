import colors from "colors";
import { createCommand, program } from "commander";
import {
  hoppingmodeWebComposeRemove,
  hoppingmodeWebComposeStart,
  hoppingmodeWebPullImages,
  hoppingmodeWebRunContainers
} from "./commands";

/**
 * Enable shell colors
 */
colors.enable();

/**
 * Create CLI and add commands.
 */
function configureCli() {
  return program
    .name("mattgoespro")
    .addCommand(
      createCommand("hoppingmode-web")
        .alias("hw")
        .description("Manage hoppingmode-web Docker stack.")
        .addCommand(hoppingmodeWebPullImages)
        .addCommand(hoppingmodeWebRunContainers)
        .addCommand(hoppingmodeWebComposeStart)
        .addCommand(hoppingmodeWebComposeRemove)
    );
}

export default configureCli;
