
import fs from "fs/promises";

if (!await fs.exists(".local")) {
  await fs.mkdir(".local").then(() => console.log("> created .local folder."));
}

if (!await fs.exists(".logs")) {
  await fs.mkdir(".logs").then(() => console.log("> created .logs folder."));
}
