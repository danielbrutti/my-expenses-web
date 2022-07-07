import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  BudgetItemComponentsPage,
  /* BudgetItemDeleteDialog, */
  BudgetItemUpdatePage,
} from './budget-item.page-object';

const expect = chai.expect;

describe('BudgetItem e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let budgetItemComponentsPage: BudgetItemComponentsPage;
  let budgetItemUpdatePage: BudgetItemUpdatePage;
  /* let budgetItemDeleteDialog: BudgetItemDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BudgetItems', async () => {
    await navBarPage.goToEntity('budget-item');
    budgetItemComponentsPage = new BudgetItemComponentsPage();
    await browser.wait(ec.visibilityOf(budgetItemComponentsPage.title), 5000);
    expect(await budgetItemComponentsPage.getTitle()).to.eq('myExpensesApp.budgetItem.home.title');
    await browser.wait(ec.or(ec.visibilityOf(budgetItemComponentsPage.entities), ec.visibilityOf(budgetItemComponentsPage.noResult)), 1000);
  });

  it('should load create BudgetItem page', async () => {
    await budgetItemComponentsPage.clickOnCreateButton();
    budgetItemUpdatePage = new BudgetItemUpdatePage();
    expect(await budgetItemUpdatePage.getPageTitle()).to.eq('myExpensesApp.budgetItem.home.createOrEditLabel');
    await budgetItemUpdatePage.cancel();
  });

  /* it('should create and save BudgetItems', async () => {
        const nbButtonsBeforeCreate = await budgetItemComponentsPage.countDeleteButtons();

        await budgetItemComponentsPage.clickOnCreateButton();

        await promise.all([
            budgetItemUpdatePage.setAmountInput('5'),
            budgetItemUpdatePage.budgetSelectLastOption(),
            budgetItemUpdatePage.categorySelectLastOption(),
        ]);

        expect(await budgetItemUpdatePage.getAmountInput()).to.eq('5', 'Expected amount value to be equals to 5');

        await budgetItemUpdatePage.save();
        expect(await budgetItemUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await budgetItemComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last BudgetItem', async () => {
        const nbButtonsBeforeDelete = await budgetItemComponentsPage.countDeleteButtons();
        await budgetItemComponentsPage.clickOnLastDeleteButton();

        budgetItemDeleteDialog = new BudgetItemDeleteDialog();
        expect(await budgetItemDeleteDialog.getDialogTitle())
            .to.eq('myExpensesApp.budgetItem.delete.question');
        await budgetItemDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(budgetItemComponentsPage.title), 5000);

        expect(await budgetItemComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
