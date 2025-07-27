import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  loadCustomerDetail,
  updateCurrentCustomerDetail,
  resetCurrentCustomerDetail,
  saveCustomer,
} from './customerDetail.action';
import {
  catchError,
  exhaustMap,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { selectDetailId } from '../../../../store/app.selector'; // Update path as needed
import { AppState } from '../../../../store/app.state'; // Adjust path
import { CustomersRegistrationServices } from '../../../../core/services/customerRegistration.services';
import { CustomerRegistrationDTO } from '../../../../core/model';
import {
  selectCustomerDetailState,
} from '../customer.selector';

@Injectable()
export class CustomerDetailEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    @Inject('CustomersRegistrationServices')
    private customerService: CustomersRegistrationServices
  ) {}

  loadCustomerDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerDetail),
      withLatestFrom(this.store.pipe(select(selectDetailId))),
      exhaustMap(([action, detailId]) => {
        if (detailId === null) {
          return of(resetCurrentCustomerDetail());
        }
        return this.customerService
          .getCustomerRegitrationDetailByCustomerId(detailId)
          .pipe(
            map((customerDetail: CustomerRegistrationDTO | null) =>
              customerDetail
                ? updateCurrentCustomerDetail(customerDetail)
                : resetCurrentCustomerDetail()
            ),
            catchError((error) => {
              console.error('Error loading customer detail:', error);
              return of(resetCurrentCustomerDetail());
            })
          );
      })
    )
  );
  saveCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveCustomer),
      withLatestFrom(this.store.pipe(select(selectCustomerDetailState))),
      exhaustMap(([action, customerDetail]) => {
        if (!customerDetail) {
          return of(resetCurrentCustomerDetail());
        }
        return this.customerService
          .registerOrUpdateCustomer(customerDetail, 'add')
          .pipe(
            tap(() =>
              console.log('Customer saved successfully:', customerDetail)
            ),
            map(() => resetCurrentCustomerDetail()),
            catchError((error) => {
              console.error('Error saving customer:', error);
              return of(resetCurrentCustomerDetail());
            })
          );
      })
    )
  );
}
