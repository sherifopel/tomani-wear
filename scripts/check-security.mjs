import pkg from '../src/generated/prisma/index.js'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

// Check RLS status on all tables
const tables = await prisma.$queryRaw`
  SELECT
    tablename,
    rowsecurity as rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename
`

console.log('\n── RLS Status ────────────────────────────────\n')
for (const t of tables) {
  const status = t.rls_enabled ? '✅ RLS on' : '❌ RLS OFF'
  console.log(`  ${status}  ${t.tablename}`)
}

// Check for any policies defined
const policies = await prisma.$queryRaw`
  SELECT tablename, policyname, cmd, roles
  FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename
`

console.log('\n── RLS Policies ──────────────────────────────\n')
if (policies.length === 0) {
  console.log('  No policies defined.')
} else {
  for (const p of policies) {
    console.log(`  ${p.tablename}: ${p.policyname} (${p.cmd})`)
  }
}

await prisma.$disconnect()
