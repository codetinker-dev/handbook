import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_MEDIA_SIZE_BYTES = 5 * 1024 * 1024;
const MEDIA_EXTENSIONS = new Set([
  ".apng",
  ".avif",
  ".bmp",
  ".gif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".m4a",
  ".m4v",
  ".mov",
  ".mp3",
  ".mp4",
  ".mpeg",
  ".mpg",
  ".ogg",
  ".ogv",
  ".png",
  ".svg",
  ".tif",
  ".tiff",
  ".wav",
  ".webm",
  ".webp",
]);

const scriptDirectory = fileURLToPath(new URL(".", import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const mode = process.argv[2] ?? "--all";

if (!new Set(["--all", "--staged"]).has(mode)) {
  console.error("Usage: check-media-size.mjs [--all|--staged]");
  process.exit(2);
}

const gitArguments =
  mode === "--staged"
    ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]
    : ["ls-files", "-z"];

const output = execFileSync("git", gitArguments, {
  cwd: repositoryRoot,
  encoding: "utf8",
});

const oversizedFiles = output
  .split("\0")
  .filter(Boolean)
  .filter((file) => MEDIA_EXTENSIONS.has(extname(file).toLowerCase()))
  .flatMap((file) => {
    try {
      const size = statSync(resolve(repositoryRoot, file)).size;
      return size > MAX_MEDIA_SIZE_BYTES ? [{ file, size }] : [];
    } catch (error) {
      if (error?.code === "ENOENT") return [];
      throw error;
    }
  });

if (oversizedFiles.length === 0) {
  console.log(
    `Media size check passed (maximum ${formatBytes(MAX_MEDIA_SIZE_BYTES)} per file).`,
  );
  process.exit(0);
}

console.error(
  `\nMedia size check failed. The maximum allowed size is ${formatBytes(MAX_MEDIA_SIZE_BYTES)} per file:\n`,
);
for (const { file, size } of oversizedFiles) {
  console.error(`  - ${file}: ${formatBytes(size)}`);
}
console.error("\nCompress or remove the file, stage the result, and try again.\n");
process.exit(1);

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}
