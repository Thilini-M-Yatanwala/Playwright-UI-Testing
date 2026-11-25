import { test, expect } from '@playwright/test'
import tags from '../test-data/tags.json'

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async (route) => {
    // match by the path when we are testing in different envs

    await route.fulfill({
      json: tags,
    })
  })

  /**
send request and fetch the articles from real server and then mock the response instead of passing huge list of articles in the real response
  https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0
   */
  await page.route('*/**/api/articles*', async (route) => {
    const response = await route.fetch()
    const responseJSON = await response.json()
    responseJSON.articles[0].title = 'MOCK TITLE'
    responseJSON.articles[0].description = 'MOCK Description'

    await route.fulfill({ json: responseJSON })
  })

  await page.goto('https://conduit.bondaracademy.com/')
})

test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/)
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation'])
  await expect(page.locator('.preview-link h1').first()).toContainText('MOCK TITLE')
  await expect(page.locator('.preview-link p').first()).toContainText('MOCK Description')
})

/**
 * In Playwright, route has five core methods to control intercepted requests (fetch, fulfill, continue, abort, and fallback), while page.request (an APIRequestContext) provides direct HTTP methods (get, post, put, delete, patch, fetch) to call APIs outside the browser UI.


Method	What It Does	When to Use It
route.fetch()	Sends the request to the real server and returns the APIResponse to your test code (without sending it to the browser yet).	When you want to inspect or modify a real server response before passing it to route.fulfill().
route.fulfill()	Immediately resolves the request with your own custom response (status, headers, JSON/body).	When mocking an API completely or returning a modified route.fetch() response.
route.continue()	Lets the request proceed to the real server normally. You can optionally override the URL, headers, method, or POST payload first.	When you want to modify outgoing request data (like adding an auth header) or let unmatched requests pass through.
route.abort()	Immediately fails the request at the network level (e.g., failed, timedout, internetdisconnected).	When testing how your UI handles offline states, network drops, or blocked third-party scripts.
route.fallback()	Passes the request on to the next matching page.route() handler instead of sending it straight to the server.	When you have multiple page.route() handlers registered and want them to chain together.


 */
