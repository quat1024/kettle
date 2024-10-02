import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as child_process from "node:child_process";
import * as process from "node:process";

async function readToString(...p: string[]): Promise<string> {
  return await fs.readFile(path.join(...p), { encoding: "utf-8"});
}

function spawn(...command: string[]): Promise<number> {
  console.log("Spawning", ...command);
  const p = child_process.spawn(command[0], command.slice(1));
  return new Promise((resolve, fail) => {
    p.stdout.on("data", (x) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on("data", (x) => {
      process.stderr.write(x.toString());
    });
    p.on("exit", (code, signal) => {
      if(signal) fail(signal);
      else resolve(code!);
    })
  })
}

let latestVersion = parseInt(await readToString("import-download-last-version.txt"));
const dl = "C:/Users/quat/Downloads/kettle(###).html";
const dest = "./kettle.html";

while(true) {
  try {
    await fs.copyFile(dl.replace("###", "" + latestVersion), dest);
  } catch(_e: unknown) {
    break;
  }
  
  await spawn("git", "add", ".");
  await spawn("git", "commit", "-m", `revision ${latestVersion}`);
  
  latestVersion++;
  await fs.writeFile("import-download-last-version.txt", "" + latestVersion);
}