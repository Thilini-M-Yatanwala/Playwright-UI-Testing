import { expect, test } from '@playwright/test'

/**
 * 
Quick Rule of Thumb

• Use route.* methods when your browser app makes the request and you want to intercept, fake, or tweak it in transit.
• Use request.* methods when your test script itself wants to talk directly to the backend API (often used for fast test setup or cleanup).

 */
test('create article via API directly', async ({ request, page }) => {
  const loginResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/users/login',
    {
      data: {"user":{"email":"tmy@abc.com","password":"Password1"}}
    }
  )

  expect(loginResponse.status()).toBe(200)

  const responseLoginJSON = await loginResponse.json()
  const token = responseLoginJSON.user.token
  console.log(token)

  // Direct HTTP methods available on `request` (and `page.request`):
  const newArticleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles/',
    {
      headers: { Authorization: `Token ${token}` },
      data: {"article":{"title":"Hello 1234","description":"Article Desc","body":"Hello Article","tagList":[]}}
    }
  )
  expect(newArticleResponse.status()).toEqual(201)
  // Other available methods on `request`:
  // await request.get(url)
  // await request.put(url, options)
  // await request.patch(url, options)
  // await request.delete(url, options)
  // await request.head(url, options)
  // await request.fetch(url, options)
})

test('fetch public articles via API', async ({ request }) => {
  // 1. Send GET request with optional query parameters (?limit=5&offset=0)
  const response = await request.get('https://conduit-api.bondaracademy.com/api/articles', {
    params: {
      limit: 5,
      offset: 0,
    },
  })

  // 2. Verify the HTTP status code is 200 OK
  expect(response.status()).toBe(200)

  // 3. Parse the JSON response body into a JS object
  const body = await response.json()

  // 4. Assert on the returned data
  console.log('First article title:', body.articles[0].title)
  console.log('Number of articles returned:', body.articles.length)
  await expect(body.articles.length).toBeLessThanOrEqual(5)
})
