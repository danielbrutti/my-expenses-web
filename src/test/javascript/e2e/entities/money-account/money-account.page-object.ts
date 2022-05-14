import { element, by, ElementFinder } from 'protractor';

export class MoneyAccountComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-money-account div table .btn-danger'));
  title = element.all(by.css('jhi-money-account div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class MoneyAccountUpdatePage {
  pageTitle = element(by.id('jhi-money-account-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  accountNameInput = element(by.id('field_accountName'));
  initialBalanceInput = element(by.id('field_initialBalance'));
  accountTypeSelect = element(by.id('field_accountType'));

  currencySelect = element(by.id('field_currency'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAccountNameInput(accountName: string): Promise<void> {
    await this.accountNameInput.sendKeys(accountName);
  }

  async getAccountNameInput(): Promise<string> {
    return await this.accountNameInput.getAttribute('value');
  }

  async setInitialBalanceInput(initialBalance: string): Promise<void> {
    await this.initialBalanceInput.sendKeys(initialBalance);
  }

  async getInitialBalanceInput(): Promise<string> {
    return await this.initialBalanceInput.getAttribute('value');
  }

  async setAccountTypeSelect(accountType: string): Promise<void> {
    await this.accountTypeSelect.sendKeys(accountType);
  }

  async getAccountTypeSelect(): Promise<string> {
    return await this.accountTypeSelect.element(by.css('option:checked')).getText();
  }

  async accountTypeSelectLastOption(): Promise<void> {
    await this.accountTypeSelect.all(by.tagName('option')).last().click();
  }

  async currencySelectLastOption(): Promise<void> {
    await this.currencySelect.all(by.tagName('option')).last().click();
  }

  async currencySelectOption(option: string): Promise<void> {
    await this.currencySelect.sendKeys(option);
  }

  getCurrencySelect(): ElementFinder {
    return this.currencySelect;
  }

  async getCurrencySelectedOption(): Promise<string> {
    return await this.currencySelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class MoneyAccountDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-moneyAccount-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-moneyAccount'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
