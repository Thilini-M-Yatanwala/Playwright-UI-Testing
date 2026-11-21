import { Page } from '@playwright/test'
import { step } from '../helpers/test-step-decorator' // to get the more details about the steps eg: when test fails

export class FormLayoutsPage {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  @step
  async submitUsingTheGridForm(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator('nb-card', { hasText: 'Using the Grid' })
    await usingTheGridForm.getByRole('textbox', { name: 'Email' }).fill(email)
    await usingTheGridForm.getByRole('textbox', { name: 'Password' }).fill(password)
    await usingTheGridForm.getByLabel(optionText).check({ force: true })
    await usingTheGridForm.getByRole('button', { name: 'Sign in' }).click()
  }

  /**
   * This method submits inline form with user full name, email and remember me checkbox can be sleected
   * @param fullName
   * @param email
   * @param rememberMe  - checked /unchecked
   */

  @step
  async submitInlineForm(fullName: string, email: string, rememberMe: boolean) {
    const inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' })
    await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(fullName)
    await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email)

    if (rememberMe) {
      await inlineForm.getByRole('checkbox').check({ force: true })
    }

    await inlineForm.getByRole('button', { name: 'Submit' }).click()
  }
}
