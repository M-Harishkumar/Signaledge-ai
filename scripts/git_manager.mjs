import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';
import http from 'isomorphic-git/http/node';

const dir = process.cwd();

async function initAndCommit() {
  console.log('Initializing Git repository at:', dir);
  await git.init({ fs, dir });

  console.log('Staging all repository files...');
  
  function getFiles(currentDir, fileList = []) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (file === '.git' || file === 'node_modules' || file === 'dist') continue;
      const fullPath = path.join(currentDir, file);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getFiles(fullPath, fileList);
      } else {
        fileList.push(relPath);
      }
    }
    return fileList;
  }

  const allFiles = getFiles(dir);
  console.log(`Found ${allFiles.length} files to commit.`);

  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'SignalEdge OS Developer',
      email: 'developer@signaledge.in',
    },
    message: 'Initial commit: SignalEdge OS complete production release',
  });

  console.log('Committed successfully with SHA:', sha);
  console.log('Branch: main');
}

initAndCommit().catch((err) => {
  console.error('Git operation failed:', err);
  process.exit(1);
});
