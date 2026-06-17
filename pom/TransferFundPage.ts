import { Expect, Page } from "@playwright/test";

export default class TransferFundPage {
    constructor(private page: Page) {}
    // transferFund: selects destination account by its exact account ID
    async transferFund(data: any, expect: Expect, destinationAccountId: string) {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await expect(this.page.locator('#amount')).toBeVisible();
        await expect(this.page.locator('#toAccountId option')).not.toHaveCount(0);
        await this.page.locator('#amount').fill(data.amount);
        await this.page.locator('#toAccountId').selectOption(destinationAccountId);
        await this.page.getByRole('button', { name: 'Transfer' }).click();
    }
    // transferFundintosameaccount: does NOT change the destination dropdown — transfers to same account
    async transferFundintosameaccount(data: any, expect: Expect) {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await expect(this.page.locator('#amount')).toBeVisible();
        await expect(this.page.locator('#toAccountId option')).not.toHaveCount(0);
        await this.page.locator('#amount').fill(data.amount);
        await this.page.getByRole('button', { name: 'Transfer' }).click();
    }
}