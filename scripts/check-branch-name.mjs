#!/usr/bin/env node

// =============================================================================
// BRANCH NAME CHECK
// =============================================================================
// Blocks a push from a branch that does not match the convention in
// .claude/skills/git-workflow.md:
//
//   feat/TW-<issue>-short-description
//   fix/TW-<issue>-short-description
//   task/TW-<issue>-short-description
//
// TW-<issue> is the GitHub issue number. dev and main are exempt.
// Emergency bypass: git push --no-verify
// =============================================================================

import { execSync } from 'node:child_process'

const EXEMPT = ['dev', 'main']
const PATTERN = /^(feat|fix|task)\/TW-\d+-[a-z0-9]+(-[a-z0-9]+)*$/

const branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' }).trim()

if (EXEMPT.includes(branch)) process.exit(0)

if (PATTERN.test(branch)) {
  console.log(`✅ Branch name "${branch}" is fine.`)
  process.exit(0)
}

// Work out which rule it broke, so the message is useful rather than just "no".
const reasons = []
if (/\s/.test(branch)) reasons.push('it contains spaces')
if (/[A-Z]/.test(branch)) reasons.push('it contains uppercase letters')
if (!/^(feat|fix|task)\//.test(branch)) {
  reasons.push('it does not start with feat/, fix/ or task/ (note: not chore/)')
}
if (!/\/TW-\d+-/.test(branch)) {
  reasons.push('it has no TW-<issue> number, e.g. task/TW-74-...')
}
if (reasons.length === 0) reasons.push('the description must be lowercase words separated by hyphens')

console.error(`\n❌ Push blocked. Branch name "${branch}" does not match the convention.\n`)
for (const reason of reasons) console.error(`   • ${reason}`)
console.error(`
   Expected:  feat|fix|task/TW-<issue>-short-description
   Example:   task/TW-74-terraform-stage-0-1

   Rename it:  git branch -m <new-name>
   Bypass once (emergency only):  git push --no-verify
`)
process.exit(1)
