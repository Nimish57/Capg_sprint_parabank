import { test, expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import data from "../../data/data.json";
import apidata from "../../data/api.json";
test("getCustomerId", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await page.getByRole('link', { name: 'Accounts Overview' }).click();
    await expect(page.locator('#accountTable')).toBeVisible();
    const accountNumber = Number(await page.locator('//table[@id="accountTable"]//a').first().textContent());
    let output = await request.get(apidata.BaseURL + '/accounts/' + accountNumber, {
        headers: {
            Accept: 'application/json'
        }
    });
    expect(output.status()).toBe(200);
    let response = await output.json();
    let customerid = response.customerId;
    console.log(customerid);
});