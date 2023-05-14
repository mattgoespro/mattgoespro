import { createCommand, program } from "commander";
import colors from "colors";
import {
  hoppingmodeWebComposeRemove,
  hoppingmodeWebComposeStart,
  hoppingmodeWebPullImages
} from "./commands";

/**
 * Enable shell colors
 */
colors.enable();

function configureCli() {
  return program
    .name("mattgoespro")
    .addCommand(
      createCommand("hoppingmode-web")
        .alias("hw")
        .description("Manage hoppingmode-web Docker stack.")
        .addCommand(hoppingmodeWebPullImages)
        .addCommand(hoppingmodeWebComposeStart)
        .addCommand(hoppingmodeWebComposeRemove)
    );
}

export default configureCli;
