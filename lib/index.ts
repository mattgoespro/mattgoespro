#!/usr/bin/env node

import configureCli from "./cli";

configureCli().parse(process.argv.slice(2), {
  from: "user"
});
