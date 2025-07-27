import { ActionReducerMap } from '@ngrx/store';
import { CustomerState } from './customer.state';
import { customerDetailReducer } from './customerDetail/customerDetail.reducer';
export {createReducer} from '@ngrx/store';
export const customerReducer: ActionReducerMap<CustomerState>={
    currentCustomerDetail: customerDetailReducer,
}