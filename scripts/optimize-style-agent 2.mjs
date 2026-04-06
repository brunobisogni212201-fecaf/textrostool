import {
  optimizeStyleProfileDaily,
} from "../src/lib/agent/personal-style-agent.ts";
import {
  getStyleProfilePath,
  readStyleProfile,
  writeStyleProfile,
} from "../src/lib/agent/style-profile-store.ts";

async function main() {
  const current = await readStyleProfile();
  const optimized = optimizeStyleProfileDaily(current);
  await writeStyleProfile(optimized);

  // eslint-disable-next-line no-console
  console.log("Personal style agent optimized.");
  // eslint-disable-next-line no-console
  console.log("Profile:", getStyleProfilePath());
  // eslint-disable-next-line no-console
  console.log(
    `Sessions=${optimized.sessions} LastUpdated=${optimized.lastUpdatedAt}`,
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
