import { Page } from "@playwright/test";
export default class RequestLoanPage {
    constructor (private page: Page) {}
    async requestLoan(data: any) {
        await this.page.getByRole('link', { name: 'Request Loan' }).click();
        await this.page.locator('#amount').click();
        await this.page.locator('#amount').fill(data.amount);
        await this.page.locator('#downPayment').click();
        await this.page.locator('#downPayment').fill(data.downPayment);
        await this.page.getByRole('button', { name: 'Apply Now' }).click();
    }
}