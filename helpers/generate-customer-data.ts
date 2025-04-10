import { faker } from '@faker-js/faker';
import { Customer } from '../types';

export const generateCustomer = (): Customer => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postcode: faker.location.zipCode('####'),
    }
}