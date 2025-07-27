import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { customerDetailReducer } from "./stores/customerDetail/customerDetail.reducer";
import { CustomerDetailEffects } from "./stores/customerDetail/customerDetail.effect";
import { Routes } from "@angular/router";
const registrationProviders = [
  provideState({ name: 'customerDetail', reducer: customerDetailReducer }),
  provideEffects(CustomerDetailEffects)
];

export const customersRoutes:Routes=[
    {
        path:'/customer-registration',
        loadComponent: () => import('./pages/registration/view.registration').then(m => m.ViewRegistrationComponent),
        providers: registrationProviders
    }
]