import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap} from 'rxjs/operators';
import { of } from 'rxjs';
import { login, LoginFailure, setUser } from './app.action'; // Adjust the import path as necessary
import { AuthService } from '../core/services/authentication.services'; // if available

@Injectable({ providedIn: 'root' })
export class AuthenticateUserEffects {
  constructor(
    private actions$: Actions,
    @Inject('AuthService') private authService: AuthService
  ) {}

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ userName, password }) => {
        try {
          const user = this.authService.login(userName, password);
          return of(
            setUser({
              userId: user.username,
              role: user.role,
              detailId: user.detailId,
              loading:false
            })
          );
        } catch (error: any) {
          return of(LoginFailure({ error: error.message }));
        }
      })
    )
  );
}