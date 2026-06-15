import { APIRequestContext } from "@playwright/test";
import apidata from "../data/api.json";

export default class BankApiPage {
    constructor(private request: APIRequestContext) {}
    async getAccount(accountId: string) {
        return this.request.get(`${apidata.BaseURL}/accounts/${accountId}`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
    }
    async getCustomerAccounts(customerId: number) {
        return this.request.get(`${apidata.BaseURL}/customers/${customerId}/accounts`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
    }
    async getCustomerAccountsRaw(customerId: string) {
        return this.request.get(`${apidata.BaseURL}/customers/${customerId}/accounts`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
    }
    async getCustomerId(accountId: string): Promise<number> {
        const response = await this.getAccount(accountId);
        const accountData = await response.json();
        return accountData.customerId;
    }
    async getAccountData(accountId: string) {
        const response = await this.getAccount(accountId);
        return response.json();
    }
    async getCustomerAccountsData(customerId: number) {
        const response = await this.getCustomerAccounts(customerId);
        return response.json();
    }
}