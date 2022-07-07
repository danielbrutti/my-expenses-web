import { element, by, ElementFinder } from 'protractor';

export class BudgetComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-budget div table .btn-danger'));
  title = element.all(by.css('jhi-budget div h2#page-heading span')).first();
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

export class BudgetUpdatePage {
  pageTitle = element(by.id('jhi-budget-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  yearMonthInput = element(by.id('field_yearMonth'));
  dateInput = element(by.id('field_date'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setYearMonthInput(yearMonth: string): Promise<void> {
    await this.yearMonthInput.sendKeys(yearMonth);
  }

  async getYearMonthInput(): Promise<string> {
    return await this.yearMonthInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
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

export class BudgetDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-budget-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-budget'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
