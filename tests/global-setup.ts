import path from 'path'
import { execSync } from 'child_process'

/**
 * Ensures the database is migrated and seeded before auth API tests.
 * Uses the same absolute DATABASE_URL as playwright.config.ts webServer.
 */
async function globalSetup() {
  const projectRoot = process.cwd()
  const absoluteDbPath = path.resolve(projectRoot, 'prisma', 'dev.db')
  const DATABASE_URL = 'file:' + absoluteDbPath.replace(/\\/g, '/')
  const env = { ...process.env, DATABASE_URL }

  execSync('npx prisma migrate deploy', { stdio: 'inherit', env, cwd: projectRoot })
  execSync('npx prisma db seed', { stdio: 'inherit', env, cwd: projectRoot })
}

export default globalSetup
