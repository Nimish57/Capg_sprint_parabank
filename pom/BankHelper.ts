import { Page, APIRequestContext, expect } from "@playwright/test";
import apidata from "../data/api.json";
export default class BankHelper {
    constructor(private page: Page, private request: APIRequestContext) {}
    async openNewAccount(type: string) {
        await this.page.getByRole('link', { name: 'Open New Account' }).click();
        await this.page.locator('#type').selectOption(type);
        await expect(this.page.locator('#fromAccountId option')).not.toHaveCount(0);
        await this.page.locator('#fromAccountId').selectOption({ index: 0 });
        await this.page.getByRole('button', { name: 'Open New Account' }).click();
        await expect(this.page.locator('#openAccountResult')).toContainText('Congratulations');
        await expect(this.page.locator('#newAccountId')).not.toHaveText('');
        let newAccountId: any = await this.page.locator('#newAccountId').textContent();
        return newAccountId.trim();
    }
    async getFirstAccountId() {
        await this.page.getByRole('link', { name: 'Accounts Overview' }).click();
        await expect(this.page.locator('#accountTable')).toBeVisible();
        let accountId: any = await this.page.locator('#accountTable a').first().textContent();
        return accountId.trim();
    }
    async getAccountBalance(accountId: string) {
        let response = await this.request.get(apidata.BaseURL + '/accounts/' + accountId, {
            headers: { Accept: 'application/json' }
        });
        expect(response.status()).toBe(200);
        let data = await response.json();
        return data.balance;
    }
    async getAccountData(accountId: string) {
        let response = await this.request.get(apidata.BaseURL + '/accounts/' + accountId, {
            headers: { Accept: 'application/json' }
        });
        expect(response.status()).toBe(200);
        return await response.json();
    }
    async getCustomerId(accountId: string) {
        let data = await this.getAccountData(accountId);
        return data.customerId;
    }
    async getAccountCount(customerId: string) {
        let response = await this.request.get(apidata.BaseURL + '/customers/' + customerId + '/accounts', {
            headers: { Accept: 'application/json' }
        });
        expect(response.status()).toBe(200);
        let accounts = await response.json();
        return accounts.length;
    }
    async transferFunds(amount: string, destinationAccountId: string) {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await expect(this.page.locator('#toAccountId option')).not.toHaveCount(0);
        await this.page.locator('#amount').fill(amount);
        await this.page.locator('#toAccountId').selectOption(destinationAccountId);
        await this.page.getByRole('button', { name: 'Transfer' }).click();
        await expect(this.page.locator('#showResult')).toContainText('Transfer Complete!');
        await this.page.waitForFunction(() => {
            const el = document.querySelector('#showResult');
            if (!el) return false;
            const spans = el.querySelectorAll('span');
            return spans.length > 0 && Array.from(spans).every(s => s.innerText.trim() !== '');
        });
    }
}