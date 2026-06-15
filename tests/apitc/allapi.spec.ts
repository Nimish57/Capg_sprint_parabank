import { test, expect } from "@playwright/test";
import HomePage from "../../pom/HomePage";
import RegisterPage from "../../pom/RegisterPage";
import AccountsOverviewPage from "../../pom/Accountsoverviewpage";
import BankApiPage from "../../pom/Bankapipage";
import data from "../../data/data.json";
async function registerAndGetAccount(page: any, request: any) {
    const home = new HomePage(page);
    const register = new RegisterPage(page);
    const overview = new AccountsOverviewPage(page);
    const api = new BankApiPage(request);
    await home.goto(data[0].url);
    await home.clickRegister();
    await register.register(data[0]);
    await expect(page.locator('//div[@id="rightPanel"]/p'))
        .toHaveText(
            "Your account was created successfully. You are now logged in."
        );
    const accountNumber = await overview.getFirstAccountNumber();
    return {
        overview,
        api,
        accountNumber,
    };
}
test("Validate All Account Fields in API Response", async ({ page, request }) => {
    const { api, accountNumber } = await registerAndGetAccount(page, request);
    const accountData = await api.getAccountData(accountNumber);
    console.log("Account Data:", accountData);
    expect(accountData.id).toBeDefined();
    expect(accountData.type).toBeDefined();
    expect(accountData.balance).toBeDefined();
    expect(accountData.customerId).toBeDefined();
    expect(typeof accountData.id).toBe("number");
    expect(typeof accountData.type).toBe("string");
    expect(typeof accountData.balance).toBe("number");
    expect(typeof accountData.customerId).toBe("number");
});
test("GET Accounts - Invalid Customer ID Returns Error", async ({ request }) => {
    const api = new BankApiPage(request);
    const response = await api.getCustomerAccountsRaw("999999");
    console.log("Response Status:", response.status());
    console.log("Response Body:", await response.text());
    // ParaBank returns 400 for unknown customer IDs (non-standard but observed behaviour)
    expect([400, 404]).toContain(response.status());
});
test("GET Account - Non-Existent Account ID Returns Error", async ({ request }) => {
    const api = new BankApiPage(request);
    const response = await api.getAccount("99999999");
    console.log("Response Status:", response.status());
    console.log("Response Body:", await response.text());
    // Defensive check — ParaBank may return 400 or 404 for non-existent accounts
    expect([400, 404]).toContain(response.status());
});
test("GET Accounts Response Structure Validation", async ({ page, request }) => {
    const { api, accountNumber } = await registerAndGetAccount(page, request);
    const customerId = await api.getCustomerId(accountNumber);
    const response = await api.getCustomerAccounts(customerId);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    const accounts = await response.json();
    expect(Array.isArray(accounts)).toBeTruthy();
    expect(accounts.length).toBeGreaterThan(0);
    const firstAccount = accounts[0];
    expect(firstAccount).toHaveProperty("id");
    expect(firstAccount).toHaveProperty("type");
    expect(firstAccount).toHaveProperty("balance");
    expect(firstAccount).toHaveProperty("customerId");
});
test("Validate Balance Is Numeric and Non-Negative in API", async ({ page, request }) => {
    const { overview, api } = await registerAndGetAccount(page, request);
    const newAccountId = await overview.openNewAccount("1");
    const accountData = await api.getAccountData(newAccountId);
    console.log(
        "Balance:",
        accountData.balance,
        "| type:",
        typeof accountData.balance
    );
    expect(typeof accountData.balance).toBe("number");
    expect(accountData.balance).toBeGreaterThanOrEqual(0);
});
test("Verify Account ID Matches Between UI and API", async ({ page, request }) => {
    const { overview, api, accountNumber } = await registerAndGetAccount(page, request);
    const uiAccountId = await overview.openNewAccount("1");
    const customerId = await api.getCustomerId(accountNumber);
    const accounts = await api.getCustomerAccountsData(customerId);
    console.log("UI Account ID:", uiAccountId);
    console.log("Accounts from API:", accounts);
    const accountExists = accounts.some(
        (account: any) => String(account.id) === uiAccountId
    );
    expect(accountExists).toBe(true);
});