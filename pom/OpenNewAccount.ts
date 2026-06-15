import { Expect, Page } from "@playwright/test";

export default class OpenNewAccountPage {
    constructor(private page: Page) {}
    async openNewAccount(data: any, expect: Expect) {
        await this.page.getByRole('link', { name: 'Open New Account' }).click();
        await expect(this.page.locator('[id="fromAccountId"]')).not.toBeEmpty();
        await this.page.locator('#type').selectOption('1');
        await this.page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(this.page.locator('//div[@id="openAccountResult"]/h1')).toHaveText('Account Opened!');
        await this.page.getByRole('link', { name: 'Open New Account' }).click();
        // await this.page.locator('#type').selectOption('2');
        await this.page.getByRole('button', { name: 'Open New Account' }).click(); 
        await this.page.getByRole('link', { name: 'Open New Account' }).click();
        await expect(this.page.locator('[id="fromAccountId"]')).not.toBeEmpty();
        await this.page.locator('#type').selectOption('1');
        await this.page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(this.page.locator('//div[@id="openAccountResult"]/h1')).toHaveText('Account Opened!');
        await this.page.getByRole('link', { name: 'Open New Account' }).click();
        await expect(this.page.locator('#type')).toBeVisible();
        await this.page.getByRole('button', { name: 'Open New Account' }).click();         
  }
}