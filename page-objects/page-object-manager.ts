import { Page } from '@playwright/test'
import { NavigationPage } from '../page-objects/navigation-page'
import { FormLayoutsPage } from '../page-objects/form-layouts-page'

/**
 * A Page Objects Manager centralizes the creation and access of page-object instances in a Playwright test framework. Instead of each test creating page objects and managing their dependencies separately, the manager provides a consistent place to retrieve them.
 */

export class PageObjectManager {
  readonly navigateTo: NavigationPage
  readonly formLayoutsPage: FormLayoutsPage

  constructor(page: Page) {
    this.navigateTo = new NavigationPage(page)
    this.formLayoutsPage = new FormLayoutsPage(page)
  }
}
