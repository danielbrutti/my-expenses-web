import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'money-account',
        data: { pageTitle: 'myExpensesApp.moneyAccount.home.title' },
        loadChildren: () => import('./money-account/money-account.module').then(m => m.MoneyAccountModule),
      },
      {
        path: 'currency',
        data: { pageTitle: 'myExpensesApp.currency.home.title' },
        loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule),
      },
      {
        path: 'account-record',
        data: { pageTitle: 'myExpensesApp.accountRecord.home.title' },
        loadChildren: () => import('./account-record/account-record.module').then(m => m.AccountRecordModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'myExpensesApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'category-rule',
        data: { pageTitle: 'myExpensesApp.categoryRule.home.title' },
        loadChildren: () => import('./category-rule/category-rule.module').then(m => m.CategoryRuleModule),
      },
      {
        path: 'budget',
        data: { pageTitle: 'myExpensesApp.budget.home.title' },
        loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule),
      },
      {
        path: 'budget-item',
        data: { pageTitle: 'myExpensesApp.budgetItem.home.title' },
        loadChildren: () => import('./budget-item/budget-item.module').then(m => m.BudgetItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
