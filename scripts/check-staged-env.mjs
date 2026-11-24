#!/usr/bin/env node

// =============================================================================
// STAGED ENV FILE GUARD
// =============================================================================
// Refuses a commit that stages a real env file. .env.example is the one file
// that is meant to be committed, because it documents the required variables
// without carrying any values.
//
// Emergency bypass: git commit --no-verify
// =============================================================================

import { execSync } from 'node:child_process'

const staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)

const isEnvFile = (path) => {
  const name = path.split('/').pop()
  if (name === '.env.example') return false
  return name === '.env' || name.startsWith('.env.')
}

const offenders = staged.filter(isEnvFile)

if (offenders.length === 0) process.exit(0)

console.error('\n❌ Commit blocked. These staged files look like real env files:\n')
for (const file of offenders) console.error(`   • ${file}`)
console.error(`
   Env files hold secrets and must never be committed. .env* is already in
   .gitignore, so this usually means the file was force-added.

   Unstage it:  git restore --staged ${offenders[0]}
   If it is genuinely safe, name it .env.example instead.
   Bypass once (emergency only):  git commit --no-verify
`)
process.exit(1)
