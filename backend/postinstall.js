
import fs from "fs/promises";
import {config} from "./config";

if (!await fs.exists(config.localPath)) {
  await fs.mkdir(config.localPath).then(() => console.log("✅ Created 'local' folder."));
}

if (!await fs.exists(config.logsPath)) {
  await fs.mkdir(config.logsPath).then(() => console.log("✅ Created 'logs' folder."));
}
