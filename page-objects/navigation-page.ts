import { Page } from '@playwright/test' // import the type of Page
//import { Page, Locator } from '@playwright/test' // import the type of Page
import { step } from '../helpers/test-step-decorator' // to get the more details about the steps eg: when test fails

export class NavigationPage {
  readonly page: Page
  // can use Locators for Page object Implementation, but when editing code by multiple testers , can easily duplicate existing locator under a dirrent name, bunch of locators hard to read inside constructor
  // readonly formLayout: Locator
  constructor(page: Page) {
    this.page = page
    // this.formLayout = page.getByText('Form Layouts')
  }

  @step
  async formLayoutsPage() {
    // await this.page.getByText('Forms').click()
    await this.selectGroupMenuItem('Forms')
    await this.page.getByText('Form Layouts').click()
    // await this.formLayout.click()
  }

  private async selectGroupMenuItem(groupMenuTitle: string) {
    const groupMenuitem = this.page.getByTitle(groupMenuTitle)
    const expandedState = await groupMenuitem.getAttribute('aria-expanded')

    if (expandedState == 'false') {
      await groupMenuitem.click()
    }
  }
}
