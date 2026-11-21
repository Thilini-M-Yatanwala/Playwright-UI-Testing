import { test } from '@playwright/test'
import { PageObjectManager } from '../page-objects/page-object-manager'
test.beforeEach(async ({ page }) => {
  await page.goto('https://playground.bondaracademy.com/')
})

test('Navigate to form layout page', async ({ page }) => {
  const pom = new PageObjectManager(page)

  await pom.navigateTo.formLayoutsPage()
})

//Parametrized page object method to reuse the code
test('Parametrized page object method - Using the Grid', async ({ page }) => {
  const pom = new PageObjectManager(page)

  await pom.navigateTo.formLayoutsPage()
  await pom.formLayoutsPage.submitUsingTheGridForm('tm@abc.com', 'Password1', 'Option 1')
  await pom.formLayoutsPage.submitInlineForm('John Smith', 'tmy@abc.com', true)
})
