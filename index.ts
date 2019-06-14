import * as fs from "fs";
import { load, execute } from "./interpreter";

if (!module.parent && process.argv.length === 3) {
  fs.readFile(process.argv[2], async (err, program) => {
    if (err) {
      console.error(err);
    } else {
      const system = load(program.toString().trim());
      await execute(system);
    }
  });
} else {
  console.log("Example use: ts-node index.ts examples/hello.bf");
}
