import { spawn } from 'child_process';
import net from 'net';

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

async function startDev() {
  const port = await findAvailablePort(3000);
  console.log(`Starting Next.js on port ${port}...`);
  
  const nextDev = spawn('npx', ['next', 'dev', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true
  });

  nextDev.on('close', (code) => {
    process.exit(code);
  });
}

startDev();
