import { Page } from "@playwright/test";
export default class HomePage {
  constructor(private page: Page) {}
  async goto(url: string) {
    await this.page.goto(url);
  }
  async clickRegister() {
    await this.page.locator('a[href="register.htm"]').click();
  }
}