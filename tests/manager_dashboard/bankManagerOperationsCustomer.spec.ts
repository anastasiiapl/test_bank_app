import { expect } from '@playwright/test';
import { test } from '../../test-options';
import { generateCustomer } from '../../helpers/generate-customer-data';
import { Customer } from '../../types';
import { createDialogHandler } from '../../helpers/handle-dialog';

const existingCustomer: Customer = {
    firstName: 'Hermoine',
    lastName: 'Granger',
    postcode: 'E859AB',
}

test.describe('Bank Manager Operations: Customer', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginAsBankManager();
    });

    test('should be able to create a new customer', async ({ page, managerDashboard }) => {
        const customer = generateCustomer();

        page.on(
            'dialog',
            createDialogHandler('Customer added successfully with customer id')
        );

        await managerDashboard.addNewCustomer(customer);
        await managerDashboard.navigateToCustomerList();

        // await page.waitForSelector(`[role="row"]:has-text("${customer.firstName}")`, { state: 'visible' });

        expect(page.getByRole('row', { name: customer.firstName })).toBeVisible();
    });

    test('should not be able to add duplicate customer', async ({ page, managerDashboard }) => {
        page.on(
            'dialog',
            createDialogHandler('Please check the details. Customer may be duplicate.')
        );

        await managerDashboard.addNewCustomer(existingCustomer);
        await managerDashboard.navigateToCustomerList();

        expect(
            await page.getByRole('row', { name: existingCustomer.firstName })
                .count()
        ).toBe(1);
    });

    test("should not be able to create a customer without required data", async ({ page, managerDashboard }) => {
        const errorText = 'Please fill out this field.';
        const customer = generateCustomer();

        await managerDashboard.addCustomerBtn.click();
        await managerDashboard.submitBtn.click();

        let nativeMessage = await managerDashboard.firstNameInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(nativeMessage).toBe(errorText);


        await managerDashboard.firstNameInput.fill(customer.firstName);
        nativeMessage = await managerDashboard.lastNameInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(nativeMessage).toBe(errorText);

        await managerDashboard.lastNameInput.fill(customer.lastName);
        nativeMessage = await managerDashboard.postcodeInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(nativeMessage).toBe(errorText);
    });
});