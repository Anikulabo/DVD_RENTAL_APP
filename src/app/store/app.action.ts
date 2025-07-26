import { createAction,props } from '@ngrx/store';
export const login = createAction(
  '[app] Login',
  (userName: string, password: string) => ({ userName, password })
);
export const  LoginFailure = createAction(
  '[app] Login Failure',props<{ error: string }>()
);
export const logout = createAction('[app] Logout');
export const setUser = createAction(
  '[app] Set User',
  props<{ userId: number; role: 'customer' | 'staff' | 'admin'; detailId: number,loading:false }>()
);
