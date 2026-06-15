import { test, expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import data from "../../data/data.json";
test("Parabank Registration", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new account inline (POM removed - signature mismatch fixed)
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption('1'); // SAVINGS
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0);
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    await expect(page.locator('#newAccountId')).not.toHaveText('');
    let newAccountId: any = await page.locator('#newAccountId').textContent();
    newAccountId = newAccountId.trim();
    console.log('New Account ID:', newAccountId);
});