import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, '..');
const nextBuildDirectory = path.join(repoRoot, '.next');

rmSync(nextBuildDirectory, { force: true, recursive: true });

console.log('Removed .next build output.');