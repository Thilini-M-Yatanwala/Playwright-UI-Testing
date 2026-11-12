import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  page.goto('https://playground.bondaracademy.com/')
})

test.describe('Form Layout page', () => {
  test.beforeEach(async ({ page }) => {
    page.getByText('Forms').click()
    page.getByText('Form Layouts').click()
  })

  test('Input fields', async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' })
    await usingTheGridEmailInput.fill('tmy@abc.com')
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially('testabc@abc.com', { delay: 200 })

    //extract input value
    const inputValue = await usingTheGridEmailInput.inputValue()

    //assertions
    await expect(usingTheGridEmailInput).toHaveValue('testabc@abc.com')
    await expect(usingTheGridEmailInput).toHaveValue(/abc@abc.com/) // check partial match
  })

  test('radio buttons', async ({ page }) => {
    const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })
    await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true }) // use force:true when have invisible elements

    const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked()
    expect(radioStatus).toBeTruthy()

    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).toBeChecked()
    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).not.toBeChecked()
  })
})

test('checkboxes', async ({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Toastr').click()

  await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true }) // can use click() as well, but click() just performs click regardless of current state of checkbox
  await expect(page.getByRole('checkbox', { name: 'Hide on click' })).toBeAttached() // locator assertion
})

test('Lists and dropdowns', async ({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Toastr').click()

  //standard dropdown
  await page
    .locator('.form-group', { hasText: 'Toast type:' })
    .getByRole('combobox')
    .selectOption('info')
  await expect(page.getByRole('combobox')).toHaveValue('info')

  //custom dropdowns - where we can't see <select> tag
  await page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select').click()
  await page.getByRole('list').getByText('bottom-end').click()
  await expect(
    page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')
  ).toHaveText('bottom-end')

  // looping through the list and test each option
  const positionDropdownField = page
    .locator('.form-group', { hasText: 'Position:' })
    .locator('nb-select')
  await positionDropdownField.click()
  const allListValues = await page.locator('nb-option').allTextContents()
  for (const listValue of allListValues) {
    await page.locator('nb-option', { hasText: listValue }).click()
    await expect(positionDropdownField).toHaveText(listValue)
    await positionDropdownField.click()
  }
})

// tooltips testing
test('tooltips', async ({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  await page.getByRole('button', { name: 'Top' }).hover()
  await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')
})

// native dialog Boxes

test('dialog box', async ({ page }) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  //need to initialize the event listener before the action click()

  page.on('dialog', (dialog) => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })

  await page.locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click() // find the tr with unique email and then click delete
  await expect(page.locator('tr', { hasText: 'mdo@gmail.com' })).not.toBeVisible()
})

// Web tables
test('web tables', async ({ page }) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  // (1) how to select row by any visible text
  const tableRowByEmail = page.getByRole('row', { name: 'twitter@outlook.com' })
  await tableRowByEmail.locator('.nb-edit').click()
  await tableRowByEmail.getByPlaceholder('Age').fill('35')
  await tableRowByEmail.locator('.nb-checkmark').click()
  await expect(tableRowByEmail.locator('td').last()).toHaveText('35')

  // (2) get row by a specific column value
  const tableRowById = page
    .getByRole('row')
    .filter({ has: page.getByRole('cell').nth(1).getByText('10') })
  await tableRowById.locator('.nb-edit').click()
  await page.locator('tbody').getByPlaceholder('E-mail').fill('test@test.com') // placeholder tag is only visible in edit mode, so we can use it to reach the element
  await page.locator('tbody').locator('.nb-checkmark').click()
  await expect(tableRowById.locator('td').nth(5)).toHaveText('test@test.com')
})
