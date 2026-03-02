/**
 * Starts Next.js dev server with DATABASE_URL set to absolute path.
 * Used by Playwright webServer so the app uses the same DB as global-setup seed.
 */
const path = require('path')
const { spawn } = require('child_process')

const root = path.resolve(__dirname, '..')
const dbPath = path.join(root, 'prisma', 'dev.db')
const DATABASE_URL = 'file:' + dbPath.replace(/\\/g, '/')

const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL },
  cwd: root,
  shell: true,
})
child.on('exit', (code) => process.exit(code ?? 0))
