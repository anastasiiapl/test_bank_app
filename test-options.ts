import {test as base} from '@playwright/test';
import { LoginPage } from './pages/Login.page';
import { ManagerDashboard } from './pages/ManagerDashboard.page';
import { CustomerDashboard } from './pages/CustomerDashboard.page';

export type TestOptions = {
    loginPage: LoginPage;
    managerDashboard: ManagerDashboard;
    customerDashboard: CustomerDashboard;
}

export const test = base.extend<TestOptions>({
    loginPage: async({page}, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    managerDashboard: async({page}, use) => {
        const managerDashboard = new ManagerDashboard(page);
        await use(managerDashboard);
    },
    customerDashboard: async({ page }, use) => {
        const customerDashboard = new CustomerDashboard(page);
        await use(customerDashboard);
    },
});