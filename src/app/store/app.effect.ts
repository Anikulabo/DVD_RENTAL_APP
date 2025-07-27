import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map} from 'rxjs/operators';
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
      exhaustMap(({ userName, password }) =>
        this.authService.login(userName, password).pipe(
          map((user) =>
            setUser({
              userId: Number(user.username),
              role: user.role as "customer" | "staff" | "admin",
              detailId: Number(user.detailId),
              loading: false
            })
          ),
          catchError((error) =>
            of(LoginFailure({ error: error.message }))
          )
        )
      )
    )
  );
}