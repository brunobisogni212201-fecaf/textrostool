import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_STYLE_PROFILE,
  type PersonalStyleProfile,
} from "./personal-style-agent";

const DATA_DIR = path.join(process.cwd(), ".devroast");
const PROFILE_PATH = path.join(DATA_DIR, "personal-style-profile.json");

export async function readStyleProfile(): Promise<PersonalStyleProfile> {
  try {
    const raw = await readFile(PROFILE_PATH, "utf8");
    return JSON.parse(raw) as PersonalStyleProfile;
  } catch {
    return DEFAULT_STYLE_PROFILE;
  }
}

export async function writeStyleProfile(profile: PersonalStyleProfile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf8");
}

export function getStyleProfilePath() {
  return PROFILE_PATH;
}
