#!/usr/bin/env node
/**
 * Creates (or promotes) an admin account directly in D1.
 *
 * Needed because there is no public sign-up UI and `defaultRole` is "student",
 * so the very first admin cannot be made through the app itself.
 *
 * The password is read from the terminal with echo off, or from
 * ADMIN_PASSWORD if stdin is not a TTY. It is hashed here with Better Auth's
 * own scrypt (`better-auth/crypto`) and only the hash is ever sent to D1.
 *
 *   node scripts/create-admin.mjs --email you@example.com --name "Your Name"
 *   node scripts/create-admin.mjs --email you@example.com --remote
 *
 * Re-running for an existing email promotes that user to admin and resets
 * their password.
 */

import { execFileSync } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { createInterface } from "node:readline";

import { hashPassword } from "better-auth/crypto";

const DATABASE = "hft-data";
const MIN_PASSWORD_LENGTH = 12; // must match emailAndPassword.minPasswordLength

function parseArgs(argv) {
  const args = { remote: false, name: "" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--remote") args.remote = true;
    else if (arg === "--local") args.remote = false;
    else if (arg === "--email") args.email = argv[++i];
    else if (arg === "--name") args.name = argv[++i];
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }
  return args;
}

function promptPassword(prompt) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      const fromEnv = process.env.ADMIN_PASSWORD;
      if (!fromEnv) {
        reject(
          new Error(
            "stdin is not a TTY and ADMIN_PASSWORD is not set. Run this " +
              "directly in your terminal so the password can be typed.",
          ),
        );
        return;
      }
      resolve(fromEnv);
      return;
    }

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    // Swallow the echoed characters so the password never appears on screen
    // or in scrollback.
    const onData = () => {
      process.stdout.write(`\r${prompt}${" ".repeat(24)}\r${prompt}`);
    };
    process.stdout.write(prompt);
    process.stdin.on("data", onData);

    rl.question("", (answer) => {
      process.stdin.off("data", onData);
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

/** SQL string literal with single quotes doubled. */
function sql(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * Always uses --command, never --file. On --remote, `--file` uploads the SQL
 * and returns only a summary ("Total queries executed", "Rows read", ...)
 * instead of the selected rows, which silently breaks any read-back.
 * --command returns real results on both local and remote.
 *
 * execFileSync passes argv directly, so there is no shell quoting to get wrong.
 */
function runWrangler(statements, remote) {
  return execFileSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      DATABASE,
      remote ? "--remote" : "--local",
      "--command",
      statements.join(" "),
      "--json",
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
}

/** Wrangler prefixes progress lines before the JSON; the payload starts at the
 *  first line that is exactly "[". */
function parseResults(output) {
  const lines = output.split("\n");
  const start = lines.findIndex((line) => line.trim() === "[");
  if (start === -1) return [];
  try {
    return JSON.parse(lines.slice(start).join("\n"));
  } catch {
    return [];
  }
}

function queryOne(query, remote) {
  const row = parseResults(runWrangler([query], remote))[0]?.results?.[0];
  // A summary object means the query returned no selected rows.
  if (!row || "Total queries executed" in row) return null;
  return row;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.email) {
    console.error(
      "Usage: node scripts/create-admin.mjs --email <email> [--name <name>] [--remote]",
    );
    process.exit(1);
  }

  const email = args.email.trim().toLowerCase();
  const target = args.remote ? "REMOTE (production)" : "local";
  console.log(`Database : ${DATABASE} (${target})`);
  console.log(`Email    : ${email}`);

  const password = await promptPassword("Password : ");
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(
      `\nPassword must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
    process.exit(1);
  }
  const confirm = await promptPassword("Confirm  : ");
  if (password !== confirm) {
    console.error("\nPasswords do not match.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const existing = queryOne(
    `SELECT id FROM "user" WHERE email = ${sql(email)};`,
    args.remote,
  );

  if (existing) {
    console.log(`\nUser exists (${existing.id}) -- promoting to admin.`);
    runWrangler(
      [
        `UPDATE "user" SET role = 'admin', "emailVerified" = 1, banned = 0, "updatedAt" = ${sql(now)} WHERE id = ${sql(existing.id)};`,
        `UPDATE "account" SET password = ${sql(passwordHash)}, "updatedAt" = ${sql(now)} WHERE "userId" = ${sql(existing.id)} AND "providerId" = 'credential';`,
        // A user can exist without a credential row -- e.g. created by checkout,
        // or left behind by a partial cleanup. Without this insert the UPDATE
        // above matches nothing and the account stays unusable.
        `INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
         SELECT ${sql(randomUUID())}, ${sql(existing.id)}, ${sql(existing.id)}, 'credential', ${sql(passwordHash)}, ${sql(now)}, ${sql(now)}
         WHERE NOT EXISTS (
           SELECT 1 FROM "account" WHERE "userId" = ${sql(existing.id)} AND "providerId" = 'credential'
         );`,
      ],
      args.remote,
    );
  } else {
    const userId = randomBytes(16).toString("hex");
    console.log(`\nCreating new admin user (${userId}).`);
    runWrangler(
      [
        `INSERT INTO "user" (id, name, email, "emailVerified", image, role, banned, "createdAt", "updatedAt")
         VALUES (${sql(userId)}, ${sql(args.name || email.split("@")[0])}, ${sql(email)}, 1, NULL, 'admin', 0, ${sql(now)}, ${sql(now)});`,
        `INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
         VALUES (${sql(randomUUID())}, ${sql(userId)}, ${sql(userId)}, 'credential', ${sql(passwordHash)}, ${sql(now)}, ${sql(now)});`,
      ],
      args.remote,
    );
  }

  // Read back rather than trusting the write: a mismatched branch or a
  // silently-empty UPDATE must not be reported as success.
  const check = queryOne(
    `SELECT email, role, banned, (SELECT COUNT(*) FROM "account" a WHERE a."userId" = u.id AND a."providerId" = 'credential' AND a.password IS NOT NULL) AS credentials
     FROM "user" u WHERE email = ${sql(email)};`,
    args.remote,
  );

  if (!check || check.role !== "admin" || Number(check.credentials) < 1) {
    console.error(
      "\nVerification FAILED -- no admin row with a credential password was found.",
    );
    console.error("Read back:", check);
    process.exit(1);
  }

  console.log("\nVerified:", check);
  console.log("Sign in at /login with that email and password.");
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
