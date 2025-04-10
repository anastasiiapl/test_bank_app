import { expect, type Locator, type Page } from '@playwright/test';
import { Customer } from '../types';

export class ManagerDashboard {
    readonly page: Page;
    readonly addCustomerBtn: Locator;
    readonly openAccountBtn: Locator;
    readonly customersBtn: Locator;

    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postcodeInput: Locator;
    readonly submitBtn: Locator;

    readonly selectCustomerDropdown: Locator;
    readonly selectCurrencyDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addCustomerBtn = page.locator('[ng-class="btnClass1"]');
        this.openAccountBtn = page.locator('[ng-class="btnClass2"]');
        this.customersBtn = page.locator('[ng-class="btnClass3"]');

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postcodeInput = page.getByPlaceholder('Post Code');

        this.submitBtn = page.locator('button[type="submit"]');

        this.selectCustomerDropdown = page.locator('[id="userSelect"]');
        this.selectCurrencyDropdown = page.locator('[id="currency"]');
    }

    async addNewCustomer(data: Customer) {
        await this.addCustomerBtn.click();

        await this.firstNameInput.clear();
        await this.firstNameInput.fill(data.firstName);

        await this.lastNameInput.clear();
        await this.lastNameInput.fill(data.lastName);

        await this.postcodeInput.clear();
        await this.postcodeInput.fill(data.postcode);

        await this.submitBtn.click({ force: true });
    }

    async navigateToCustomerList() {
        await this.customersBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('[placeholder="Search Customer"]');
    }

    async navigateToOpenAccPage() {
        await this.openAccountBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.selectCurrencyDropdown.waitFor({ state: 'visible' });
    }
}