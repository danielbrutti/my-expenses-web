import { element, by, ElementFinder } from 'protractor';

export class AccountRecordComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-account-record div table .btn-danger'));
  title = element.all(by.css('jhi-account-record div h2#page-heading span')).first();
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

export class AccountRecordUpdatePage {
  pageTitle = element(by.id('jhi-account-record-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  dateInput = element(by.id('field_date'));
  amountInput = element(by.id('field_amount'));
  typeSelect = element(by.id('field_type'));

  categorySelect = element(by.id('field_category'));
  accountSelect = element(by.id('field_account'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getAttribute('value');
  }

  async setTypeSelect(type: string): Promise<void> {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }

  async categorySelectLastOption(): Promise<void> {
    await this.categorySelect.all(by.tagName('option')).last().click();
  }

  async categorySelectOption(option: string): Promise<void> {
    await this.categorySelect.sendKeys(option);
  }

  getCategorySelect(): ElementFinder {
    return this.categorySelect;
  }

  async getCategorySelectedOption(): Promise<string> {
    return await this.categorySelect.element(by.css('option:checked')).getText();
  }

  async accountSelectLastOption(): Promise<void> {
    await this.accountSelect.all(by.tagName('option')).last().click();
  }

  async accountSelectOption(option: string): Promise<void> {
    await this.accountSelect.sendKeys(option);
  }

  getAccountSelect(): ElementFinder {
    return this.accountSelect;
  }

  async getAccountSelectedOption(): Promise<string> {
    return await this.accountSelect.element(by.css('option:checked')).getText();
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

export class AccountRecordDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-accountRecord-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-accountRecord'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
