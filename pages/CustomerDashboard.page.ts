import { expect, type Locator, type Page } from '@playwright/test';
import { TransactionType } from '../types';

export class CustomerDashboard {
    readonly page: Page;
    readonly transactionsBtn: Locator;
    readonly depositBtn: Locator;
    readonly withdrawBtn: Locator;
    readonly amountInput: Locator;
    readonly submitBtn: Locator;
    readonly balance: Locator;

    constructor(page: Page) {
        this.page = page;
        this.transactionsBtn = page.locator('[ng-class="btnClass1"]');
        this.depositBtn = page.locator('[ng-class="btnClass2"]');
        this.withdrawBtn = page.locator('[ng-class="btnClass3"]');
        this.amountInput = page.locator('[ng-model="amount"]');
        this.submitBtn = page.locator('button[type="submit"]');
        this.balance = page.locator('div.center .ng-binding').nth(1);
    }

    async depositFunds(amonut: string) {
        this.depositBtn.click({ force: true });
        await this.page.waitForSelector('[ng-model="amount"]', { state: 'visible' });
        this.amountInput.fill(amonut);

        this.submitBtn.click();
        await this.page.waitForSelector('[ng-show="message"]', { state: 'visible' });
    }

    async verifyBalance(expected: string) {
        await this.balance.waitFor({ state: 'visible' });
        expect(this.balance).toHaveText(expected);
    }

    async verifyTransactionList(type: TransactionType) {
        await this.transactionsBtn.click({ force: true });
        await this.page.waitForLoadState('networkidle');
        // this part fails
        // as transaction table is not rendering
        await this.page.waitForSelector('table tbody tr', { state: 'visible' });

        const matchingRow = this.page.locator('table tbody tr');
        expect(matchingRow).toHaveText(type);
    }
}