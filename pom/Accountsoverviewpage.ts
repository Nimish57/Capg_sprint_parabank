import { Page, expect } from "@playwright/test";
export default class AccountsOverviewPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async goto() {
        await this.page.getByRole("link", { name: "Accounts Overview" }).click();
        await expect(this.page.locator("#accountTable")).toBeVisible();
        console.log("Accounts Overview page loaded");
    }
    async getFirstAccountNumber() {
        await this.goto();
        let accountNumber = await this.page.locator("#accountTable a").first().textContent();
        console.log("First Account Number: " + accountNumber);
        return accountNumber!.trim();
    }
    async openNewAccount(type: string) {
        await this.page.getByRole("link", { name:"Open New Account"}).click();
        console.log("Clicked on Open New Account");
        await this.page.locator("#type").selectOption(type);
        console.log("Selected account type: " + type);
        await expect(this.page.locator("#fromAccountId")).toBeVisible();
        await expect(this.page.locator("#fromAccountId option")).not.toHaveCount(0);
        await this.page.locator("#fromAccountId").selectOption({ index: 0 });
        console.log("Selected from account");
        await this.page.getByRole("button", { name: "Open New Account" }).click();
        console.log("Clicked Open New Account button");
        await expect(this.page.locator("#openAccountResult")).toBeVisible();
        await expect(this.page.locator("#openAccountResult")).toContainText("Congratulations");
        console.log("Account created successfully");
        await expect(this.page.locator("#newAccountId")).toBeVisible();
        await expect(this.page.locator("#newAccountId")).not.toHaveText("");
        let accountId = await this.page.locator("#newAccountId").textContent();
        console.log("New Account ID: " + accountId);
        return accountId!.trim();
    }
}