import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly bankManagerLoginBtn: Locator;
    readonly customerLoginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.bankManagerLoginBtn = page.getByText('Bank Manager Login');
        this.customerLoginBtn = page.getByText('Customer Login');
    }

    async goto() {
        // TODO: investigate why baseUrl and .env URL redirects globalsqa home page
        // instead of bank project
        // await this.page.goto('/#/login');
        await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    }

    async loginAsBankManager() {
        await this.goto();
        await expect(this.bankManagerLoginBtn).toBeVisible();
        await this.bankManagerLoginBtn.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }

    async loginAsCustomer() {
        await this.goto();
        await expect(this.customerLoginBtn).toBeVisible();
        await this.customerLoginBtn.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }
}