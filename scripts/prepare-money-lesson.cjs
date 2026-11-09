// PREPARE only. No Wrangler, subprocesses, migrations, remote APIs, or publishing.
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { checkedDatabase } = require('./seed-academy-local.cjs');
const usage = 'Usage: node scripts/prepare-money-lesson.cjs --local-db .wrangler/state/.../database.sqlite --course-id EXISTING_ID --module-id EXISTING_ID --sort-order INTEGER [--rehearse-local | --emit-artifact PRIVATE_NEW_FILE.json]. Remote/production/publish options are forbidden.';
async function main(args) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (flag === '--rehearse-local' && !options.rehearse) { options.rehearse = true; continue; }
    if (!['--local-db', '--course-id', '--module-id', '--sort-order', '--emit-artifact'].includes(flag) || options[flag] || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error(usage);
    options[flag] = args[++index];
  }
  if (!options['--local-db'] || !options['--course-id'] || !options['--module-id'] || !options['--sort-order'] || !/^\d+$/.test(options['--sort-order']) || (options.rehearse && options['--emit-artifact'])) throw new Error(usage);
  const filename = checkedDatabase(options['--local-db']);
  const db = new DatabaseSync(filename, { readOnly: !options.rehearse });
  try {
    require('./test-register.cjs');
    const { planMoneyLessonInstallation, rehearseMoneyLessonInstallation, moneyLessonSqlArtifact } = require('../lib/academy/learning/installer.ts');
    const mapping = { courseId: options['--course-id'], moduleId: options['--module-id'], sortOrder: Number(options['--sort-order']) };
    const result = await (options.rehearse ? rehearseMoneyLessonInstallation(db, mapping) : planMoneyLessonInstallation(db, mapping));
    if (options['--emit-artifact']) fs.writeFileSync(options['--emit-artifact'], JSON.stringify(moneyLessonSqlArtifact(result), null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    console.log(JSON.stringify(result, null, 2));
    return result;
  } finally { db.close(); }
}
module.exports = { main };
if (require.main === module) main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
