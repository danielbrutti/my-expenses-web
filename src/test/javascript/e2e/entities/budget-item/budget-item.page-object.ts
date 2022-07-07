import { element, by, ElementFinder } from 'protractor';

export class BudgetItemComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-budget-item div table .btn-danger'));
  title = element.all(by.css('jhi-budget-item div h2#page-heading span')).first();
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

export class BudgetItemUpdatePage {
  pageTitle = element(by.id('jhi-budget-item-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  amountInput = element(by.id('field_amount'));

  budgetSelect = element(by.id('field_budget'));
  categorySelect = element(by.id('field_category'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getAttribute('value');
  }

  async budgetSelectLastOption(): Promise<void> {
    await this.budgetSelect.all(by.tagName('option')).last().click();
  }

  async budgetSelectOption(option: string): Promise<void> {
    await this.budgetSelect.sendKeys(option);
  }

  getBudgetSelect(): ElementFinder {
    return this.budgetSelect;
  }

  async getBudgetSelectedOption(): Promise<string> {
    return await this.budgetSelect.element(by.css('option:checked')).getText();
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

export class BudgetItemDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-budgetItem-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-budgetItem'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
