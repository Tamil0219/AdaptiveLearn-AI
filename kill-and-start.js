const { exec, spawn } = require('child_process');

// This helper script attempts to free the default port (5000) before
// launching the development server with nodemon.  It works on Windows
// by killing any process holding the port.  If you run on Linux/Mac the
// command will simply fail silently.

const PORT = process.env.PORT || 5000;

console.log(`
> kill-and-start.js: freeing port ${PORT} (if occupied) and then starting nodemon...
`);

// attempt to kill port cross-platform using npx kill-port
const killCmd = `npx kill-port ${PORT}`;

exec(killCmd, (err, stdout, stderr) => {
  if (err) {
    console.warn('kill-port command returned error (safe to ignore):', err.message);
  }
  if (stdout) console.log(stdout.trim());
  if (stderr) console.error(stderr.trim());

  // now spawn nodemon
  const proc = spawn('npx', ['nodemon', 'index.js'], {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });

  proc.on('close', code => {
    process.exit(code);
  });
});
