import { test } from '@playwright/test'
import { NavigationPage } from '../page-objects/navigation-page'
import { FormLayoutsPage } from '../page-objects/form-layouts-page'
test.beforeEach(async ({ page }) => {
  await page.goto('https://playground.bondaracademy.com/')
})

test('Navigate to form layout page', async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  await navigateTo.formLayoutsPage()
})

//Parametrized page object method to reuse the code
test('Parametrized page object method - Using the Grid', async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  const formLayoutsPage = new FormLayoutsPage(page)
  await navigateTo.formLayoutsPage()
  await formLayoutsPage.submitUsingTheGridForm('tm@abc.com', 'Password1', 'Option 1')
  await formLayoutsPage.submitInlineForm('John Smith', 'tmy@abc.com', true)
})
