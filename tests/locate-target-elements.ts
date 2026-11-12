import { expect, test } from '@playwright/test'
import { only } from 'node:test'

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

})

test('Locator Syntax Rules', async ({ page }) => {

    //find by tag
    page.locator('input')

    //find by ID
    page.locator('#inputEmail1')

    //find by class
    page.locator('.status-basic')

    //find by any attribute
    page.locator('[placeholder="Email"]')

    // find by full class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // find by several selectors
    page.locator('input[placeholder="Email"]')

    //find by partial text match
    page.locator(':text("Using)')

    //find by exact tet match
    page.locator(':text-is("Using the Grid")')

})

test.skip('User Visible locators', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await page.getByRole("textbox", { name: 'Email' }).first().fill('abc@gmail.com')

    //getByLabel

    await page.getByLabel('Email').fill('abc@123.com')
    //getByPlaceHoder
    await page.getByPlaceholder('Password').fill("Merian8989")

    //getByText

    //getByTestId

    //getbytitle for menu item

})

test('Locating child elements', async ({ page }) => {

    // await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 1")').click()
    await page.locator('nb-card nb-radio-group :text-is("Option 1")').click()

    //can combine user visible locatoer and locators together as well

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click() // not recomended index --> find 3 rd nb-card


})

test('Lacating Parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('button').click()
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('button').click()

    //can use filters to find the target element from parent

    await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).getByRole('button').click()
    await page.locator('nb-card')
        .filter({ has: page.locator('nb-checkbox') })
        .filter({ hasText: 'Sign in' })
        .getByLabel('Email')
        .fill('tmyatanwa@abc.com')

    // can travel one level up to find the element

    await page.getByText('Using the Grid').locator('..').getByRole('button').click()

})

//reusing Locators

test('reUsing locators with const', async ({ page }) => {
    const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' })
    const emailInputField = basicFormSection.getByLabel('Email')

    await basicFormSection.getByLabel('Email').fill('tmy@abc.com')
    await basicFormSection.getByLabel('Password').fill('Mery123')
    await basicFormSection.locator('nb-checkbox').click()
    await basicFormSection.getByRole('button').click()

    await expect(emailInputField).toHaveValue('tmy@abc.com')

})
// extracting values for assertions and pre filled form assertions

test('Extracting Values', async ({ page }) => {

    // extracting text
    const basicformSection = page.locator('nb-card', { hasText: 'Basic form' })
    const submitButtonText = await basicformSection.getByRole('button').textContent()

    expect(submitButtonText).toEqual('Submit')

    // extracting multiple text values

    const radiobuttons = await page.locator('nb-radio').allTextContents()
    console.log("radio buttons -->", radiobuttons)
    expect(radiobuttons).toContain('Option 1')

    // extraxt input value

    const emailField = basicformSection.getByRole('textbox', { name: 'Email' })
    await emailField.fill('tmy@abc.com')
    const emailValue = await emailField.inputValue()

    expect(emailValue).toEqual('tmy@abc.com')

    //extract any attribute from the focused element

    const emailPlaceHolder = await emailField.getAttribute('placeholder')
    console.log("emailPlaceholder -->", emailPlaceHolder)


})
//assertion is the form of validation
// two types : (1)Generic --> compere right side sand left side, does not care the state of application
// (2)locator assertion --> wait for the desired outcome, built in awating machanism, if fails stop execution of rest of tests
//() soft assertion -->let your tests keep going even assertion fails

test.only('assertions', async ({ page }) => {


    const basicFormSectionButton = page.locator('nb-card', { hasText: 'Basic form' }).getByRole('button')

    const sumbitButtonText = await basicFormSectionButton.textContent()
    expect(sumbitButtonText).toEqual('Submit') // Generic assertion

    //locator assertion
    await expect(basicFormSectionButton).toHaveText('Submit')

    // soft asssertion
    await expect.soft(basicFormSectionButton).toHaveText('Submit')
    await basicFormSectionButton.click()

})//promise is a function that wait for desired conditoion execution finish w, have resolved/rejected  

test('Alternative waits', async({page})=>{
    const dialogContainer = page.locator('nb-dialog-container')

    //(1) wait for element
    await dialogContainer.waitFor()
    await page.waitForSelector('nb-dialig-container')
    // below 2 lines will not work if we did not wait for container to load
    const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents()
    expect(dialogHeaderText).toContain('Friendly reminder')

    // (2) wait for API call
    await page.waitForResponse('**/delay/*')

    // using locator which auto waits
    await expect(dialogContainer.locator('nb-card-header')).toHaveText('Friendly reminder')

})

test.only("test record at cursor", async({page})=>{
    await page.goto('https://playground.bondaracademy.com/');
    await page.goto('https://playground.bondaracademy.com/pages/iot-dashboard');
    await page.getByRole('link', { name: 'Forms' }).click();
    await page.getByText('Form LayoutsDatepicker').click();
    await page.getByRole('link', { name: 'Form Layouts' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('tmy@abc.com');
    await page.locator('#exampleInputPassword1').fill('anc123456');
   // await page.getByRole('checkbox', { name: 'Check me out' }).click();
   await page.locator('nb-card', { hasText: 'Basic form' }).locator('nb-checkbox').click()
    await page.locator('nb-card').filter({ hasText: 'Basic formEmail' }).getByRole('button').click();

})


