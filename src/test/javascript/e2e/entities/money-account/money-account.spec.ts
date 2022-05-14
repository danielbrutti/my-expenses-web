import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MoneyAccountComponentsPage, MoneyAccountDeleteDialog, MoneyAccountUpdatePage } from './money-account.page-object';

const expect = chai.expect;

describe('MoneyAccount e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let moneyAccountComponentsPage: MoneyAccountComponentsPage;
  let moneyAccountUpdatePage: MoneyAccountUpdatePage;
  let moneyAccountDeleteDialog: MoneyAccountDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load MoneyAccounts', async () => {
    await navBarPage.goToEntity('money-account');
    moneyAccountComponentsPage = new MoneyAccountComponentsPage();
    await browser.wait(ec.visibilityOf(moneyAccountComponentsPage.title), 5000);
    expect(await moneyAccountComponentsPage.getTitle()).to.eq('myExpensesApp.moneyAccount.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(moneyAccountComponentsPage.entities), ec.visibilityOf(moneyAccountComponentsPage.noResult)),
      1000
    );
  });

  it('should load create MoneyAccount page', async () => {
    await moneyAccountComponentsPage.clickOnCreateButton();
    moneyAccountUpdatePage = new MoneyAccountUpdatePage();
    expect(await moneyAccountUpdatePage.getPageTitle()).to.eq('myExpensesApp.moneyAccount.home.createOrEditLabel');
    await moneyAccountUpdatePage.cancel();
  });

  it('should create and save MoneyAccounts', async () => {
    const nbButtonsBeforeCreate = await moneyAccountComponentsPage.countDeleteButtons();

    await moneyAccountComponentsPage.clickOnCreateButton();

    await promise.all([
      moneyAccountUpdatePage.setAccountNameInput('accountName'),
      moneyAccountUpdatePage.setInitialBalanceInput('5'),
      moneyAccountUpdatePage.accountTypeSelectLastOption(),
      moneyAccountUpdatePage.currencySelectLastOption(),
    ]);

    expect(await moneyAccountUpdatePage.getAccountNameInput()).to.eq(
      'accountName',
      'Expected AccountName value to be equals to accountName'
    );
    expect(await moneyAccountUpdatePage.getInitialBalanceInput()).to.eq('5', 'Expected initialBalance value to be equals to 5');

    await moneyAccountUpdatePage.save();
    expect(await moneyAccountUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await moneyAccountComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last MoneyAccount', async () => {
    const nbButtonsBeforeDelete = await moneyAccountComponentsPage.countDeleteButtons();
    await moneyAccountComponentsPage.clickOnLastDeleteButton();

    moneyAccountDeleteDialog = new MoneyAccountDeleteDialog();
    expect(await moneyAccountDeleteDialog.getDialogTitle()).to.eq('myExpensesApp.moneyAccount.delete.question');
    await moneyAccountDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(moneyAccountComponentsPage.title), 5000);

    expect(await moneyAccountComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
