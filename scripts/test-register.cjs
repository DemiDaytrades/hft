// Compile tests in memory: no build output, Cloudflare runtime, or network setup.
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, ...args) {
  return resolve.call(this, id.startsWith("@/") ? path.resolve(__dirname, "..", id.slice(2)) : id, ...args);
};
// Styles are compiled and checked by Next.js; static React markup tests have no CSS runtime.
Module._extensions[".css"] = (module) => { module.exports = {}; };

const load = Module._load;
Module._load = function (id, ...args) {
  // This build-time marker has no runtime behavior under Next.js either.
  if (id === "server-only") return {};
  return load.call(this, id, ...args);
};
for (const extension of [".ts", ".tsx"]) {
  Module._extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    module._compile(outputText, filename);
  };
}
