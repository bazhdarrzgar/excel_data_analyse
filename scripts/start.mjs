import { spawn } from 'child_process';
import net from 'net';
import os from 'os';
import fs from 'fs';
import path from 'path';

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is busy, trying ${port + 1}...`);
    port++;
  }
  return port;
}

const NUBX_CMD = (() => {
  const isWin = process.platform === 'win32';
  const home = os.homedir();
  const localNubx = isWin 
    ? path.join(home, '.nub', 'bin', 'nubx.exe')
    : path.join(home, '.nub', 'bin', 'nubx');
  
  if (fs.existsSync(localNubx)) {
    return localNubx;
  }
  return 'nubx'; // Fallback to PATH
})();

async function startProd() {
  const port = await findAvailablePort(3000);
  console.log(`Starting Next.js in production on port ${port}...`);
  
  const nextStart = spawn(NUBX_CMD, ['next', 'start', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true
  });

  nextStart.on('close', (code) => {
    process.exit(code);
  });
}

startProd();
