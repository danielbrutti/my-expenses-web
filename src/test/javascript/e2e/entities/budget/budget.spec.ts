import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BudgetComponentsPage, BudgetDeleteDialog, BudgetUpdatePage } from './budget.page-object';

const expect = chai.expect;

describe('Budget e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let budgetComponentsPage: BudgetComponentsPage;
  let budgetUpdatePage: BudgetUpdatePage;
  let budgetDeleteDialog: BudgetDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Budgets', async () => {
    await navBarPage.goToEntity('budget');
    budgetComponentsPage = new BudgetComponentsPage();
    await browser.wait(ec.visibilityOf(budgetComponentsPage.title), 5000);
    expect(await budgetComponentsPage.getTitle()).to.eq('myExpensesApp.budget.home.title');
    await browser.wait(ec.or(ec.visibilityOf(budgetComponentsPage.entities), ec.visibilityOf(budgetComponentsPage.noResult)), 1000);
  });

  it('should load create Budget page', async () => {
    await budgetComponentsPage.clickOnCreateButton();
    budgetUpdatePage = new BudgetUpdatePage();
    expect(await budgetUpdatePage.getPageTitle()).to.eq('myExpensesApp.budget.home.createOrEditLabel');
    await budgetUpdatePage.cancel();
  });

  it('should create and save Budgets', async () => {
    const nbButtonsBeforeCreate = await budgetComponentsPage.countDeleteButtons();

    await budgetComponentsPage.clickOnCreateButton();

    await promise.all([budgetUpdatePage.setYearMonthInput('yearMonth'), budgetUpdatePage.setDateInput('2000-12-31')]);

    expect(await budgetUpdatePage.getYearMonthInput()).to.eq('yearMonth', 'Expected YearMonth value to be equals to yearMonth');
    expect(await budgetUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');

    await budgetUpdatePage.save();
    expect(await budgetUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await budgetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Budget', async () => {
    const nbButtonsBeforeDelete = await budgetComponentsPage.countDeleteButtons();
    await budgetComponentsPage.clickOnLastDeleteButton();

    budgetDeleteDialog = new BudgetDeleteDialog();
    expect(await budgetDeleteDialog.getDialogTitle()).to.eq('myExpensesApp.budget.delete.question');
    await budgetDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(budgetComponentsPage.title), 5000);

    expect(await budgetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
