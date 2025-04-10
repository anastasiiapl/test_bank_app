export type Customer = {
    firstName: string;
    lastName: string;
    postcode: string;
    id?: string;
    accountNumber?: string;
};

export type TransactionType = 'Credit' | 'Debit';