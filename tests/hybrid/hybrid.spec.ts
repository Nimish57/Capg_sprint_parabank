import { test, expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import BankHelper from "../../pom/BankHelper";
import data from "../../data/data.json";
test("Create Checking Account via UI and Validate via API", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const bank = new BankHelper(page, request);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open new checking account
    let newAccountId = await bank.openNewAccount('0');
    console.log('New Checking Account ID:', newAccountId);
    // validate account details via api
    let accountData = await bank.getAccountData(newAccountId);
    console.log('Account Data from API:', accountData);
    expect(String(accountData.id)).toBe(newAccountId);
    expect(accountData.type).toBe('CHECKING');
    expect(accountData.balance).toBeGreaterThanOrEqual(0);
    expect(accountData.customerId).toBeDefined();
    console.log('Account Type:', accountData.type);
    console.log('Account Balance:', accountData.balance);
    console.log('Customer ID:', accountData.customerId);
});
test("Transfer via UI and Validate Source Balance via API", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const bank = new BankHelper(page, request);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // get source account id first before opening new account
    let sourceAccountId = await bank.getFirstAccountId();
    console.log('Source Account ID:', sourceAccountId);
    // open destination account
    let destinationAccountId = await bank.openNewAccount('0');
    console.log('Destination Account ID:', destinationAccountId);
    // get source balance before transfer
    let sourceBalanceBefore = await bank.getAccountBalance(sourceAccountId);
    console.log('Source Balance Before:', sourceBalanceBefore);
    // do the transfer
    await bank.transferFunds(data[0].amount, destinationAccountId);
    // get source balance after transfer
    let sourceBalanceAfter = await bank.getAccountBalance(sourceAccountId);
    console.log('Source Balance After:', sourceBalanceAfter);
    // validate source balance is reduced
    let transferAmount = Number(data[0].amount);
    let expectedBalance = sourceBalanceBefore - transferAmount;
    console.log('Expected Source Balance:', expectedBalance);
    expect(sourceBalanceAfter).toBe(expectedBalance);
});
test("Transfer via UI and Validate Destination Balance via API", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const bank = new BankHelper(page, request);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // open destination account
    let destinationAccountId = await bank.openNewAccount('0');
    console.log('Destination Account ID:', destinationAccountId);
    // get destination balance before transfer
    let destBalanceBefore = await bank.getAccountBalance(destinationAccountId);
    console.log('Destination Balance Before:', destBalanceBefore);
    // do the transfer
    await bank.transferFunds(data[0].amount, destinationAccountId);
    // get destination balance after transfer
    let destBalanceAfter = await bank.getAccountBalance(destinationAccountId);
    console.log('Destination Balance After:', destBalanceAfter);
    // validate destination balance is increased
    let transferAmount = Number(data[0].amount);
    let expectedBalance = destBalanceBefore + transferAmount;
    console.log('Expected Destination Balance:', expectedBalance);
    expect(destBalanceAfter).toBe(expectedBalance);
});
test("Full Account Lifecycle - Create Account, Transfer, Validate Balances", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const bank = new BankHelper(page, request);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // step 1 - create savings account
    let newAccountId = await bank.openNewAccount('1');
    console.log('New Account ID:', newAccountId);
    // step 2 - validate account type in api
    let accountData = await bank.getAccountData(newAccountId);
    expect(accountData.type).toBe('SAVINGS');
    console.log('Account verified in API - Type:', accountData.type);
    // step 3 - get source account and balances before transfer
    let sourceAccountId = await bank.getFirstAccountId();
    let sourceBalanceBefore = await bank.getAccountBalance(sourceAccountId);
    let destBalanceBefore = await bank.getAccountBalance(newAccountId);
    console.log('Source Balance Before:', sourceBalanceBefore);
    console.log('Destination Balance Before:', destBalanceBefore);
    // step 4 - do the transfer
    await bank.transferFunds(data[0].amount, newAccountId);
    console.log('Transfer completed');
    let transferAmount = Number(data[0].amount);
    // step 5 - validate source balance is reduced
    let sourceBalanceAfter = await bank.getAccountBalance(sourceAccountId);
    console.log('Source Balance After:', sourceBalanceAfter);
    expect(sourceBalanceAfter).toBe(sourceBalanceBefore - transferAmount);
    // step 6 - validate destination balance is increased
    let destBalanceAfter = await bank.getAccountBalance(newAccountId);
    console.log('Destination Balance After:', destBalanceAfter);
    expect(destBalanceAfter).toBe(destBalanceBefore + transferAmount);
    console.log('All balance changes validated successfully');
});
test("Validate Account Count Increases After Creation via API", async ({ page, request }) => {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const bank = new BankHelper(page, request);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p')).toHaveText('Your account was created successfully. You are now logged in.');
    // get customer id
    let accountId = await bank.getFirstAccountId();
    let customerId = await bank.getCustomerId(accountId);
    console.log('Customer ID:', customerId);
    // get account count before creating new account
    let countBefore = await bank.getAccountCount(customerId);
    console.log('Account Count Before:', countBefore);
    // create new account
    await bank.openNewAccount('1');
    console.log('New account created');
    // get account count after creating new account
    let countAfter = await bank.getAccountCount(customerId);
    console.log('Account Count After:', countAfter);
    // validate count increased by 1
    expect(countAfter).toBe(countBefore + 1);
});