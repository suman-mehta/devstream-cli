import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const CLI_PATH = join(process.cwd(), 'src', 'index.js');

test('devstream init creates scaffold', async (t) => {
  const tempDir = await mkdtemp(join(tmpdir(), 'devstream-test-'));
  const projectName = 'sample-app';
  const projectPath = join(tempDir, projectName);

  // Run CLI in the temporary directory
  execFileSync('node', [CLI_PATH, 'init', projectName], { cwd: tempDir, stdio: 'ignore' });

  // Verify directory was created
  await access(projectPath);

  // Verify README content
  const readme = await readFile(join(projectPath, 'README.md'), 'utf8');
  assert.ok(readme.includes('# sample-app'));

  // Verify src/index.js exists and is executable
  const indexJs = await readFile(join(projectPath, 'src', 'index.js'), 'utf8');
  assert.ok(indexJs.includes("Hello from ${projectName}!"));

  // Clean up
  await rm(tempDir, { recursive: true, force: true });
});
