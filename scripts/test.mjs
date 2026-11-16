/**
 * Runs Vitest from a normalised working directory.
 * On Windows a lower-case drive letter in the cwd (c:\ vs C:\ – common in
 * Git Bash and some editors) makes Vitest load two copies of its runner and
 * every suite fails with "Cannot read properties of undefined (reading 'config')".
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..').replace(/^[a-z]:/, (d) => d.toUpperCase());
const bin = join(root, 'node_modules', 'vitest', 'vitest.mjs');
const { status } = spawnSync(process.execPath, [bin, 'run', ...process.argv.slice(2)], { cwd: root, stdio: 'inherit' });
process.exit(status ?? 1);
