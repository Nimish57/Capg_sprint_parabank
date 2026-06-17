import { test, expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import TransferFundPage from "../../pom/TransferFundPage";
import data from "../../data/data.json";
test("transferfund", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const transfer = new TransferFundPage(page);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new account as destination
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption('0');
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0);
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    await expect(page.locator('#newAccountId')).not.toHaveText('');
    let destinationAccountId: any = await page.locator('#newAccountId').textContent();
    destinationAccountId = destinationAccountId.trim();
    // transfer funds via POM
    await transfer.transferFund(data[0], expect, destinationAccountId);
    await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
});
test("transferfundmorethanintheaccount", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const transfer = new TransferFundPage(page);
    await home.goto(data[2].url);
    await home.clickRegister();
    await register.register(data[2]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new account as destination
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption('0');
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0);
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    await expect(page.locator('#newAccountId')).not.toHaveText('');
    let destinationAccountId: any = await page.locator('#newAccountId').textContent();
    destinationAccountId = destinationAccountId.trim();
    // transfer funds more than balance via POM
    await transfer.transferFund(data[2], expect, destinationAccountId);
    await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
});
test("transferfundZero", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const transfer = new TransferFundPage(page);
    await home.goto(data[3].url);
    await home.clickRegister();
    await register.register(data[3]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new account as destination
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption('0');
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0);
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    await expect(page.locator('#newAccountId')).not.toHaveText('');
    let destinationAccountId: any = await page.locator('#newAccountId').textContent();
    destinationAccountId = destinationAccountId.trim();
    // transfer zero amount via POM
    await transfer.transferFund(data[3], expect, destinationAccountId);
    await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
});
test("transferfundNegative", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const transfer = new TransferFundPage(page);
    await home.goto(data[4].url);
    await home.clickRegister();
    await register.register(data[4]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new account as destination
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption('0');
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0);
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    await expect(page.locator('#newAccountId')).not.toHaveText('');
    let destinationAccountId: any = await page.locator('#newAccountId').textContent();
    destinationAccountId = destinationAccountId.trim();
    // transfer negative amount via POM
    await transfer.transferFund(data[4], expect, destinationAccountId);
    await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
});
test("transferfundintosameaccount", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const transfer = new TransferFundPage(page);
    await home.goto(data[4].url);
    await home.clickRegister();
    await register.register(data[4]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new account (needed to have at least 2 accounts in dropdown)
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption('0');
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0);
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    // transfer into same account via POM (destination dropdown left unchanged)
    await transfer.transferFundintosameaccount(data[4], expect);
    await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
});