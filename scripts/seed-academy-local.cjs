// Offline only: this command never invokes Wrangler, migrations, or network APIs.
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const repo = path.resolve(__dirname, "..");
const localRoot = path.join(repo, ".wrangler", "state");

function checkedDatabase(filename) {
  const target = path.resolve(repo, filename);
  if (!target.startsWith(localRoot + path.sep) || !target.endsWith(".sqlite")) throw new Error("Only an existing .sqlite database under this repository's .wrangler/state is permitted.");
  // Reject symlinks in every path component, even ones that resolve back inside.
  let current = repo;
  for (const component of path.relative(repo, target).split(path.sep)) {
    current = path.join(current, component);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error("Symlink database paths are not permitted.");
  }
  if (!fs.statSync(target).isFile() || fs.realpathSync(target) !== target) throw new Error("Invalid local database path.");
  return target;
}
function findDatabase() {
  const directory = path.join(localRoot, "v3", "d1", "miniflare-D1DatabaseObject");
  const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter(name => name.endsWith(".sqlite") && !/metadata/i.test(name)) : [];
  if (files.length !== 1) throw new Error("Expected exactly one local D1 database. Supply --local-db .wrangler/state/.../database.sqlite explicitly.");
  return checkedDatabase(path.join(directory, files[0]));
}
function sqliteAdapter(sqlite) {
  return {
    prepare(sql) {
      let args = [];
      return { bind(...values) { args = values; return this; }, first() { return sqlite.prepare(sql).get(...args) ?? null; }, run() { return sqlite.prepare(sql).run(...args); } };
    },
    async batch(statements) {
      sqlite.exec("BEGIN IMMEDIATE");
      try { const results = statements.map(statement => statement.run()); sqlite.exec("COMMIT"); return results; }
      catch (error) { sqlite.exec("ROLLBACK"); throw error; }
    },
  };
}
async function main(args) {
  if (args.length && !(args.length === 2 && args[0] === "--local-db")) throw new Error("Usage: node scripts/seed-academy-local.cjs [--local-db .wrangler/state/.../database.sqlite]. Remote/production options are forbidden.");
  const filename = args.length ? checkedDatabase(args[1]) : findDatabase();
  const sqlite = new DatabaseSync(filename, { open: true });
  try {
    // Schema additions are a separate, explicit local operation.
    const columns = sqlite.prepare("PRAGMA table_info(student_quiz_attempt)").all();
    const events = sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'academy_learning_event'").get();
    if (!events || !["learning_version", "learning_questions_json", "learning_answers_json", "learning_review_json", "learning_mastery_json"].every(name => columns.some(column => column.name === name))) throw new Error("Interactive learning migration 0027 is required. Run locally: npx wrangler d1 migrations apply hft-data --local; then rerun this seed.");
    require("./test-register.cjs");
    const { installMoneyLesson } = require("../lib/academy/learning/seed.ts");
    console.log(JSON.stringify(await installMoneyLesson(sqliteAdapter(sqlite))));
  } finally { sqlite.close(); }
}
module.exports = { checkedDatabase, sqliteAdapter, main };
if (require.main === module) main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
