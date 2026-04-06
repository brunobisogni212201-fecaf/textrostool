import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".devroast");
const PROFILE_PATH = path.join(DATA_DIR, "personal-style-profile.json");

const DEFAULT_PROFILE = {
  version: 1,
  sessions: 0,
  lastUpdatedAt: new Date(0).toISOString(),
  daysActive: [],
  signals: {
    semicolonRate: 0.5,
    singleQuoteRate: 0.5,
    typescriptRate: 0.5,
    functionalRate: 0.5,
    asyncAwaitRate: 0.5,
  },
  preferredLanguages: {},
  favoritePatterns: [],
};

async function readProfile() {
  try {
    const raw = await readFile(PROFILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

function optimizeProfile(profile) {
  const preferredLanguages = Object.fromEntries(
    Object.entries(profile.preferredLanguages || {}).map(([language, score]) => [
      language,
      Math.max(0, Number(score) - 0.02),
    ]),
  );

  return {
    ...profile,
    preferredLanguages,
    lastUpdatedAt: new Date().toISOString(),
  };
}

async function writeProfile(profile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf8");
}

async function main() {
  const current = await readProfile();
  const optimized = optimizeProfile(current);
  await writeProfile(optimized);
  console.log("Personal style agent optimized.");
  console.log(`Profile: ${PROFILE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
