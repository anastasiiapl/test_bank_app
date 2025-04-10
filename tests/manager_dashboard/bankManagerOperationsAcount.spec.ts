import { expect } from '@playwright/test';
import { test } from '../../test-options';
import { generateCustomer } from '../../helpers/generate-customer-data';
import { Customer } from '../../types';
import { createDialogHandler, createAddAccountDialogHandler } from '../../helpers/handle-dialog';

const customer: Customer = generateCustomer();

const createCustomerDialogHandler = createDialogHandler('Customer added successfully with customer id');
const setAccountNumber = (accountNumber: string) => {
    customer.accountNumber = accountNumber;
};

['Dollar', 'Pound', 'Rupee'].forEach(currency => {
    test.describe('Bank Manager Operations: Account', () => {
        test.beforeEach(async ({ loginPage, managerDashboard, page }) => {
            // TODO: move to a global setup
            await loginPage.loginAsBankManager();

            page.on('dialog', createCustomerDialogHandler);

            await managerDashboard.addNewCustomer(customer);
            await managerDashboard.navigateToCustomerList();

            expect(page.getByRole('row', { name: customer.firstName })).toBeVisible();
        });

        test(`should be able to add a ${currency} account for existing customer`, async ({ managerDashboard, page }) => {
            page.off('dialog', createCustomerDialogHandler)
            page.on('dialog', createAddAccountDialogHandler(setAccountNumber));

            await managerDashboard.navigateToOpenAccPage();

            await managerDashboard.selectCustomerDropdown.selectOption(`${customer.firstName} ${customer.lastName}`);
            await managerDashboard.selectCurrencyDropdown.selectOption(currency);
            await managerDashboard.submitBtn.click();

            await managerDashboard.navigateToCustomerList();
            expect(page.getByRole('row', { name: customer.accountNumber })).toBeVisible();
        });
    });
});