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

test('FAQ public reads, failures, and unauthenticated write rejection', async (context) => {
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
    assert.equal((await response.json()).statusMessage, 'Invalid request origin')
  }
  assert.equal(requests.length, requestCount, 'Blocked writes must not reach Supabase')
})

test('missing configuration returns 503 and still blocks writes', async (context) => {
  const base = await startNuxt({ NUXT_SUPABASE_URL: '', NUXT_SUPABASE_PUBLISHABLE_KEY: '' }, context)
  assert.equal((await fetch(`${base}/api/faqs`)).status, 503)
  assert.equal((await fetch(`${base}/api/faqs`, { method: 'POST' })).status, 403)
})

test('Admin authentication, refresh, authorization, CSRF and FAQ CRUD', async (context) => {
  const user = { id: '937804c1-b795-4cc8-bf00-a91f42bd0a22', email: 'admin@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() }
  const item = { id: '937804c1-b795-4cc8-bf00-a91f42bd0a11', category: 'learning', question: 'Question?', answer: 'Answer.' }
  let member = true
  let membershipFailure = false
  let refreshes = 0
  let writes = 0
  let logouts = 0
  let rows = [item]
  const jwt = expiry => [
    Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
    Buffer.from(JSON.stringify({ sub: user.id, exp: expiry, role: 'authenticated' })).toString('base64url'),
    'local-fixture-signature',
  ].join('.')
  const session = (expired = false) => {
    const expires_at = Math.floor(Date.now() / 1000) + (expired ? -60 : 3600)
    return { access_token: jwt(expires_at), refresh_token: 'private-fixture-refresh-token', token_type: 'bearer', expires_in: expired ? -60 : 3600, expires_at, user }
  }
  const database = createServer(async (request, response) => {
    response.setHeader('content-type', 'application/json')
    const url = new URL(request.url, 'http://localhost')
    let raw = ''
    for await (const chunk of request) raw += chunk
    const body = raw ? JSON.parse(raw) : {}
    const reply = (status, data) => { response.writeHead(status); response.end(JSON.stringify(data)) }
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'refresh_token') {
        refreshes++
        return reply(200, session())
      }
      if (body.password !== 'fixture-password') return reply(400, { code: 'invalid_credentials', msg: 'Invalid login credentials' })
      return reply(200, session())
    }
    if (url.pathname === '/auth/v1/user') {
      if (request.headers.authorization?.endsWith('.forged')) return reply(401, { code: 'bad_jwt', msg: 'Invalid JWT' })
      return reply(200, user)
    }
    if (url.pathname === '/auth/v1/logout') { logouts++; response.writeHead(204); return response.end() }
    if (url.pathname === '/rest/v1/admin_users') {
      if (membershipFailure) return reply(500, { message: 'PRIVATE_MEMBERSHIP_ERROR' })
      return reply(200, member ? { user_id: user.id } : null)
    }
    if (url.pathname === '/rest/v1/faqs') {
      if (request.method === 'GET') return reply(200, rows)
      writes++
      assert.ok(request.headers.authorization?.startsWith('Bearer ey'), 'Writes use the authenticated JWT')
      if (request.method === 'POST') { rows.push({ ...item, ...body }); return reply(201, rows.at(-1)) }
      if (request.method === 'PATCH') { rows[0] = { ...rows[0], ...body }; return reply(200, rows[0]) }
      if (request.method === 'DELETE') { rows = []; return reply(200, { id: item.id }) }
    }
    reply(404, {})
  })
  const dbPort = await listen(database)
  context.after(() => new Promise(resolve => database.close(resolve)))
  const base = await startNuxt({ NUXT_SUPABASE_URL: `http://127.0.0.1:${dbPort}`, NUXT_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_local_test_fixture_only' }, context)
  let cookie = ''
  const request = async (path, { method = 'GET', body, headers = {} } = {}) => {
    const response = await fetch(base + path, {
      method, redirect: 'manual', headers: { cookie, origin: base, 'x-admin-request': '1', 'content-type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const jar = new Map(cookie.split('; ').filter(Boolean).map(part => part.split(/=(.*)/s).slice(0, 2)))
    for (const value of response.headers.getSetCookie()) {
      const [name, content] = value.split(';')[0].split(/=(.*)/s)
      if (!content) jar.delete(name)
      else jar.set(name, content)
    }
    cookie = [...jar].map(([name, value]) => `${name}=${value}`).join('; ')
    return response
  }
  for (const path of ['/admin', '/admin/faq', '/ADMIN', '/adm%69n/faq']) {
    const response = await request(path)
    assert.equal(response.status, 302)
    assert.equal(response.headers.get('location'), '/admin/login')
  }
  assert.equal((await request('/admin/login')).status, 200)
  const anonymous = await request('/api/admin/session')
  assert.equal(anonymous.status, 401)
  assert.equal(anonymous.headers.getSetCookie().length, 0, 'No session means no cookie changes')
  const forged = session()
  forged.access_token = forged.access_token.replace('.local-fixture-signature', '.forged')
  cookie = `cp-admin-session=base64-${Buffer.from(JSON.stringify(forged)).toString('base64url')}`
  assert.equal((await request('/api/admin/session')).status, 401, 'Cookie user metadata is never trusted')
  assert.equal(cookie, '')
  assert.equal((await request('/api/faqs', { method: 'POST', body: item })).status, 401)
  const credentials = { email: user.email, password: 'fixture-password' }
  assert.equal((await request('/api/admin/login', { method: 'POST', body: {} })).status, 400)
  assert.equal((await request('/api/admin/login', { method: 'POST', body: { ...credentials, password: 'wrong' } })).status, 401)
  assert.equal((await request('/api/admin/login', { method: 'POST', body: credentials, headers: { origin: 'https://other.example' } })).status, 403)
  member = false
  assert.equal((await request('/api/admin/login', { method: 'POST', body: credentials })).status, 403)
  assert.equal(cookie, '', 'Rejected accounts must not retain a session')
  member = true
  const login = await request('/api/admin/login', { method: 'POST', body: credentials })
  assert.equal(login.status, 200)
  assert.deepEqual(await login.json(), { id: user.id, email: user.email })
  assert.ok(login.headers.get('cache-control').includes('no-store'))
  assert.ok(login.headers.getSetCookie().some(value => /HttpOnly/i.test(value) && /Secure/i.test(value) && /SameSite=Strict/i.test(value)))
  assert.equal((await request('/admin/login')).headers.get('location'), '/admin')
  const adminPage = await request('/admin/faq')
  assert.equal(adminPage.status, 200)
  const html = await adminPage.text()
  assert.ok(!html.includes('private-fixture-refresh-token'))
  assert.equal((await request('/api/admin/session')).status, 200, 'Valid session survives another request')
  const before = writes
  assert.equal((await request('/api/faqs', { method: 'POST', body: item, headers: { 'x-admin-request': '' } })).status, 403)
  assert.equal(writes, before)
  const { id, ...input } = item
  assert.equal((await request('/api/faqs', { method: 'POST', body: input })).status, 201)
  assert.equal((await request(`/api/faqs/${id}`, { method: 'PATCH', body: { category: 'future', answer: 'Updated' } })).status, 200)
  assert.equal(rows[0].category, 'future')
  assert.equal((await request('/api/faqs/invalid', { method: 'PATCH', body: input })).status, 400)
  assert.equal((await request(`/api/faqs/${id}`, { method: 'DELETE' })).status, 204)
  member = false
  const writesBeforeRevocation = writes
  for (const [method, path] of [['POST', '/api/faqs'], ['PATCH', `/api/faqs/${id}`], ['DELETE', `/api/faqs/${id}`]]) {
    assert.equal((await request(path, { method, body: method === 'DELETE' ? undefined : input })).status, 403)
  }
  assert.equal(writes, writesBeforeRevocation, 'Membership is rechecked on every mutation')
  assert.equal((await request('/admin')).headers.get('location'), '/admin/login')
  member = true
  membershipFailure = true
  const failure = await request('/api/admin/session')
  assert.equal(failure.status, 503)
  assert.ok(!(await failure.text()).includes('PRIVATE_MEMBERSHIP_ERROR'))
  membershipFailure = false
  assert.equal((await request('/api/admin/logout', { method: 'POST' })).status, 200)
  assert.equal(cookie, '')
  assert.ok(logouts >= 2)
  assert.equal((await request('/api/admin/session')).status, 401)
  assert.equal((await request('/api/admin/login', { method: 'POST', body: credentials })).status, 200)
  cookie = `cp-admin-session=base64-${Buffer.from(JSON.stringify(session(true))).toString('base64url')}`
  const refreshed = await request('/admin')
  assert.equal(refreshed.status, 200)
  assert.ok(refreshes > 0)
  assert.ok(refreshed.headers.getSetCookie().length, 'Refreshed session must reach the browser on SSR')
})
