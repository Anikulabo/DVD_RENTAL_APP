import { createAction,props } from '@ngrx/store';
import { CustomerRegistrationDTO } from '../../../../core/model';
// use effect to load customer detail
export const loadCustomerDetail = createAction(
  '[app-view-registration] Load Customer Detail',
  props<{ customerId: number }>()
);
// can work with loadcustomerDetail to update via effevt or could be triggered by user the current customer detail in the store
export const updateCurrentCustomerDetail = createAction(
  '[app-view-registration] update customer Detail',
  (customerDetail: Partial<CustomerRegistrationDTO>) => ({ customerDetail })
);
// will reset the current customer detail in the store via reducer
export const resetCurrentCustomerDetail = createAction(
  '[app-view-registration] reset current customer detail'
);
// would trigger effect for saving or updating user
export const saveCustomer = createAction(
  '[app-view-registration] Save Customer',
  (payload: { data: Partial<CustomerRegistrationDTO>, isUpdate: boolean }) => payload
);
