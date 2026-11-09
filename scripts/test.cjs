const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
function testsIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return testsIn(filename);
    return /\.test\.(tsx?|cjs)$/.test(filename) ? [filename] : [];
  });
}
const files = process.argv.slice(2);
const result = spawnSync(process.execPath, [
  "--require", path.join(__dirname, "test-register.cjs"), "--test",
  ...(files.length ? files : testsIn(path.join(__dirname, "..", "lib"))),
], { stdio: "inherit", env: { ...process.env, TZ: "UTC" } });
process.exit(result.status ?? 1);
