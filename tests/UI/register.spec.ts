import { test,expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import data from "../../data/data.json";
test("userr", async ({ page }) => {

    const home = new HomePage(page);
    const register = new RegisterPage(page);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
});
test("registerwithemptyfields", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.registerWithEmptyFields();
    await expect(page.locator('//div[@id="rightPanel"]/p')).not.toHaveText('Your account was created successfully. You are now logged in.');
});
test("registerwithsameusername", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    await home.goto(data[0].url);
    await home.clickRegister();
    const username=await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    await page.getByRole('link', { name: 'Log Out' }).click();
    await home.clickRegister();
    await register.registerWithsameusername(data[0],username);
    await expect(page.locator('//div[@id="rightPanel"]/p')).not.toHaveText('Your account was created successfully. You are now logged in.');
});
test("registerwithdiffpassword", async ({ page }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    await home.goto(data[1].url);
    await home.clickRegister();
    const username=await register.register(data[1]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).not.toHaveText('Your account was created successfully. You are now logged in.');
});
