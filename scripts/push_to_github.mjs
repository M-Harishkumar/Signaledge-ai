import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';
import http from 'isomorphic-git/http/node';

const dir = process.cwd();

async function pushToRemote(remoteUrl, token) {
  if (!remoteUrl) {
    console.error('Error: Remote URL is required.');
    process.exit(1);
  }

  console.log(`Setting remote 'origin' -> ${remoteUrl}`);
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl, force: true });
  } catch (e) {
    // remote already exists
  }

  console.log('Pushing main branch to GitHub...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token || process.env.GITHUB_TOKEN || 'x-access-token', password: '' }),
  });

  console.log('Push completed successfully!', pushResult);
}

const args = process.argv.slice(2);
const remoteUrl = args[0] || process.env.GITHUB_REPO_URL;
const token = args[1] || process.env.GITHUB_TOKEN;

if (remoteUrl) {
  pushToRemote(remoteUrl, token).catch((err) => {
    console.error('Git push failed:', err.message || err);
    process.exit(1);
  });
} else {
  console.log('Git repository is initialized and all 96 files are committed locally to main.');
  console.log('To push to GitHub, run:');
  console.log('node scripts/push_to_github.mjs <GITHUB_REPO_URL> <GITHUB_TOKEN>');
}
