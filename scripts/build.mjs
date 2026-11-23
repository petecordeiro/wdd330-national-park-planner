import { cp, mkdir, rm, writeFile } from "node:fs/promises";

// Render supplies this variable during its build. Local development reads .env.
const apiKey = process.env.NPS_API_KEY?.trim();
if (!apiKey || apiKey === "replace_with_your_nps_api_key") {
  throw new Error("Set NPS_API_KEY in .env or in Render before building.");
}

await rm("build", { recursive: true, force: true });
await mkdir("build", { recursive: true });
for (const path of ["index.html", "park.html", "css", "js", "images"]) {
  await cp(path, `build/${path}`, { recursive: true });
}

// This is public browser configuration, not a server-side secret.
await writeFile(
  "build/js/config.mjs",
  `export const NPS_API_KEY = ${JSON.stringify(apiKey)};\n`,
);
console.log("Static site ready in build/.");
