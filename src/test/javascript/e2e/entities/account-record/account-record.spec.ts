import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AccountRecordComponentsPage, AccountRecordDeleteDialog, AccountRecordUpdatePage } from './account-record.page-object';

const expect = chai.expect;

describe('AccountRecord e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let accountRecordComponentsPage: AccountRecordComponentsPage;
  let accountRecordUpdatePage: AccountRecordUpdatePage;
  let accountRecordDeleteDialog: AccountRecordDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load AccountRecords', async () => {
    await navBarPage.goToEntity('account-record');
    accountRecordComponentsPage = new AccountRecordComponentsPage();
    await browser.wait(ec.visibilityOf(accountRecordComponentsPage.title), 5000);
    expect(await accountRecordComponentsPage.getTitle()).to.eq('myExpensesApp.accountRecord.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(accountRecordComponentsPage.entities), ec.visibilityOf(accountRecordComponentsPage.noResult)),
      1000
    );
  });

  it('should load create AccountRecord page', async () => {
    await accountRecordComponentsPage.clickOnCreateButton();
    accountRecordUpdatePage = new AccountRecordUpdatePage();
    expect(await accountRecordUpdatePage.getPageTitle()).to.eq('myExpensesApp.accountRecord.home.createOrEditLabel');
    await accountRecordUpdatePage.cancel();
  });

  it('should create and save AccountRecords', async () => {
    const nbButtonsBeforeCreate = await accountRecordComponentsPage.countDeleteButtons();

    await accountRecordComponentsPage.clickOnCreateButton();

    await promise.all([
      accountRecordUpdatePage.setDateInput('2000-12-31'),
      accountRecordUpdatePage.setAmountInput('5'),
      accountRecordUpdatePage.typeSelectLastOption(),
      accountRecordUpdatePage.categorySelectLastOption(),
      accountRecordUpdatePage.accountSelectLastOption(),
    ]);

    expect(await accountRecordUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await accountRecordUpdatePage.getAmountInput()).to.eq('5', 'Expected amount value to be equals to 5');

    await accountRecordUpdatePage.save();
    expect(await accountRecordUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await accountRecordComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last AccountRecord', async () => {
    const nbButtonsBeforeDelete = await accountRecordComponentsPage.countDeleteButtons();
    await accountRecordComponentsPage.clickOnLastDeleteButton();

    accountRecordDeleteDialog = new AccountRecordDeleteDialog();
    expect(await accountRecordDeleteDialog.getDialogTitle()).to.eq('myExpensesApp.accountRecord.delete.question');
    await accountRecordDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(accountRecordComponentsPage.title), 5000);

    expect(await accountRecordComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
