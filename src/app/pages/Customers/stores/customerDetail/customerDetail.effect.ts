import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { loadCustomerDetail, updateCurrentCustomerDetail, resetCurrentCustomerDetail, saveCustomer } from './customerDetail.action';
import { exhaustMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectDetailId } from '../../../../store/app.selector'; // Update path as needed
import { AppState } from '../../../../store/app.state';       // Adjust path
import { CustomersRegistrationServices } from '../../../../core/services/customerRegistration.services';
import { CustomerDetailDTO } from '../../../../core/model';

@Injectable()
export class CustomerDetailEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    @Inject('CustomersRegistrationServices') private customerService: CustomersRegistrationServices // Replace `any` with proper service type
  ) {}

  loadCustomerDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerDetail),
    withLatestFrom(this.store.pipe(select(selectDetailId))),
    exhaustMap(([action, detailId]) => {
      if (detailId === null) {
        return of(resetCurrentCustomerDetail());
      }
     try {
          const customerDetail: CustomerDetailDTO = this.customerService.getCustomerDetailById(detailId);
          return of(
            updateCurrentCustomerDetail({
              firstName: customerDetail.fullName.split(' ')[0],
              lastName: customerDetail.fullName.split(' ')[1] ?? ''
            })
          );
        } catch (error) {
          console.error('Error loading customer detail:', error);
          return of(resetCurrentCustomerDetail());
        }
    }),
  ));
}
