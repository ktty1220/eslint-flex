#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const isProjectDir = (dir) => {
  if (!fs.existsSync(path.join(dir, 'node_modules/.bin/eslint'))) return false;
  if (!fs.existsSync(path.join(dir, 'package.json'))) return false;
  return true;
};

let baseDir = process.cwd();
while (!isProjectDir(baseDir)) {
  const nextDir = path.dirname(baseDir);
  if (!nextDir || nextDir === baseDir) {
    baseDir = null;
    break;
  }
  baseDir = nextDir;
}

const args = process.argv.slice(2);
if (!baseDir) {
  baseDir = __dirname;
  args.push('--config');
  args.push(process.env.ESLINT_FLEX_CONFIG || path.join(baseDir, '.eslintrc'));
}

let lint = path.join(baseDir, 'node_modules/.bin/eslint');
if (fs.existsSync(`${lint}.cmd`)) {
  lint += '.cmd';
}
if (lint.indexOf(' ') !== -1) {
  lint = `"${lint}"`;
}

spawn(lint, args, {
  shell: true,
  stdio: 'inherit'
});
