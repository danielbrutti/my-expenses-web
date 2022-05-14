import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CategoryRuleComponentsPage, CategoryRuleDeleteDialog, CategoryRuleUpdatePage } from './category-rule.page-object';

const expect = chai.expect;

describe('CategoryRule e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let categoryRuleComponentsPage: CategoryRuleComponentsPage;
  let categoryRuleUpdatePage: CategoryRuleUpdatePage;
  let categoryRuleDeleteDialog: CategoryRuleDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load CategoryRules', async () => {
    await navBarPage.goToEntity('category-rule');
    categoryRuleComponentsPage = new CategoryRuleComponentsPage();
    await browser.wait(ec.visibilityOf(categoryRuleComponentsPage.title), 5000);
    expect(await categoryRuleComponentsPage.getTitle()).to.eq('myExpensesApp.categoryRule.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(categoryRuleComponentsPage.entities), ec.visibilityOf(categoryRuleComponentsPage.noResult)),
      1000
    );
  });

  it('should load create CategoryRule page', async () => {
    await categoryRuleComponentsPage.clickOnCreateButton();
    categoryRuleUpdatePage = new CategoryRuleUpdatePage();
    expect(await categoryRuleUpdatePage.getPageTitle()).to.eq('myExpensesApp.categoryRule.home.createOrEditLabel');
    await categoryRuleUpdatePage.cancel();
  });

  it('should create and save CategoryRules', async () => {
    const nbButtonsBeforeCreate = await categoryRuleComponentsPage.countDeleteButtons();

    await categoryRuleComponentsPage.clickOnCreateButton();

    await promise.all([categoryRuleUpdatePage.setMatchInput('match'), categoryRuleUpdatePage.categorySelectLastOption()]);

    expect(await categoryRuleUpdatePage.getMatchInput()).to.eq('match', 'Expected Match value to be equals to match');

    await categoryRuleUpdatePage.save();
    expect(await categoryRuleUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await categoryRuleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last CategoryRule', async () => {
    const nbButtonsBeforeDelete = await categoryRuleComponentsPage.countDeleteButtons();
    await categoryRuleComponentsPage.clickOnLastDeleteButton();

    categoryRuleDeleteDialog = new CategoryRuleDeleteDialog();
    expect(await categoryRuleDeleteDialog.getDialogTitle()).to.eq('myExpensesApp.categoryRule.delete.question');
    await categoryRuleDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(categoryRuleComponentsPage.title), 5000);

    expect(await categoryRuleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
