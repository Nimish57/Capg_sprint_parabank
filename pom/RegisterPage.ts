import { Page } from "@playwright/test";
export default class RegisterPage {
    constructor(private page: Page) {}
    async register(data: any) {
        const username = `user${Date.now()}`;
        await this.page.locator('[id="customer.firstName"]').click();
        await this.page.locator('[id="customer.firstName"]').fill(data.firstName);
        await this.page.locator('[id="customer.lastName"]').fill(data.lastName);
        await this.page.locator('[id="customer.address.street"]').fill(data.street);
        await this.page.locator('[id="customer.address.city"]').fill(data.city);
        await this.page.locator('[id="customer.address.state"]').fill(data.state);
        await this.page.locator('[id="customer.address.zipCode"]').fill(data.zipCode);
        await this.page.locator('[id="customer.phoneNumber"]').fill(data.phoneNumber);
        await this.page.locator('[id="customer.ssn"]').fill(data.ssn);
        await this.page.locator('[id="customer.username"]').fill(username);
        await this.page.locator('[id="customer.password"]').fill(data.password);
        await this.page.locator('#repeatedPassword').fill(data.confirmPassword);
        await this.page.getByRole('button', { name: 'Register' }).click();
        return username;
    }
    async registerWithEmptyFields() {
        await this.page.getByRole('button', { name: 'Register' }).click();
    }
    async registerWithsameusername(data : any,username: string) {
        await this.page.locator('[id="customer.firstName"]').click();
        await this.page.locator('[id="customer.firstName"]').fill(data.firstName);
        await this.page.locator('[id="customer.lastName"]').fill(data.lastName);
        await this.page.locator('[id="customer.address.street"]').fill(data.street);
        await this.page.locator('[id="customer.address.city"]').fill(data.city);
        await this.page.locator('[id="customer.address.state"]').fill(data.state);
        await this.page.locator('[id="customer.address.zipCode"]').fill(data.zipCode);
        await this.page.locator('[id="customer.phoneNumber"]').fill(data.phoneNumber);
        await this.page.locator('[id="customer.ssn"]').fill(data.ssn);
        await this.page.locator('[id="customer.username"]').fill(username);
        await this.page.locator('[id="customer.password"]').fill(data.password);
        await this.page.locator('#repeatedPassword').fill(data.confirmPassword);
        await this.page.getByRole('button', { name: 'Register' }).click();
    }
}