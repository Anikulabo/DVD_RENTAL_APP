import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';
export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

export const selectCustomerDetailState = createSelector(
  selectCustomerState,
  (state) => state.currentCustomerDetail
);
export const selectCustomerFirstName = createSelector(
  selectCustomerDetailState,
  (state) => state.firstName
);
export const selectCustomerId = createSelector(
  selectCustomerDetailState,
  (state) => state.customerId
);