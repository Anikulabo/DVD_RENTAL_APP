import { Routes } from '@angular/router';
import { provideState,combineReducers } from "@ngrx/store";
import { customerReducer } from './pages/Customers/stores/customer.reducer';
const customerCombinedReducer = combineReducers(customerReducer);
const customerProviders = [provideState({ name: 'customer', reducer: customerCombinedReducer })];
export const routes: Routes = [{
    path: 'customers',
    loadChildren: () => import('./pages/Customers/customers.route').then(m => m.customersRoutes),
    providers: customerProviders
}];
