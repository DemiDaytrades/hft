-- Better Auth core schema for D1 (SQLite).
-- Table and column names match Better Auth's expected schema exactly --
-- running `npx @better-auth/cli generate` should produce no diff against this.

CREATE TABLE "user" (
  "id"            text    NOT NULL PRIMARY KEY,
  "name"          text    NOT NULL,
  "email"         text    NOT NULL UNIQUE,
  "emailVerified" integer NOT NULL DEFAULT 0,
  "image"         text,
  "createdAt"     date    NOT NULL,
  "updatedAt"     date    NOT NULL
);

CREATE TABLE "session" (
  "id"        text NOT NULL PRIMARY KEY,
  "userId"    text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "token"     text NOT NULL UNIQUE,
  "expiresAt" date NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" date NOT NULL,
  "updatedAt" date NOT NULL
);

CREATE INDEX "session_userId_idx" ON "session" ("userId");

CREATE TABLE "account" (
  "id"                    text NOT NULL PRIMARY KEY,
  "userId"                text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accountId"             text NOT NULL,
  "providerId"            text NOT NULL,
  "accessToken"           text,
  "refreshToken"          text,
  "accessTokenExpiresAt"  date,
  "refreshTokenExpiresAt" date,
  "scope"                 text,
  "idToken"               text,
  "password"              text,
  "createdAt"             date NOT NULL,
  "updatedAt"             date NOT NULL
);

CREATE INDEX "account_userId_idx" ON "account" ("userId");

CREATE TABLE "verification" (
  "id"         text NOT NULL PRIMARY KEY,
  "identifier" text NOT NULL,
  "value"      text NOT NULL,
  "expiresAt"  date NOT NULL,
  "createdAt"  date NOT NULL,
  "updatedAt"  date NOT NULL
);

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
