import { createReducer, on } from '@ngrx/store';
import { CustomerDetailState } from './customerDetail.state';
import { updateCurrentCustomerDetail, resetCurrentCustomerDetail } from './customerDetail.action';
const initialState: CustomerDetailState = {
  firstName: '',
  lastName: '',
  addresses: [],
  cityName: '',
  countryName: '',
  district: '',
  customerId: undefined,
  username: '',
  password: '',
  image: '',
};
export const customerDetailReducer = createReducer(
initialState,
on(updateCurrentCustomerDetail, (state, { customerDetail }) => ({...state, ...customerDetail })),
on(resetCurrentCustomerDetail, () => initialState)
)