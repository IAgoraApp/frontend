import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const temporary = await mkdtemp(join(tmpdir(), 'iagora-tests-'));
const base = process.env.BASE_URL || 'http://127.0.0.1:4178';
const children = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let startupError;
function start(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: ['ignore', 'ignore', 'ignore'],
    ...options,
  });
  child.on('error', error => {
    startupError = error;
  });
  children.push(child);
  return child;
}
try {
  if (!process.env.BASE_URL)
    start(process.execPath, [
      'node_modules/vite/bin/vite.js',
      '--host',
      '127.0.0.1',
      '--port',
      '4178',
      '--strictPort',
    ]);
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (startupError) throw startupError;
    try {
      if ((await fetch(base)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Server is starting. */
    }
    await pause(100);
  }
  if (!ready) throw new Error(`O Vite não respondeu em ${base}.`);
  start(process.env.CHROMIUM_BIN || 'chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--no-first-run',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0',
    `--user-data-dir=${temporary}`,
    'about:blank',
  ]);
  let port;
  for (let i = 0; i < 100; i++) {
    if (startupError) throw startupError;
    try {
      port = (
        await readFile(join(temporary, 'DevToolsActivePort'), 'utf8')
      ).split('\n')[0];
      break;
    } catch {
      /* Browser is starting. */
    }
    await pause(100);
  }
  if (!port)
    throw new Error(
      'Chromium não iniciou. Informe CHROMIUM_BIN com o caminho do executável.'
    );
  const suite = start(process.execPath, ['tests/browser-flows.mjs'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BASE_URL: base,
      CDP_URL: `http://127.0.0.1:${port}`,
    },
  });
  const code = await new Promise(resolve => suite.on('exit', resolve));
  process.exitCode = code ?? 1;
} finally {
  for (const child of children)
    if (child.exitCode === null) child.kill('SIGTERM');
  await pause(300);
  await rm(temporary, { recursive: true, force: true });
}
