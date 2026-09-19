import { pool } from "./client";

// ponytail: structure only, there is no reference data to seed yet. Import
// `db` from ./client and put the inserts in here, keeping them idempotent so
// this can run twice.
async function seed() {
  console.log("seed: nothing to insert yet");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
