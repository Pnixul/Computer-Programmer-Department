import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'

// Exercises the production Nuxt API against a local HTTP fixture, never Supabase.
// Run npm run build first. No real credentials or external project are needed.
const listen = async (server) => {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  return server.address().port
}

const startNuxt = async (config, context) => {
  const reservation = createServer()
  const port = await listen(reservation)
  await new Promise(resolve => reservation.close(resolve))
  const child = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, NODE_ENV: 'production', NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port), ...config },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let logs = ''
  child.stdout.on('data', chunk => { logs += chunk })
  child.stderr.on('data', chunk => { logs += chunk })
  context.after(async () => {
    if (child.exitCode === null) {
      child.kill()
      await once(child, 'exit')
    }
  })
  for (let attempt = 0; attempt < 100; attempt++) {
    if (logs.includes('Listening on')) return `http://127.0.0.1:${port}`
    if (child.exitCode !== null) throw new Error('Local Nuxt test server failed to start')
    await delay(100)
  }
  throw new Error('Local Nuxt test server startup timed out')
}

test('FAQ API reads, handles failures, and blocks every write before database access', async (context) => {
  const item = { id: '937804c1-b795-4cc8-bf00-a91f42bd0a11', category: 'learning', question: 'API fixture question?', answer: 'API fixture answer.' }
  let mode = 'populated'
  const requests = []
  const database = createServer((request, response) => {
    requests.push({ method: request.method, url: request.url })
    response.setHeader('content-type', 'application/json')
    if (mode === 'error') {
      response.writeHead(500)
      response.end(JSON.stringify({ code: 'XX000', message: 'PRIVATE_DATABASE_ERROR_DETAIL' }))
    } else {
      response.end(JSON.stringify(mode === 'empty' ? [] : [item]))
    }
  })
  const dbPort = await listen(database)
  context.after(() => new Promise(resolve => database.close(resolve)))
  const base = await startNuxt({
    NUXT_SUPABASE_URL: `http://127.0.0.1:${dbPort}`,
    NUXT_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_local_test_fixture_only',
  }, context)

  const read = await fetch(`${base}/api/faqs`)
  assert.equal(read.status, 200)
  assert.deepEqual(await read.json(), [item])
  const dbUrl = new URL(requests[0].url, 'http://localhost')
  assert.equal(dbUrl.pathname, '/rest/v1/faqs')
  assert.equal(dbUrl.searchParams.get('order'), 'sort_order.asc,id.asc')

  const html = await (await fetch(base)).text()
  assert.ok(html.includes(item.question), 'Public SSR must render API data')
  assert.ok(!html.includes('sb_publishable_local_test_fixture_only'), 'Server config must not enter the browser payload')

  mode = 'empty'
  assert.deepEqual(await (await fetch(`${base}/api/faqs`)).json(), [])
  mode = 'error'
  const failed = await fetch(`${base}/api/faqs`)
  assert.equal(failed.status, 502)
  assert.ok(!(await failed.text()).includes('PRIVATE_DATABASE_ERROR_DETAIL'))

  const requestCount = requests.length
  for (const [method, path] of [['POST', ''], ['PATCH', `/${item.id}`], ['DELETE', `/${item.id}`], ['PATCH', '/invalid-id']]) {
    const response = await fetch(`${base}/api/faqs${path}`, {
      method,
      headers: { 'content-type': 'application/json', authorization: 'Bearer not-a-real-admin-session' },
      body: method === 'DELETE' ? undefined : JSON.stringify({ category: 'learning', question: 'Attempted write', answer: 'Must not persist' }),
    })
    assert.equal(response.status, 403)
    assert.equal((await response.json()).data.code, 'FAQ_WRITES_DISABLED')
  }
  assert.equal(requests.length, requestCount, 'Blocked writes must not reach Supabase')
})

test('missing configuration returns 503 and still blocks writes', async (context) => {
  const base = await startNuxt({ NUXT_SUPABASE_URL: '', NUXT_SUPABASE_PUBLISHABLE_KEY: '' }, context)
  assert.equal((await fetch(`${base}/api/faqs`)).status, 503)
  assert.equal((await fetch(`${base}/api/faqs`, { method: 'POST' })).status, 403)
})
