import { element, by, ElementFinder } from 'protractor';

export class CurrencyComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-currency div table .btn-danger'));
  title = element.all(by.css('jhi-currency div h2#page-heading span')).first();
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

export class CurrencyUpdatePage {
  pageTitle = element(by.id('jhi-currency-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  currencyNameInput = element(by.id('field_currencyName'));
  symbolInput = element(by.id('field_symbol'));
  usdPriceInput = element(by.id('field_usdPrice'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCurrencyNameInput(currencyName: string): Promise<void> {
    await this.currencyNameInput.sendKeys(currencyName);
  }

  async getCurrencyNameInput(): Promise<string> {
    return await this.currencyNameInput.getAttribute('value');
  }

  async setSymbolInput(symbol: string): Promise<void> {
    await this.symbolInput.sendKeys(symbol);
  }

  async getSymbolInput(): Promise<string> {
    return await this.symbolInput.getAttribute('value');
  }

  async setUsdPriceInput(usdPrice: string): Promise<void> {
    await this.usdPriceInput.sendKeys(usdPrice);
  }

  async getUsdPriceInput(): Promise<string> {
    return await this.usdPriceInput.getAttribute('value');
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

export class CurrencyDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-currency-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-currency'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
