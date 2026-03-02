import { test, expect } from '@playwright/test'

/**
 * Auth backend API tests using Playwright's request fixture (no browser).
 * Requires seeded user: admin@example.com / password (see prisma/seed.ts).
 * Base URL from playwright.config.ts (e.g. http://localhost:9002).
 */
const BASE = '/api/auth'

test.describe('Auth API', () => {
  test('POST /login – missing credentials returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/login`, {
      data: {},
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Missing credentials')
  })

  test('POST /login – invalid credentials returns 401', async ({ request }) => {
    const res = await request.post(`${BASE}/login`, {
      data: { identifier: 'nobody@example.com', password: 'wrong' },
    })
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Invalid credentials')
  })

  test('POST /login – success returns 200 and user info', async ({ request }) => {
    const res = await request.post(`${BASE}/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        identifier: 'admin',
        password: 'password',
        rememberMe: false,
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      id: expect.any(String),
      name: 'Admin',
      email: 'admin@example.com',
      role: 'Admin',
    })
  })

  test('GET /me – unauthenticated returns user null', async ({ request }) => {
    const res = await request.get(`${BASE}/me`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.user).toBeNull()
  })

  test('GET /me – after login returns current user', async ({ request }) => {
    await request.post(`${BASE}/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        identifier: 'admin',
        password: 'password',
      },
    })
    const res = await request.get(`${BASE}/me`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.id).toBeDefined()
    expect(body.name).toBe('Admin')
    expect(body.email).toBe('admin@example.com')
    expect(body.username).toBe('admin')
    expect(body.role).toBe('Admin')
    expect(Array.isArray(body.permissions)).toBe(true)
  })

  test('POST /logout – returns ok', async ({ request }) => {
    await request.post(`${BASE}/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: { identifier: 'admin', password: 'password' },
    })
    const res = await request.post(`${BASE}/logout`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  test('GET /me – after logout returns user null', async ({ request }) => {
    await request.post(`${BASE}/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: { identifier: 'admin', password: 'password' },
    })
    await request.post(`${BASE}/logout`)
    const res = await request.get(`${BASE}/me`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.user).toBeNull()
  })
})

test.describe('Auth API – request-reset', () => {
  test('POST /request-reset – missing identifier returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/request-reset`, { data: {} })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Missing identifier')
  })

  test('POST /request-reset – unknown user returns 200 (no leak)', async ({ request }) => {
    const res = await request.post(`${BASE}/request-reset`, {
      data: { identifier: 'unknown@example.com' },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  test('POST /request-reset – known user returns 200 and token', async ({ request }) => {
    const res = await request.post(`${BASE}/request-reset`, {
      data: { identifier: 'admin@example.com' },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.token).toBeDefined()
    expect(typeof body.token).toBe('string')
  })
})

test.describe('Auth API – reset-password', () => {
  test('POST /reset-password – missing payload returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/reset-password`, { data: {} })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid payload')
  })

  test('POST /reset-password – invalid token returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/reset-password`, {
      data: { token: 'invalid-token', newPassword: 'newpass123' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid or expired token')
  })
})
