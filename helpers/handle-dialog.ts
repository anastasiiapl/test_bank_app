import { expect } from '@playwright/test';

export function createDialogHandler(text: string) {
    return async (dialog) => {
      expect(dialog.message()).toContain(text);
      await dialog.dismiss();
    };
  }

  export function createAddAccountDialogHandler(
    onAccountNumberReceived: (accountNumber: string) => void
  ) {
    return async (dialog) => {
      const dialogMessage = dialog.message();
      const accountNumber = dialogMessage.split(':')[1]?.trim();
      
      expect(dialogMessage).toContain('Account created successfully with account Number');
      await dialog.dismiss();
      
      // Call the callback with the extracted account number.
      onAccountNumberReceived(accountNumber);
    };
  }