import { Expect, Page } from "@playwright/test";
export default class TransferFundPage {
    constructor(private page: Page) {}
    async transferFund(data: any,expect:Expect) {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await expect(this.page.locator('#amount')).toBeVisible();
        await this.page.getByText('Amount: $').click();
        await this.page.locator('#amount').click();
        await this.page.locator('#amount').fill(data.amount);
        await this.page.locator('#toAccountId').click();
        await this.page.locator('#toAccountId').selectOption({ index: 1 });
        // await this.page.locator('#toAccountId').selectOption('2');
        await this.page.getByRole('button', { name:'Transfer'}).click();         
    }
    async transferFundintosameaccount(data: any,expect:Expect) {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await expect(this.page.locator('#amount')).toBeVisible();
        await this.page.getByText('Amount: $').click();
        await this.page.locator('#amount').click();
        await this.page.locator('#amount').fill(data.amount);
        await this.page.locator('#toAccountId').click();
        // await this.page.locator('#toAccountId').selectOption({ index: 1 });
        // await this.page.locator('#toAccountId').selectOption('2');
        await this.page.getByRole('button', { name:'Transfer'}).click();         
    }
}