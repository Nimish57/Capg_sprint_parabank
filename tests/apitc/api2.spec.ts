import { test, expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import data from "../../data/data.json";
import apidata from "../../data/api.json";
test("Validate Account Type in API Response", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    // register user
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // click on open new account
    await page.getByRole('link', { name: 'Open New Account' }).click();
    // select savings account
    await page.locator('#type').selectOption('1');
    // wait for from account dropdown to load
    await expect(page.locator('#fromAccountId option')).not.toHaveCount(0); // FIX: replaced waitForTimeout
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    // click open new account button
    await page.getByRole('button', { name: 'Open New Account' }).click();
    // check congratulations message
    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');
    // get new account id
    await expect(page.locator('#newAccountId')).not.toHaveText(''); // FIX: wait for id to populate
    let newAccountId: any = await page.locator('#newAccountId').textContent();
    newAccountId = newAccountId.trim();
    console.log('New Account ID:', newAccountId);
    // call api to get account details
    let accountResponse = await request.get(apidata.BaseURL + '/accounts/' + newAccountId, {
        headers: {
            Accept: 'application/json'
        }
    });
    console.log('Account API Status:', accountResponse.status());
    expect(accountResponse.status()).toBe(200);
    let accountData = await accountResponse.json();
    console.log('Account Data:', accountData);
    let customerId = accountData.customerId;
    console.log('Customer ID:', customerId);
    // call api to get all accounts of customer
    let allAccountsResponse = await request.get(apidata.BaseURL + '/customers/' + customerId + '/accounts', {
        headers: {
            Accept: 'application/json'
        }
    });
    console.log('All Accounts API Status:', allAccountsResponse.status());
    expect(allAccountsResponse.status()).toBe(200);
    let allAccounts = await allAccountsResponse.json();
    console.log('All Accounts:', allAccounts);
    //To find the new account from the list
    let targetAccount: any;
    for (let i = 0; i < allAccounts.length; i++) {
        if (String(allAccounts[i].id) === newAccountId) {
            targetAccount = allAccounts[i];
            break;
        }
    }
    console.log('Target Account:', targetAccount);
    console.log('Account Type:', targetAccount.type);
    // verify account type is SAVINGS
    expect(targetAccount.type).toBe('SAVINGS');
});