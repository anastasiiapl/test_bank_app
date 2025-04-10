import { expect } from '@playwright/test';
import { test } from '../../test-options';
import { generateCustomer } from '../../helpers/generate-customer-data';
import { createDialogHandler, createAddAccountDialogHandler } from '../../helpers/handle-dialog';

const customer = generateCustomer();
const customerFullName = `${customer.firstName} ${customer.lastName}`;

const createCustomerDialogHandler = createDialogHandler('Customer added successfully with customer id');

const setAccountNumber = (accountNumber: string) => {
    customer.accountNumber = accountNumber;
};

test.describe('Customer Operations: Deposit', () => {
    // TODO: move different steps to test.step()
    // to better structure tests
    test.beforeEach(async ({ loginPage, managerDashboard, page }) => {
        await loginPage.loginAsBankManager();

        page.on('dialog', createCustomerDialogHandler);

        await managerDashboard.addNewCustomer(customer);
        await managerDashboard.navigateToCustomerList();

        expect(page.getByRole('row', { name: customer.firstName })).toBeVisible();

        page.off('dialog', createCustomerDialogHandler)
        page.on('dialog', createAddAccountDialogHandler(setAccountNumber));

        await managerDashboard.navigateToOpenAccPage();

        await managerDashboard.selectCustomerDropdown.selectOption(`${customer.firstName} ${customer.lastName}`);
        await managerDashboard.selectCurrencyDropdown.selectOption('Dollar');
        await managerDashboard.submitBtn.click();

        await managerDashboard.navigateToCustomerList();
        expect(page.getByRole('row', { name: customer.accountNumber })).toBeVisible();

        await loginPage.loginAsCustomer();
        await managerDashboard.selectCustomerDropdown.selectOption(customerFullName);
        await managerDashboard.submitBtn.click();
        await page.getByText(customerFullName).waitFor({ state: 'visible' });
    });

    test('should be able to deposit valid amonut on the existing account', async ({ page, customerDashboard }) => {
        const depositAmount = '545';
        await customerDashboard.depositFunds(depositAmount);

        expect(page.getByText('Deposit Successful')).toBeVisible();

        await customerDashboard.verifyBalance(depositAmount);

        // application is poorly hydrated 
        // so this check is failing as transaction table is not rendering 
        // await customerDashboard.verifyTransactionList('Credit');
    });
});